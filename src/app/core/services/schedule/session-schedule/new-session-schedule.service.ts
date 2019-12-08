import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { GameDay } from 'src/app/views/admin/schedule/models/session/game-day.model';
import LeagueSessionSchedule from 'src/app/views/admin/schedule/models/session/league-session-schedule.model';
import NewSessionSchedule from 'src/app/views/admin/schedule/models/session/new-session-schedule.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { MatchTime } from 'src/app/views/schedule/models/interfaces/match-time.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';

@Injectable({
	providedIn: 'root'
})
export class NewSessionScheduleService {
	private readonly DUMMY: Team = { name: 'BYE' };
	private matchDays = MatchDay;
	private nextDay;
	constructor() {}

	generateSchedules(newSessions: NewSessionSchedule[]): LeagueSessionSchedule[] {
		// should return LeagueSessionSchedule array
		const generatedSessionSchedules: LeagueSessionSchedule[] = [];

		for (let index = 0; index < newSessions.length; index++) {
			const session = newSessions[index];
			const teams: Team[] = session.teams;

			// if we have odd number of teams
			if (teams.length % 2 === 1) {
				// handle odd numbers
				// so we can match algorithm for even numbers
				teams.push(this.DUMMY);
			}

			const matches: Match[] = [];

			// loop through all possible opponents (8 this.sessionSchedule.teams, means 7 possible opponents)
			// that is why we are subtracting 1
			for (let jindex = 0; jindex < teams.length - 1; jindex++) {
				// split the total number of teams in half. This will allow us to match each team with each other
				// from the two halves.
				for (let index = 0; index < teams.length / 2; index++) {
					const byeWeeks: boolean = session.byeWeeks
						? session.byeWeeks
						: teams[index].name !== this.DUMMY.name && teams[teams.length - 1 - index].name !== this.DUMMY.name;

					if (byeWeeks) {
						// in the first round add the first team with the last team
						const homeTeam: Team = teams[index];
						const awayTeam: Team = teams[teams.length - 1 - index];
						const match: Match = new Match(homeTeam, awayTeam);
						matches.push(match);
					}
				}
				teams.splice(1, 0, teams.pop());
			}
			// generate matches with the selected times
			const matchesWithTimes: Match[] = this.generateMatchUpTimes(matches, session);
			const schedule: LeagueSessionSchedule = new LeagueSessionSchedule(session);
			schedule.matches = matchesWithTimes;
			schedule.active = false;
			generatedSessionSchedules.push(schedule);
		}
		return generatedSessionSchedules;
	}

	private generateMatchUpTimes(matches: Match[], newSession: NewSessionSchedule): Match[] {
		// create a copy of the matches array
		matches = matches.slice();
		const startDate = newSession.sessionStart;
		const endDate = newSession.sessionEnd;
		const desiredDays: MatchDay[] = newSession.gamesDays.map((gD) => this.matchDays[gD.gamesDay]);

		const current = startDate.clone();
		let index = 0;

		while (current.isSame(endDate) || current.isBefore(endDate)) {
			const currentDayNum: number = current.isoWeekday();
			// the current date includes one of the days we want to schedule a game on
			// dtRanges.days is Tuesday, Friday, Sunday
			if (desiredDays.includes(currentDayNum)) {
				// get next available time
				const listOfMatchTimes = this.returnTimesForGivenDay(currentDayNum, newSession.gamesDays);

				for (let j = 0; j < listOfMatchTimes.length; j++) {
					if (index >= matches.length) break;

					const time: moment.MomentSetObject = this.getNextAvailableTime(listOfMatchTimes) as moment.MomentSetObject;
					const nextMatch: Match = matches[index];
					nextMatch.schedule(current, time, nextMatch);
					index++;
				}
			}
			const requiredDays = this.computeNumberOfDaysNeeded(currentDayNum, desiredDays);
			current.add(requiredDays, 'days');
		}
		return matches;
	}

	private computeNumberOfDaysNeeded(currentDayNum: MatchDay, desiredDays: MatchDay[]): number {
		let nextDayNum: MatchDay = this.getNextAvailableDay(desiredDays);

		if (currentDayNum < nextDayNum) {
			nextDayNum = nextDayNum - currentDayNum;
		} else {
			// if current day is bigger than nextDayNum and it is not sunday
			// figure out how many days we have to add to current to get to nextDay
			if (currentDayNum !== MatchDay.Sunday) {
				// figure out how many days left in the week there are
				const daysLeftInWeek = 7 - currentDayNum;
				nextDayNum = daysLeftInWeek + nextDayNum;
			}
		}

		return nextDayNum;
	}

	// Returns next available time when the times array is sorted from earliest games to latest
	// It will modify the array, but moving first item, in the last place
	private getNextAvailableTime(times: MatchTime[]): MatchTime {
		const time: MatchTime = times[0];
		times.splice(times.length - 1, 1, times.shift());
		return time;
	}

	private getNextAvailableDay(desiredDays: MatchDay[]): MatchDay {
		if (this.nextDay === MatchDay.None || this.nextDay === desiredDays[0]) {
			return (this.nextDay = desiredDays.reduce((previousDay, currentDay) => Math.min(previousDay, currentDay)));
		} else {
			return (this.nextDay = this.findNextLargestNumber(desiredDays));
		}
	}

	private findNextLargestNumber(desiredDays: MatchDay[]): MatchDay {
		let next = 0,
			i = 0;
		for (; i < desiredDays.length; i++) {
			if (desiredDays[i] > this.nextDay) {
				next = desiredDays[i];
			}
		}
		return next;
	}

	private returnTimesForGivenDay(currentDayNum: number, gamesDays: GameDay[]): MatchTime[] {
		const gameDay: GameDay = gamesDays.find((gameDay) => {			
			return MatchDay[gameDay.gamesDay] === MatchDay[MatchDay[currentDayNum]];
		});		
		const times: MatchTime[] = gameDay.gamesTimes.map((gT) => {
			// retrieve just the time without pm. so '3:30'
			const time = gT.gamesTime.substring(0, gT.gamesTime.length - 3);
			// split the time on the colon. First object in the array will be hours
			// second will be minutes.
			const hourAndMins = time.split(':');
			const matchTime: MatchTime = {
				period: gT.gamesTime.endsWith('am') ? 'am' : 'pm',
				hour: hourAndMins[0],
				minute: hourAndMins[1]
			};
			return matchTime;
		});

		return times;
		// return times.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
		// return timesForCurrentDay[MatchDay[currentDayNum]].sort((a, b) => a.hour - b.hour);
	}
}
