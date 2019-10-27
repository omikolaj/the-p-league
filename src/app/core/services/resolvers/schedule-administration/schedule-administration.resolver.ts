import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { HttpClient } from '@angular/common/http';
import { Team, TEAMS } from '../../../../views/schedule/models/interfaces/team.model';
import { ScheduleAdministrationService } from '../../schedule/schedule-administration/schedule-administration.service';
import { LeagueAdministrationService } from '../../schedule/schedule-administration/league-administration/league-administration.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationResolver implements Resolve<Observable<League[]>> {
  private leaguesSubject: BehaviorSubject<League[]> = new BehaviorSubject<League[]>([]);
  leagues$ = this.leaguesSubject.asObservable();
  teams: Team[] = TEAMS;

  constructor(private http: HttpClient, private leagueAdminService: LeagueAdministrationService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<League[]> | Observable<Observable<League[]>> | Promise<Observable<League[]>> {
    this.leagueAdminService.sportTypes = [
      {
        name: 'Basketball',
        leagues: [
          {
            name: 'Monday',
            id: '1',
            type: { id: '4', name: 'Basketball' },
            teams: [...this.teams],
            readonly: true
          },
          {
            name: 'Friday',
            id: '2',
            type: { id: '4', name: 'Basketball' },
            teams: [...this.teams],
            readonly: true
          },
          {
            name: 'Sunday',
            id: '3',
            type: { id: '4', name: 'Basketball' },
            teams: [...this.teams],
            readonly: true
          }
        ]
      },
      {
        name: 'Volleyball',
        leagues: [
          {
            name: 'Monday',
            id: '6',
            type: { id: '4', name: 'Volleyball' },
            teams: [...this.teams],
            readonly: true
          },
          {
            name: 'Friday',
            id: '5',
            type: { id: '4', name: 'Volleyball' },
            teams: [...this.teams],
            readonly: true
          },
          {
            name: 'Saturday',
            id: '4',
            type: { id: '4', name: 'Volleyball' },
            teams: [...this.teams],
            readonly: true
          }
        ]
      },
      {
        name: 'Soccer',
        leagues: [
          {
            name: 'Saturday',
            id: '4',
            type: { id: '4', name: 'Soccer' },
            teams: [...this.teams],
            readonly: true
          }
        ]
      }
    ];
    return of(this.leagueAdminService.sportTypes);
  }
}
