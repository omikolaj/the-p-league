import { Injectable } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationHelperService {
	constructor() {}

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

	/**
	 * @description Generates league ids for sport type
	 * @returns league ids for sport type
	 */
	// generateLeagueIDsForSportType(leagues: League[]): { sportTypeID: string; ids: string[] }[] {
	// 	// TODO when adding new league idPairs has ids array = []
	// 	console.log('what is incoming leagues', leagues);
	// 	const idPairs: { sportTypeID: string; ids: string[] }[] = [];
	// 	leagues.forEach((l: League) => {
	// 		const pair = idPairs.find((pair) => pair.sportTypeID === l.sportTypeID);
	// 		if (pair) {
	// 			pair.ids.push(l.id);
	// 		} else {
	// 			idPairs.push({ sportTypeID: l.sportTypeID, ids: [l.id] });
	// 		}
	// 	});
	// 	console.log('logging pairs', idPairs);
	// 	return idPairs;
	// }
}
