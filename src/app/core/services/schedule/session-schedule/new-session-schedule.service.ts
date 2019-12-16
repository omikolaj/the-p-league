import { Injectable } from '@angular/core';
import * as moment from 'moment';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { GameDay } from 'src/app/core/models/schedule/game-day.model';
import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';
import { MatchDay } from 'src/app/core/models/schedule/match-days.enum';
import { MatchTime } from 'src/app/core/models/schedule/match-time.model';
import { Team } from 'src/app/core/models/schedule/team.model';
import { BYE_WEEK_DATE_TEXT } from 'src/app/shared/helpers/constants/the-p-league-constants';

@Injectable({
	providedIn: 'root'
})
export class NewSessionScheduleService {
	private readonly DUMMY: Team = { name: 'BYE' };
	private matchDays = MatchDay;
	private nextDay = MatchDay.None;
	constructor() {}

	/**
	 * @description Generates match ups and times (Team A vs Team B 12/14/19 8:00pm)
	 * between teams provided by the LeagueSessionSchedule objects then adds the match ups
	 * to the LeagueSessionSchedule object, marks LeagueSessionSchedule object as active
	 * and returns it back to the caller
	 * @param newSessions
	 * @returns schedules
	 */
	generateSchedules(newSessions: LeagueSessionSchedule[]): LeagueSessionSchedule[] {
		const generatedSessionSchedules: LeagueSessionSchedule[] = [];

		for (let i = 0; i < newSessions.length; i++) {
			const session = newSessions[i];
			// make a copy of the teams array
			const teams: Team[] = session.teams.slice();

			// if we have odd number of teams
			if (teams.length % 2 === 1) {
				// handle odd numbers
				// so we can match algorithm for even numbers
				teams.push(this.DUMMY);
			}

			// generate match ups for this session's teams
			const matches = this.generateMatchUps(teams, session.byeWeeks);

			// generate match times with the selected times
			session.matches = this.generateMatchUpTimes(matches, session);
			// mark session as active
			session.active = true;

			generatedSessionSchedules.push(session);
		}

		return generatedSessionSchedules;
	}

	/**
	 * @description Generates match ups between the given list of teams. If includeByeWeeks
	 * is true, then it will generate a match (Team A vs BYE) if there are odd number of teams
	 * if its false, than it will omit this match up from getting scheduled
	 * @returns match ups without times and dates
	 */
	private generateMatchUps(teams: Team[], includeByeWeeks: boolean): Match[] {
		const matches: Match[] = [];
		// loop through all possible opponents. For example if a session started off with 7 (odd) selected teams
		// this.generateSchedules() method adds a DUMMY team to make the team list even. Given any number of teams
		// we always subtract 1 because a team cannot face it self. So 8 teams total minus one, which avoids
		// scheduling a team to play against itself that is why we are subtracting 1
		for (let jindex = 0; jindex < teams.length - 1; jindex++) {
			// split the total list of teams in half. This will allow us to match each team with each other
			// starting first with last, second with second last and so on.
			// After we finish looping through the half, we change the order of the list
			// so we repeat the process of looping through half nth number of teams minus one. Each time we finish
			// we mutate the team list
			for (let index = 0; index < teams.length / 2; index++) {
				const homeTeam: Team = teams[index];
				const awayTeam: Team = teams[teams.length - 1 - index];
				// if user selected bye weeks, this means if team A plays BYE
				// include that in the schedule, else if user did NOT select bye weeks
				// then if team A plays BYE, ensure we skip that match

				// if include BYE weeks is true, add all matches including bye weeks
				if (includeByeWeeks) {
					const match: Match = new Match(homeTeam, awayTeam);
					// TODO temp
					match.leagueID = homeTeam.leagueID;
					matches.push(match);
				} else if (homeTeam.name !== this.DUMMY.name && awayTeam.name !== this.DUMMY.name) {
					const match: Match = new Match(homeTeam, awayTeam);
					// TODO temp
					match.leagueID = homeTeam.leagueID;
					matches.push(match);
				}
			}
			// change the order of the teams and keep creating schedules
			// take the second item in the teams list, remove it, and insert
			// the last item from the teams list in its place
			teams.splice(1, 0, teams.pop());
		}

		return matches;
	}

