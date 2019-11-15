import { cloneDeep } from 'lodash';
import { LeagueState, LeagueStateModel } from 'src/app/store/state/league.state';
import { MatListOption } from '@angular/material';
import { Injectable } from '@angular/core';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team, TEAMS } from 'src/app/views/schedule/models/interfaces/team.model';
import TeamSessionSchedule from 'src/app/views/schedule/models/classes/team-session-schedule.model';
import { BehaviorSubject } from 'rxjs';
import { SelectedLeagues } from 'src/app/views/admin/schedule/models/selected-leagues.model';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
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

  constructor(private store: Store) {}

  updateSelectedLeagues(updatedLeagues: MatListOption[]): League[] {
    const allLeagues = this.store.selectSnapshot(LeagueState.getAll);
    const updatedLeauges: League[] = [];
    updatedLeagues.forEach(matListOption => {
      const leagueToUpdate = cloneDeep(allLeagues.find(l => l.id === matListOption.value));
      if (leagueToUpdate) {
        leagueToUpdate.selected = !leagueToUpdate.selected;
        updatedLeauges.push(leagueToUpdate);
      }
    });
    console.log('updated selected leagues', updatedLeagues);
    return updatedLeauges;
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

  // updateSelectedLeaguesForSportTypeID(
  //   selectedOptions: MatListOption[],
  //   sportTypeID: string
  // ): League[] {
  //   let readyForUpdate: League[] = [];
  //   if (selectedOptions.length < 1) {
  //     const selectedLeagues = this.store.selectSnapshot(
  //       LeagueState.getSelected
  //     );
  //     let selectedLeague;
  //     selectedLeagues.forEach(l => {
  //       const league = cloneDeep(l);
  //       league.selected = !league.selected;
  //       selectedLeague = league;
  //     });
  //     //readyForUpdate.push(selectedLeague);
  //   } else {
  //     const allLeagues: League[] = this.store.selectSnapshot(
  //       LeagueState.getAll
  //     );
  //     const selected: League[] = [];
  //     for (let index = 0; index < selectedOptions.length; index++) {
  //       const id = selectedOptions[index].value;
  //       let selectedLeague;
  //       allLeagues.find(l => {
  //         if (l.id === id) {
  //           const league = cloneDeep(l);
  //           league.selected = !league.selected;
  //           selectedLeague = league;
  //         }
  //       });
  //       selected.push(selectedLeague);
  //     }
  //     readyForUpdate = this.updateSelectedLeagues(selected, sportTypeID);
  //   }
  //   console.log("readyforupdate", readyForUpdate);
  //   return readyForUpdate;
  // }

  // private updateSelectedLeagues(
  //   selected: League[],
  //   sportTypeID: string
  // ): League[] {
  //   const selectedLeagues: SelectedLeagues = {
  //     sportTypeID: sportTypeID,
  //     leagues: selected
  //   };

  //   const readyForUpdate = this.updateSelection(selectedLeagues);
  //   return readyForUpdate;
  // }

  // private updateSelection(selected: SelectedLeagues): League[] {
  //   const selectedState: League[] = this.store.selectSnapshot(
  //     LeagueState.getSelected
  //   );
  //   console.log("selected", selectedState);
  //   let updated: League[] = [];
  //   // if the length is not zero means we have existing selected items
  //   if (selectedState.length !== 0) {
  //     // if incoming selected lists are not zero, we need to replace
  //     if (selected.leagues.length !== 0) {
  //       if (
  //         selectedState.find(sel => sel.sportTypeID === selected.sportTypeID)
  //       ) {
  //         updated = selectedState.filter(
  //           sel => sel.sportTypeID !== selected.sportTypeID
  //         );
  //         updated = [...updated, ...selected.leagues];
  //       }
  //       // brand new selected league type
  //       else {
  //         updated = [...selectedState, ...selected.leagues];
  //       }
  //     }
  //     // else we need to remove old items
  //     else {
  //       updated = selectedState.filter(
  //         sel => sel.sportTypeID !== selected.sportTypeID
  //       );
  //     }
  //   } else {
  //     // state selected is empty
  //     updated = [...selected.leagues];
  //   }
  //   return updated;
  // }
}
