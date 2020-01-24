export interface Team {
	id?: string;
	active?: boolean;
	name?: string;
	leagueID?: string;
	selected?: boolean;
}

/**
 * @description Represents team data transfer object sent down from API.
 * Currently there are no differences between Team and TeamDTO but if in the future
 * additional properties were to be sent down from the api, we can add them to here
 * without having to modify much else
 */
// export interface TeamDTO {
// 	id?: string;
// 	name?: string;
// 	leagueID?: string;
// 	selected?: boolean;
// 	// ids of the matches this team has assigned
// 	matches?: MatchDTO[];
// }

export type HomeTeam = Team;

export type AwayTeam = Team;
