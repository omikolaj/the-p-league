import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team, TEAMS } from 'src/app/views/schedule/models/interfaces/team.model';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAsyncService {
  teams: Team[] = TEAMS;
  constructor(protected http: HttpClient) {}

  fetchAllSportTypes(): Observable<SportType[]> {
    return of([
      {
        name: 'Basketball',
        id: '1',
        leagues: [
          {
            name: 'Monday',
            id: '1',
            type: { id: '4', name: 'Basketball' },
            teams: [...this.teams],
            readonly: true,
            selected: false,
            sportTypeID: '1'
          },
          {
            name: 'Friday',
            id: '2',
            type: { id: '4', name: 'Basketball' },
            teams: [...this.teams],
            readonly: true,
            selected: false,
            sportTypeID: '1'
          },
          {
            name: 'Sunday',
            id: '3',
            type: { id: '4', name: 'Basketball' },
            teams: [...this.teams],
            readonly: true,
            selected: false,
            sportTypeID: '1'
          }
        ]
      },
      {
        name: 'Volleyball',
        id: '2',
        leagues: [
          {
            name: 'Monday',
            id: '6',
            type: { id: '4', name: 'Volleyball' },
            teams: [...this.teams],
            readonly: true,
            selected: false,
            sportTypeID: '2'
          },
          {
            name: 'Friday',
            id: '5',
            type: { id: '4', name: 'Volleyball' },
            teams: [...this.teams],
            readonly: true,
            selected: false,
            sportTypeID: '2'
          },
          {
            name: 'Saturday',
            id: '4',
            type: { id: '4', name: 'Volleyball' },
            teams: [...this.teams],
            readonly: true,
            selected: false,
            sportTypeID: '2'
          }
        ]
      },
      {
        name: 'Soccer',
        id: '3',
        leagues: [
          {
            name: 'Saturday',
            id: '9',
            type: { id: '4', name: 'Soccer' },
            teams: [...this.teams],
            readonly: true,
            selected: false,
            sportTypeID: '3'
          }
        ]
      }
    ]).pipe(delay(1000));
  }
}
