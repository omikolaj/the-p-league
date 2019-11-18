import SessionSchedule from '../classes/session-schedule.model';
import TeamSessionSchedule from '../classes/team-session-schedule.model';
import * as cuid from 'cuid';

export interface Team {
  id?: string;
  name?: string;
  sessionSchedule?: SessionSchedule;
  sessionScheduleID?: string;
  leagueID?: string;
  selected?: boolean;
}

export interface HomeTeam extends Team {}

export interface AwayTeam extends Team {}

// Temporary
export const TEAMS: Team[] = [
  { id: cuid(), selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: cuid(), selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: cuid(), selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: cuid(), selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: cuid(), selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: cuid(), selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },

  { id: cuid(), selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: cuid(), selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: cuid(), selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: cuid(), selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: cuid(), selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: cuid(), selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },

  { id: cuid(), selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: cuid(), selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: cuid(), selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: cuid(), selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: cuid(), selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: cuid(), selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },

  { id: cuid(), selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: cuid(), selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: cuid(), selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: cuid(), selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: cuid(), selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: cuid(), selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },

  { id: cuid(), selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: cuid(), selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: cuid(), selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: cuid(), selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: cuid(), selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: cuid(), selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },

  { id: cuid(), selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: cuid(), selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: cuid(), selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: cuid(), selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: cuid(), selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: cuid(), selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },

  { id: cuid(), selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: cuid(), selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: cuid(), selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: cuid(), selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: cuid(), selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: cuid(), selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: cuid(), selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' }
];
