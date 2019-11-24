import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationHelperService {
  constructor() {}
  /**
   * @param  {string[]} searchIDs
   * @param  {{[key:string]:Team}} entities
   * @returns string
   * Iterates over searchIDs and returns filtered entity string array of IDs that have
   * the selected property set to true
   */
  findSelectedIDs(searchIDs: string[], entities: { [key: string]: Team }): string[] {
    return searchIDs.filter(searchID => {
      if (entities[searchID]) {
        if ('selected' in entities[searchID]) {
          return entities[searchID].selected;
        }
      }
    });
  }
  /**
   * @param  {Team[]} teams
   * Generates league id and team ids pairs.
   * It is used to assign teams to specific leagues
   * This method is required to perform single query
   * to the store with a list of these pairs to update
   * each league entity's teams array of team ids
   */
  generateTeamIDsForLeague(teams: Team[]): { leagueID: string; ids: string[] }[] {
    const idPairs: { leagueID: string; ids: string[] }[] = [];
    teams.forEach((t: Team) => {
      const pair = idPairs.find(pair => pair.leagueID === t.leagueID);
      if (pair) {
        pair.ids.push(t.id);
      } else {
        idPairs.push({ leagueID: t.leagueID, ids: [t.id] });
      }
    });
    return idPairs;
  }

  generateLeagueIDsForSportType(leagues: League[]): { sportTypeID: string; ids: string[] }[] {
    const idPairs: { sportTypeID: string; ids: string[] }[] = [];
    leagues.forEach((l: League) => {
      const pair = idPairs.find(pair => pair.sportTypeID === l.sportTypeID);
      if (pair) {
        pair.ids.push(l.id);
      } else {
        idPairs.push({ sportTypeID: l.sportTypeID, ids: [l.id] });
      }
    });
    return idPairs;
  }
}
