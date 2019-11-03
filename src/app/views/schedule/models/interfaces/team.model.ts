import SessionSchedule from '../classes/session-schedule.model';
import TeamSessionSchedule from '../classes/team-session-schedule.model';

export interface Team {
  id?: string;
  name?: string;
  sessionSchedule?: SessionSchedule;
  leagueID?: string;
}

export interface HomeTeam extends Team {}

export interface AwayTeam extends Team {}

// Temporary
export const TEAMS: Team[] = [
  { id: '1', name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule() },
  { id: '2', name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule() },
  { id: '3', name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule() },
  { id: '4', name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule() },
  { id: '5', name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule() },
  { id: '6', name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule() },
  { id: '7', name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule() }
];
