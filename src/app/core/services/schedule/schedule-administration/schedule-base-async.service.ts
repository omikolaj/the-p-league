import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SportTypeDTO } from 'src/app/core/models/schedule/sport-type.model';

@Injectable({
	providedIn: 'root'
})
export class ScheduleBaseAsyncService {
	protected headers = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json'
		})
	};
	protected readonly sportTypeUrl = 'sport-types';
	constructor(protected http: HttpClient) {}

	fetchAllSportTypes(): Observable<SportTypeDTO[]> {
		return this.http.get<SportTypeDTO[]>(this.sportTypeUrl, this.headers);
	}
}
