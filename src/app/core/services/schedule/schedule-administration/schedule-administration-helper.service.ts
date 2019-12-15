import { Injectable } from '@angular/core';
import LeagueSessionSchedule from 'src/app/views/admin/schedule/models/session/league-session-schedule.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { SportTypesLeaguesPairs } from './../../../../views/admin/schedule/models/sport-types-leagues-pairs.model';

// TODO make this service be provided in admin module instead of root
// since it is only used by the schedule administration
// providedIn: AdminModule
@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationHelperService {
	constructor() {}

	// TODO change the name of this method. The name does not reflect what it actually does
	getTeamsForLeagues(newSessions: LeagueSessionSchedule[], teamsEntities): LeagueSessionSchedule[] {
		const updatedSessions: LeagueSessionSchedule[] = [];
		newSessions.forEach((session) => {
			const teams: Team[] = Object.values(teamsEntities).filter((t: Team) => t.leagueID === session.leagueID && t.selected === true);
			session.teams = (session.teams || []).concat(teams); // [...session.teams, ...teams];
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

	/**
	 * @description Takes the list of sport types league pairs and filters it down to a list of
	 * sport types league pairs based on the sports and leagues user had generated sessions for.
	 * This list is used to populate the drop down list so user can select which session they want to
	 * view matches for. We only care to display a list of sports and leagues that user generated sessions for
	 * @returns filtered pairs
	 */
	filterPairsForGeneratedSessions(pairs: SportTypesLeaguesPairs[], sessionsLeagueIDs: string[]): SportTypesLeaguesPairs[] {
		return pairs
			.filter((s) => {
				return s.leagues.some((l) => {
					// check if the session league IDs list contains an id for the
					// currently iterating league, if it does return true, if it does
					// not return false. This will filter down the sports
					const indexOf = sessionsLeagueIDs.indexOf(l.id);
					return indexOf !== -1;
				});
			})
			.map((sport) => {
				const newSport = Object.assign({}, sport);
				newSport.leagues = newSport.leagues.filter((l) => {
					// iterate over all sports and for each sport
					// filter those leagues for which user did not create a session
					const indexOf = sessionsLeagueIDs.indexOf(l.id);
					return indexOf !== -1;
				});
				return newSport;
			});
	}

	/**
	 * @description Loads initial set of matches for the first generated session
	 * @returns first session matches
	 */
	loadFirstSessionMatches(matchesSnapshot: Match[], leagueIDs: string[]): Match[] {
		let matches: Match[] = [];
		// if we have at least one leagueID display the first one as the default one
		if (leagueIDs.length > 0) {
			matches = matchesSnapshot.filter((match) => match.leagueID === leagueIDs[0]);
		} else {
			matches = [];
		}
		return matches;
	}

	loadFirstLeagueName(): string {

	}

}
