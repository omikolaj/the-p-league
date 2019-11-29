import * as moment from 'moment';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { TimesOfDay } from 'src/app/views/schedule/models/interfaces/times-of-day.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { DateTimeRanges } from 'src/app/views/schedule/models/interfaces/match-time-ranges.model';
import { League } from '../../../../views/schedule/models/interfaces/League.model';
import { Injectable } from '@angular/core';
import { ISessionSchedule } from '../interfaces/Isession-schedule.model';

export default class SessionSchedule implements ISessionSchedule {
	league: League;
	startDate: moment.Moment;
	endDate: moment.Moment;
	teams: Team[];
	timesOfDays: TimesOfDay[];
	sessionMatches: Match[];

	private _desiredDays: MatchDay[];

	get desiredDays(): MatchDay[] {
		return this._desiredDays;
	}

	set desiredDays(value: MatchDay[]) {
		if (value) {
			console.log('Sorting desired days list, before: ', value);
			value.sort((a, b) => b - a);
			console.log('Sorting desired days list, after: ', value);
		}
		this._desiredDays = value;
	}

	constructor(private teamsInSession: Team[], private dateTimeRanges: DateTimeRanges, private sessionLeague: League) {
		this.startDate = dateTimeRanges.session.startDate;
		this.endDate = dateTimeRanges.session.endDate;
		this.teams = teamsInSession;
		this.desiredDays = dateTimeRanges.days;
		this.timesOfDays = dateTimeRanges.timesOfDays;
		this.league = sessionLeague;
	}
}
