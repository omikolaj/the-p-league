import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';
import * as moment from 'moment';
import ScheduleService from '../interfaces/session-schedule-service.model';
import { Injectable, SkipSelf, Self } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { MatchTime } from 'src/app/views/schedule/models/interfaces/match-time.model';
import { TimesOfDay } from 'src/app/views/schedule/models/interfaces/times-of-day.model';
import TeamSessionSchedule from 'src/app/views/schedule/models/classes/team-session-schedule.model';
import { League } from '../../../../views/schedule/models/interfaces/League.model';
import SessionSchedule from '../models/session-schedule.model';
import { ISessionSchedule } from '../interfaces/Isession-schedule.model';

@Injectable()
export class SessionScheduleService extends ScheduleService {	
	private readonly DUMMY: Team = { name: "BYE", sessionSchedule: new TeamSessionSchedule() };	
	
	protected nextDay: MatchDay = MatchDay.None;

	private _sessionSchedule: ISessionSchedule;
	get sessionSchedule(): ISessionSchedule {
		return this._sessionSchedule;
	}

	set sessionSchedule(value: ISessionSchedule) {
		this._sessionSchedule = value;
	}

	constructor() {
		super();
		// set to english
		moment.locale('en');				
	}

	generateSchedule(sessionSchedule: SessionSchedule, includeBYEweeks: boolean = false): Match[] {
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
	
}