import { Injectable } from '@angular/core';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team, TEAMS } from 'src/app/views/schedule/models/interfaces/team.model';
import TeamSessionSchedule from 'src/app/views/schedule/models/classes/team-session-schedule.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeagueAdministrationService {
  selectedLeaguesOfSportType: SportType[] = [];
  teams: Team[] = TEAMS;
  private _allSelectedLeaguesSubject: BehaviorSubject<League[]> = new BehaviorSubject<League[]>([]);
  allSelectedLeagues$ = this._allSelectedLeaguesSubject.asObservable();

  get allSelectedLeagues(): League[] {
    let chosenLeagues: League[] = [];
    for (let index = 0; index < this.selectedLeaguesOfSportType.length; index++) {
      const sport = this.selectedLeaguesOfSportType[index];
      for (let j = 0; j < sport.leagues.length; j++) {
        const league = sport.leagues[j];
        chosenLeagues.push(league);
      }
    }
    this._allSelectedLeaguesSubject.next(chosenLeagues);
    return chosenLeagues;
  }

  get unassignedTeams(): Team[] {
    // TODO returns unassigned teams
    return [
      { name: 'Atletico Madrid', sessionSchedule: new TeamSessionSchedule() },
      { name: 'FC Barcelona', sessionSchedule: new TeamSessionSchedule() },
      { name: 'Sevilla FC', sessionSchedule: new TeamSessionSchedule() }
    ];
  }

  get leagues(): League[] {
    // let allLeagues: League[] = [];
    // this.sportTypes.map(s => {
    //   if (s.leagues.length > 0) {
    //     allLeagues = [...allLeagues, ...s.leagues];
    //   }
    // });
    // return allLeagues;
    return [];
  }

  constructor() {}

  onSelectedLeagues(selectedLeaguesForSport: SportType) {
    const existingSportType = this.selectedLeaguesOfSportType.find(s => s.name === selectedLeaguesForSport.name);
    if (existingSportType) {
      const existingSportTypeIndex = this.selectedLeaguesOfSportType.indexOf(existingSportType);
      if (existingSportTypeIndex > -1) {
        if (selectedLeaguesForSport.leagues.length !== 0) {
          this.selectedLeaguesOfSportType.splice(existingSportTypeIndex, 1, selectedLeaguesForSport);
        } else {
          this.selectedLeaguesOfSportType.splice(existingSportTypeIndex, 1);
        }
      }
    } else {
      this.selectedLeaguesOfSportType.push(selectedLeaguesForSport);
    }
  }

  updateTeams(teams: Team[]) {
    const allLeagues = this._allSelectedLeaguesSubject.getValue();
    const leagueToUpdate = allLeagues.find(l => l.id === teams[0].leagueID);

    if (leagueToUpdate) {
      for (let index = 0; index < teams.length; index++) {
        const team = teams[index];
        const existingTeam = leagueToUpdate.teams.find(t => t.id === team.id);
        existingTeam.name = team.name;
      }
    }
    this._allSelectedLeaguesSubject.next(allLeagues);
    console.log('updated teams', this.allSelectedLeagues);
  }

  deleteLeagues() {}
}
