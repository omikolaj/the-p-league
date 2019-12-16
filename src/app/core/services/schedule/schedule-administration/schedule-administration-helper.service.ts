import { Injectable } from '@angular/core';
import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';
import { Team } from 'src/app/core/models/schedule/team.model';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationHelperService {
	constructor() {}

	/**
	 * @description Extracts the passed team entities for each session in the newSessions list
	 * and associating teams with their corresponding sessions
	 * @returns updated newSessions list, where each session contains its corresponding teams
	 */
	matchTeamsWithLeagues(newSessions: LeagueSessionSchedule[], teamsEntities): LeagueSessionSchedule[] {
		const updatedSessions: LeagueSessionSchedule[] = [];
		newSessions.forEach((session) => {
			const teams: Team[] = Object.values(teamsEntities).filter((t: Team) => t.leagueID === session.leagueID && t.selected === true);
			session.teams = (session.teams || []).concat(teams);
			updatedSessions.push(session);
		});
		return updatedSessions;
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
