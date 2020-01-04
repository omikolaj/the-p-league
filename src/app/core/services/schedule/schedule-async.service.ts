import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LeagueSessionSchedule from '../../models/schedule/league-session-schedule.model';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAsyncService {
	private readonly sessionSchedulesUrl = 'leagues/sessions';
	private headers = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};

	constructor(private http: HttpClient) {}

	fetchLeaguesSessionSchedules(): Observable<LeagueSessionSchedule[]> {
		return this.http.get<LeagueSessionSchedule[]>(`${this.sessionSchedulesUrl}`, this.headers);
	}
}
