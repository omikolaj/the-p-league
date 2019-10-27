import { cloneDeep } from 'lodash';
import { Pipe } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { SelectedLeagues } from '../interfaces/selected-leagues.model';
import { Sport } from 'src/app/views/schedule/models/sport.enum';
import { LeagueAdministrationService } from './league-administration/league-administration.service';
import { AdminAdd } from 'src/app/views/admin/models/admin-add-type.model';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { Team, TEAMS } from 'src/app/views/schedule/models/interfaces/team.model';
import { map, tap, shareReplay, catchError, first, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationService implements OnInit, Resolve<Observable<SportType[]>> {
  private _sportTypes: SportType[];

  get sportTypes(): SportType[] {
    return this._sportTypes;
  }
  set sportTypes(value: SportType[]) {
    this._sportTypes = value;
  }

  private _sportTypesSubject = new BehaviorSubject<SportType[]>([]);
  sportTypes$: Observable<SportType[]> = this._sportTypesSubject.asObservable();

  teams: Team[] = TEAMS;

  constructor(private leagueAdminService: LeagueAdministrationService) {}

  resolve(): Observable<SportType[]> | Observable<Observable<SportType[]>> | Promise<Observable<SportType[]>> {
    this._sportTypesSubject.next([
      {
        name: 'Basketball',
        id: '1',
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
        id: '2',
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
        id: '3',
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
    ]);
    return this.sportTypes$.pipe(first<SportType[]>());
  }

  ngOnInit() {}

  addSport(newSport: SportType) {
    newSport.id = '1232';
    for (let index = 0; index < newSport.leagues.length; index++) {
      const league = newSport.leagues[index];
      league.id = `${index + 6}`;
    }
    const sportTypes = this._sportTypesSubject.getValue();
    // only add league to the given sportType
    const existingSportType = sportTypes.find(s => s.name);
    if (~existingSportType) {
      const index = sportTypes.indexOf(existingSportType);
      existingSportType.leagues = [...existingSportType.leagues, ...newSport.leagues];
      const clone = cloneDeep(existingSportType);
      sportTypes.splice(index, 1, clone);
    } else {
      sportTypes.push(newSport);
    }

    this._sportTypesSubject.next(sportTypes);
  }

  checkLeagueSelection(): boolean {
    return this.leagueAdminService.allSelectedLeagues.length < 1;
  }

  checkExistingSchedule() {
    // TODO check if any of the selected league has a schedule to modify
    const allSelectedLeagues = this.leagueAdminService.allSelectedLeagues;
    return false;
  }
}
