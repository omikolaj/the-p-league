import { cloneDeep } from 'lodash';
import { Resolve } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { LeagueAdministrationService } from './league-administration/league-administration.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Team, TEAMS } from 'src/app/views/schedule/models/interfaces/team.model';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationService implements OnInit, Resolve<Observable<SportType[]>> {
  // private _sportTypes: SportType[];

  // get sportTypes(): SportType[] {
  //   return this._sportTypes;
  // }
  // set sportTypes(value: SportType[]) {
  //   this._sportTypes = value;
  // }

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
    ]);
    return this.sportTypes$.pipe(first<SportType[]>());
  }

  ngOnInit() {}

  updateSportType(updatedSportType: SportType) {
    const sportTypes = this._sportTypesSubject.getValue();
    const existingSportType = sportTypes.find(sT => sT.id === updatedSportType.id);
    // ~indexToReplace is terse version of if(indexToReplace > -1)
    if (~existingSportType) {
      //TODO sport incorrect cloning logic fix
      const indexToReplace = sportTypes.indexOf(existingSportType);
      sportTypes.splice(indexToReplace, 1, updatedSportType);
      // any state will be lost because we are creating a new reference to the sportTypes array
      this._sportTypesSubject.next(sportTypes);
    } else {
      console.error('SportType to upate NOT FOUND');
    }
  }

  addSport(newSport: SportType) {
    const sportTypes = this._sportTypesSubject.getValue();
    const existingSportType = sportTypes.find(s => s.id === newSport.id);
    if (existingSportType) {
      const index = sportTypes.indexOf(existingSportType);
      if (~index) {
        existingSportType.leagues = [...existingSportType.leagues, ...newSport.leagues];
        const clone = cloneDeep(existingSportType);
        sportTypes.splice(index, 1, clone);
      }
    } else {
      newSport = this.addNewSportType(newSport);
      sportTypes.push(newSport);
    }

    this._sportTypesSubject.next(sportTypes);
  }
  /**
   * Adds new sport type to existing array, if no leagues were added sets leagues
   * to empty []
   * @param  {SportType} sportType
   */
  addNewSportType(newSport: SportType): SportType {
    newSport.id = '1232';
    // when adding a new sport type, you can only ever add a single league at a time
    for (let index = 0; index < newSport.leagues.length; index++) {
      const league = newSport.leagues[index];
      if (league.name) {
        league.id = `${index + 6}`;
      } else {
        newSport.leagues = [];
      }
    }
    return newSport;
  }

  deleteSportType(id: string) {
    const sportTypes = this._sportTypesSubject.getValue();
    const existingSportType = sportTypes.find(s => s.id === id);

    if (existingSportType) {
      if (existingSportType.leagues.length > 0) {
        // TODO emit message that you cannot delete sport type that
        // has leagues you must first remove leagues
        console.error('You cannot delete sport Type that contains active leagues', existingSportType);
      } else {
        const indexToDelete = sportTypes.indexOf(existingSportType);
        if (~indexToDelete) {
          sportTypes.splice(indexToDelete, 1);
          this._sportTypesSubject.next(sportTypes);
        }
      }
    }
  }

  checkLeagueSelection(): boolean {
    return this.leagueAdminService.allSelectedLeagues.length < 1;
  }

  checkExistingSchedule() {
    return false;
  }
}
