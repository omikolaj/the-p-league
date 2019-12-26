import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SportTypeDTO } from 'src/app/core/models/schedule/sport-type.model';
import { Team, TEAMS } from 'src/app/core/models/schedule/team.model';

@Injectable({
	providedIn: 'root'
})
export class ScheduleBaseAsyncService {
	teams: Team[] = TEAMS;
	protected headers = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};
	protected readonly sportTypeURL = 'sport-types';
	constructor(protected http: HttpClient) {}

	fetchAllSportTypes(): Observable<SportTypeDTO[]> {
		// TODO remove
		// return of([
		// 	{
		// 		name: 'Basketball',
		// 		id: '1',
		// 		leagues: [
		// 			{
		// 				name: 'Monday',
		// 				id: '1',
		// 				type: 'Basketball',
		// 				teams: this.teams.filter((t) => t.leagueID === '1'),
		// 				readonly: true,
		// 				selected: false,
		// 				sportTypeID: '1'
		// 			},
		// 			{
		// 				name: 'Tuesday',
		// 				id: '2',
		// 				type: 'Basketball',
		// 				teams: this.teams.filter((t) => t.leagueID === '2'),
		// 				readonly: true,
		// 				selected: false,
		// 				sportTypeID: '1'
		// 			},
		// 			{
		// 				name: 'Wednesday',
		// 				id: '3',
		// 				type: 'Basketball',
		// 				teams: this.teams.filter((t) => t.leagueID === '3'),
		// 				readonly: true,
		// 				selected: false,
		// 				sportTypeID: '1'
		// 			}
		// 		]
		// 	},
		// 	{
		// 		name: 'Volleyball',
		// 		id: '2',
		// 		leagues: [
		// 			{
		// 				name: 'Thursday',
		// 				id: '4',
		// 				type: 'Volleyball',
		// 				teams: this.teams.filter((t) => t.leagueID === '4'),
		// 				readonly: true,
		// 				selected: false,
		// 				sportTypeID: '2'
		// 			},
		// 			{
		// 				name: 'Friday',
		// 				id: '5',
		// 				type: 'Volleyball',
		// 				teams: this.teams.filter((t) => t.leagueID === '5'),
		// 				readonly: true,
		// 				selected: false,
		// 				sportTypeID: '2'
		// 			},
		// 			{
		// 				name: 'Saturday',
		// 				id: '6',
		// 				type: 'Volleyball',
		// 				teams: this.teams.filter((t) => t.leagueID === '6'),
		// 				readonly: true,
		// 				selected: false,
		// 				sportTypeID: '2'
		// 			}
		// 		]
		// 	},
		// 	{
		// 		name: 'Soccer',
		// 		id: '3',
		// 		leagues: [
		// 			{
		// 				name: 'Sunday',
		// 				id: '9',
		// 				type: 'Soccer',
		// 				teams: this.teams.filter((t) => t.leagueID === '9'),
		// 				readonly: true,
		// 				selected: false,
		// 				sportTypeID: '3'
		// 			}
		// 		]
		// 	}
		// ]).pipe(delay(1000));

		return this.http.get<SportTypeDTO[]>(this.sportTypeURL, this.headers);
	}
}
