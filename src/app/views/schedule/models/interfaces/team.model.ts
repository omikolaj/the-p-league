import * as cuid from 'cuid';

export interface Team {
	id?: string;
	name?: string;
	leagueID?: string;
	selected?: boolean;
}

export type HomeTeam = Team;

export type AwayTeam = Team;

// Temporary
export const TEAMS: Team[] = [
	{ id: cuid(), selected: true, name: 'Manchester United FC', leagueID: '1' },
	{ id: cuid(), selected: true, name: 'Arsenal F.C', leagueID: '1' },
	{ id: cuid(), selected: true, name: 'Chelsea F.C', leagueID: '1' },
	{ id: cuid(), selected: true, name: 'Manchester City F.C', leagueID: '1' },
	{ id: cuid(), selected: true, name: 'Liverpool F.C', leagueID: '1' },
	{ id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', leagueID: '1' },
	{ id: cuid(), selected: true, name: 'Leicester City F.C', leagueID: '1' },

	{ id: cuid(), selected: true, name: 'FC Barcelona', leagueID: '2' },
	{ id: cuid(), selected: true, name: 'Real Madrid C.F', leagueID: '2' },
	{ id: cuid(), selected: true, name: 'Atletico Madrid', leagueID: '2' },
	{ id: cuid(), selected: true, name: 'Real Betis', leagueID: '2' },
	{ id: cuid(), selected: true, name: 'CD Leganes', leagueID: '2' },
	{ id: cuid(), selected: true, name: 'Real Sociedad', leagueID: '2' },
	{ id: cuid(), selected: true, name: 'Valencia CF', leagueID: '2' },
	{ id: cuid(), selected: true, name: 'LKS', leagueID: '2' },

	{ id: cuid(), selected: true, name: 'Sevilla FC', leagueID: '3' },
	{ id: cuid(), selected: true, name: 'Atletico Bilbao', leagueID: '3' },
	{ id: cuid(), selected: true, name: 'Levante UD', leagueID: '3' },
	{ id: cuid(), selected: true, name: 'Granada CF', leagueID: '3' },
	{ id: cuid(), selected: true, name: 'Villareal CF', leagueID: '3' },
	{ id: cuid(), selected: true, name: 'RCD Espanyol de Barcelona', leagueID: '3' },
	{ id: cuid(), selected: true, name: 'AFC Bournemouth', leagueID: '3' },

	{ id: cuid(), selected: true, name: 'Manchester United FC', leagueID: '4' },
	{ id: cuid(), selected: true, name: 'Arsenal F.C', leagueID: '4' },
	{ id: cuid(), selected: true, name: 'Chelsea F.C', leagueID: '4' },
	{ id: cuid(), selected: true, name: 'Manchester City F.C', leagueID: '4' },
	{ id: cuid(), selected: true, name: 'Liverpool F.C', leagueID: '4' },
	{ id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', leagueID: '4' },
	{ id: cuid(), selected: true, name: 'Leicester City F.C', leagueID: '4' },

	{ id: cuid(), selected: true, name: 'Manchester United FC', leagueID: '5' },
	{ id: cuid(), selected: true, name: 'Arsenal F.C', leagueID: '5' },
	{ id: cuid(), selected: true, name: 'Chelsea F.C', leagueID: '5' },
	{ id: cuid(), selected: true, name: 'Manchester City F.C', leagueID: '5' },
	{ id: cuid(), selected: true, name: 'Liverpool F.C', leagueID: '5' },
	{ id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', leagueID: '5' },
	{ id: cuid(), selected: true, name: 'Leicester City F.C', leagueID: '5' },

	{ id: cuid(), selected: true, name: 'Manchester United FC', leagueID: '6' },
	{ id: cuid(), selected: true, name: 'Arsenal F.C', leagueID: '6' },
	{ id: cuid(), selected: true, name: 'Chelsea F.C', leagueID: '6' },
	{ id: cuid(), selected: true, name: 'Manchester City F.C', leagueID: '6' },
	{ id: cuid(), selected: true, name: 'Liverpool F.C', leagueID: '6' },
	{ id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', leagueID: '6' },
	{ id: cuid(), selected: true, name: 'Leicester City F.C', leagueID: '6' },

	{ id: cuid(), selected: true, name: 'Manchester United FC', leagueID: '9' },
	{ id: cuid(), selected: true, name: 'Arsenal F.C', leagueID: '9' },
	{ id: cuid(), selected: true, name: 'Chelsea F.C', leagueID: '9' },
	{ id: cuid(), selected: true, name: 'Manchester City F.C', leagueID: '9' },
	{ id: cuid(), selected: true, name: 'Liverpool F.C', leagueID: '9' },
	{ id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', leagueID: '9' },
	{ id: cuid(), selected: true, name: 'Leicester City F.C', leagueID: '9' }
];
