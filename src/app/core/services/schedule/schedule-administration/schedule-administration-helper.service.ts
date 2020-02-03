import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Team } from 'src/app/core/models/schedule/team.model';
import { TeamState } from 'src/app/shared/store/state/team.state';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationHelperService {
	constructor(private store: Store) {}

	getTeamsForLeagueIDs(leagueIDs: string[]): Team[] {
		const matchedTeams = leagueIDs.reduce(
			(accumulator, leagueID) => accumulator.concat(this.store.selectSnapshot<(id: string) => Team[]>(TeamState.getTeamsForLeagueIDFn)(leagueID)),
			[] as Team[]
		);
		// filter out only ones that are selected
		return matchedTeams.filter((t) => t.selected === true);
	}

	/**
	 * @description Iterates over searchIDs and returns filtered entity string array of IDs that have the selected property set to true
	 * @param string[] searchIDs searchIds
	 * @param key:string: Team entities entities
	 * @returns string
	 *
	 */
	findSelectedIDs(searchIDs: string[], entities: { [key: string]: Team }): string[] {
		return searchIDs.filter((searchID) => {
			if (entities[searchID]) {
				if ('selected' in entities[searchID]) {
					return entities[searchID].selected;
				}
			}
		});
	}

	/**
	 * @description Generates league id and team ids pairs.
	 * It is used to assign teams to specific leagues
	 * This method is required to perform single query
	 * to the store with a list of these pairs to update
	 * each league entity's teams array of team ids
	 */
	generateTeamIDsForLeague(teams: Team[]): { leagueID: string; ids: string[] }[] {
		const idPairs: { leagueID: string; ids: string[] }[] = [];
		teams.forEach((t: Team) => {
			const pair = idPairs.find((pair) => pair.leagueID === t.leagueID);
			if (pair) {
				pair.ids.push(t.id);
			} else {
				idPairs.push({ leagueID: t.leagueID, ids: [t.id] });
			}
		});
		return idPairs;
	}
}