	/**
	 * @description Generates match up times for the given matches
	 * @returns match ups with times
	 */
	private generateMatchUpTimes(matches: Match[], newSession: LeagueSessionSchedule): Match[] {
		// returns an array of match days selected by user. [Monday, Tuesday] etc.
		const desiredDays: MatchDay[] = newSession.gamesDays.map((gD) => this.matchDays[gD.gamesDay]);
		// make current variable equal to start date and clone the date since we will mutate it
		const current = newSession.sessionStart.clone();

		let index = 0;

		// while the current variable is on the same day as the end of session OR it is before
		// the end of session keep looping. Current variable is increased inside the loop
		while (current.isSame(newSession.sessionEnd) || current.isBefore(newSession.sessionEnd)) {
			// currentDayNum represents the number day of week 1 = Monday, 2 = Tuesday etc.
			const currentDayNum: number = current.isoWeekday();
			// if the currentDayNum is 1 and desiredDays array contains Monday in it
			// this will evaluate to true and enter the if statement, because Monday = 1
			if (desiredDays.includes(currentDayNum)) {
				// return all of the times user selected that games should be scheduled for the current day.
				// If currentDayNum is 1, then we want to retrieve all of the times user selected games should
				// be scheduled for on Mondays
				const listOfMatchTimes = this.returnTimesForGivenDay(currentDayNum, newSession.gamesDays);

				// loop through all of the times
				for (let j = 0; j < listOfMatchTimes.length; j++) {
					// if the index is greater than or equal to the number
					// of matches that should be scheduled, than break. We do not
					// want to keep scheduling matches if we have already scheduled them all
					if (index >= matches.length) break;

					// returns next available time from the list of times user has specified games should be played at
					const time: moment.MomentSetObject = this.getNextAvailableTime(listOfMatchTimes) as moment.MomentSetObject;

					// first check to see if the current match home team or away team's names equal 'BYE', if they do
					// we do not want to schedule a time for them so increase the index and check again to see if the next match
					// home team or away team's name equal 'BYE'
					while (matches[index].homeTeam.name === this.DUMMY.name || matches[index].awayTeam.name === this.DUMMY.name) {
						// custom text for date field if the game is bye
						matches[index].dateTime = BYE_WEEK_DATE_TEXT;
						index++;
					}

					// if the current match home team and away team's name do not equal 'BYE'
					// we are ready to schedule the match. This should never be false since the while
					// loop checks for this already. Given current date, and next available time, schedule
					// a time for next available match. matches[index] represents that next match
					if (matches[index].homeTeam.name !== this.DUMMY.name && matches[index].awayTeam.name !== this.DUMMY.name) {
						this.scheduleMatch(current, time, matches[index]);
						index++;
					}
				}
			}
			// figure out how days we have to add to current day to get next user defined day
			// on which games should be scheduled
			const requiredDays = this.computeNumberOfDaysNeeded(currentDayNum, desiredDays);
			// add this number to current date
			current.add(requiredDays, 'days');
		}
		// return matches
		return matches;
	}

	/**
	 * @description Returns a list of times selected by the user for the given day
	 * @returns times for given day
	 */
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

		// TODO consider returning times array as an ordered list
		// return times.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
		// return timesForCurrentDay[MatchDay[currentDayNum]].sort((a, b) => a.hour - b.hour);
		return times;
	}

	/**
	 * @description Returns next available time when the times array is sorted from earliest games to latest
	 * It will modify the array, by moving first item to the last place. So first time we enter this
	 * method, we take the times array and get the first item from it. We then take the first time,
	 * and move it to the last place
	 * @param times
	 * @returns next available time
	 */
	private getNextAvailableTime(times: MatchTime[]): MatchTime {
		const time: MatchTime = times[0];
		times.splice(times.length - 1, 1, times.shift());
		return time;
	}

	/**
	 * @description Computes the number of days needed to next game day.
	 * Given currentDayNum being 1 which is Monday, and the desiredDays array list
	 * being [Monday, Friday], this method will figure out how many more days we need to
	 * to add to Monday to get to Friday, so we can increase currentDayNum by this many days.
	 * So to go from Monday = 1 to Friday = 5 we have to add 4 days.
	 * @param currentDayNum
	 * @param desiredDays
	 * @returns number of days needed
	 */
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

	/**
	 * @description Returns next available day based on the list of desired days passed into it
	 * It stores previously selected day in this.nextDay property
	 * @param desiredDays
	 * @returns next available day
	 */
	private getNextAvailableDay(desiredDays: MatchDay[]): MatchDay {
		if (this.nextDay === MatchDay.None || this.nextDay === desiredDays[0]) {
			return (this.nextDay = desiredDays.reduce((previousDay, currentDay) => Math.min(previousDay, currentDay)));
		} else {
			return (this.nextDay = this.findNextLargestNumber(desiredDays));
		}
	}

	/**
	 * @description Finds next largest number in the list of days of the week.
	 * Given list of days [Monday, Thursday, Sunday], it will return Sunday
	 * because Sunday = 7, and is thus the largest number
	 * @param desiredDays
	 * @returns next largest number
	 */
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

	/**
	 * @description Schedules the match based on the given date and time
	 */
	private scheduleMatch(date: moment.Moment, time: moment.MomentSetObject, match: Match): void {
		match.dateTime = moment(date).set(time);
	}
}
