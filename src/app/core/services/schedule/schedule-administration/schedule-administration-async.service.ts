import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Observable, of, throwError } from 'rxjs';
import { Team, TEAMS } from 'src/app/views/schedule/models/interfaces/team.model';
import { delay } from 'rxjs/internal/operators/delay';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationAsyncService {
  teams: Team[] = TEAMS;
  constructor(private http: HttpClient) {}

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
            selected: false
          },
          {
            name: 'Friday',
            id: '2',
            type: { id: '4', name: 'Basketball' },
            teams: [...this.teams],
            readonly: true,
            selected: false
          },
          {
            name: 'Sunday',
            id: '3',
            type: { id: '4', name: 'Basketball' },
            teams: [...this.teams],
            readonly: true,
            selected: false
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
            selected: false
          },
          {
            name: 'Friday',
            id: '5',
            type: { id: '4', name: 'Volleyball' },
            teams: [...this.teams],
            readonly: true,
            selected: false
          },
          {
            name: 'Saturday',
            id: '4',
            type: { id: '4', name: 'Volleyball' },
            teams: [...this.teams],
            readonly: true,
            selected: false
          }
        ]
      },
      {
        name: 'Soccer',
        id: '3',
        leagues: [
          {
            name: 'Saturday',
            id: '4',
            type: { id: '4', name: 'Soccer' },
            teams: [...this.teams],
            readonly: true,
            selected: false
          }
        ]
      }
    ]).pipe(delay(1000));
  }
}
