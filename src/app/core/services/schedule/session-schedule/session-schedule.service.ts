import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';
import { ILeagueSessionSchedule } from '../interfaces/Ileague-session-schedule.model';
import * as moment from 'moment';
import ISessionScheduleService from '../interfaces/Isession-schedule-service.model';
import { Injectable } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { MatchTime } from 'src/app/views/schedule/models/interfaces/match-time.model';
import { TimesOfDay } from 'src/app/views/schedule/models/interfaces/times-of-day.model';
import TeamSessionSchedule from 'src/app/views/schedule/models/classes/team-session-schedule.model';

@Injectable()
export class SessionScheduleService extends ISessionScheduleService {
	private readonly DUMMY: Team = { name: "BYE", schedule: new TeamSessionSchedule() };
	
	protected nextDay: MatchDay = MatchDay.None;

	private _sessionSchedule: ILeagueSessionSchedule;

	get sessionSchedule(): ILeagueSessionSchedule {
		return this._sessionSchedule;
	}

	set sessionSchedule(value: ILeagueSessionSchedule) {
		this._sessionSchedule = value;
	}

	constructor() {
		super();
		// set to english
		moment.locale('en');
	}

	generateSchedule(sessionSchedule: ILeagueSessionSchedule, includeBYEweeks: boolean = false): Match[] {
		this.sessionSchedule = sessionSchedule;

		// Create a copy of the this.sessionSchedule.teams list
		this.sessionSchedule.teams = this.sessionSchedule.teams.slice();

		// if we have odd number of teams
		if (this.sessionSchedule.teams.length % 2 === 1) {
			// handle odd numbers
			// so we can match algorithm for even numbers	
			this.sessionSchedule.teams.push(this.DUMMY);
		}		

		let matches: Match[] = [];
		// loop through all possible opponents (8 this.sessionSchedule.teams, means 7 possible opponents)
		// that is why we are subtracting 1
		for (let jindex = 0; jindex < this.sessionSchedule.teams.length - 1; jindex++) {
			// split the total number of this.sessionSchedule.teams in half. This will allow us to match each team with each other
			// from the two halves.       
			for (let index = 0; index < this.sessionSchedule.teams.length / 2; index++) {

				const byeWeeks: boolean = includeBYEweeks ? true : this.sessionSchedule.teams[index].name !== this.DUMMY.name && this.sessionSchedule.teams[this.sessionSchedule.teams.length - 1 - index].name !== this.DUMMY.name;

				if (byeWeeks) {
					// in the first round add the first team with the last team 					
					const homeTeam: Team = this.sessionSchedule.teams[index];
					const awayTeam: Team = this.sessionSchedule.teams[(this.sessionSchedule.teams.length - 1) - index];			
					const match: Match = new Match(this, homeTeam, awayTeam);					
					matches.push(match)                        
				}
			}
			this.sessionSchedule.teams.splice(1, 0, this.sessionSchedule.teams.pop());
		}

		return this.generateMatchUpTimes(matches);
	}

	generateMatchUpTimes(matches: Match[]): Match[] {
		// create a copy of the matches array
		matches = matches.slice();

		let current = this.sessionSchedule.startDate.clone();
		let index = 0;

		while (current.isSame(this.sessionSchedule.endDate) || current.isBefore(this.sessionSchedule.endDate)) {
			const currentDayNum: number = current.isoWeekday();
			// the current date includes one of the days we want to schedule a game on
			// dtRanges.days is Tuesday, Friday, Sunday
			if (this.sessionSchedule.desiredDays.includes(currentDayNum)) {

				// get next available time     				  
				const listOfMatchTimes = this.returnTimesForGivenDay(currentDayNum)								

				for (let j = 0; j < listOfMatchTimes.length; j++) {
					if (index >= matches.length) break;
					
					const time: moment.MomentSetObject = this.getNextAvailableTime(listOfMatchTimes) as moment.MomentSetObject;	
					const nextMatch: Match = matches[index];
					nextMatch.schedule(current, time, nextMatch);
					index++;
				}				
			}			
			const requiredDays = this.computeNumberOfDaysNeeded(currentDayNum);			
			current.add(requiredDays, 'days');
		}
		return matches;
	}

	protected computeNumberOfDaysNeeded(currentDayNum: MatchDay): number {
		let nextDayNum: MatchDay = this.getNextAvailableDay();

		if (currentDayNum < nextDayNum) {
			nextDayNum = nextDayNum - currentDayNum;
		}
		else {
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
	getNextAvailableTime(times: MatchTime[]): MatchTime {
		const time: MatchTime = times[0];
		times.splice((times.length - 1), 1, times.shift())
		return time;
	}

	getNextAvailableDay(): MatchDay {
		if ((this.nextDay === MatchDay.None) || (this.nextDay === this.sessionSchedule.desiredDays[0])) {
			return this.nextDay = this.sessionSchedule.desiredDays.reduce((previousDay, currentDay) => Math.min(previousDay, currentDay));
		}		
		else {
			return this.nextDay = this.findNextLargestNumber();
		}
	}

	findNextLargestNumber(): MatchDay {
		let next = 0, i = 0;
		for (; i < this.sessionSchedule.desiredDays.length; i++) {
			if (this.sessionSchedule.desiredDays[i] > this.nextDay) {
				next = this.sessionSchedule.desiredDays[i];
			}
		}
		return next;
	}

	returnTimesForGivenDay(currentDayNum: number): MatchTime[] {
		const timesForCurrentDay: TimesOfDay = this.sessionSchedule.timesOfDays.find(timesOfDay => timesOfDay[MatchDay[currentDayNum]] !== undefined);

		return timesForCurrentDay[MatchDay[currentDayNum]].sort((a, b) => a.hour - b.hour);
	}
}