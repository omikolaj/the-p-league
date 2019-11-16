import SessionSchedule from '../classes/session-schedule.model';
import TeamSessionSchedule from '../classes/team-session-schedule.model';

export interface Team {
  id?: string;
  name?: string;
  sessionSchedule?: SessionSchedule;
  sessionScheduleID?: string;
  leagueID?: string;
  selected?: boolean;
  assigned?: boolean;
}

export interface HomeTeam extends Team {}

export interface AwayTeam extends Team {}

// Temporary
export const TEAMS: Team[] = [
  { id: '1', selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: '2', selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: '3', selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: '4', selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: '5', selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: '6', selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },
  { id: '7', selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '1' },

  { id: '8', selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: '9', selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: '10', selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: '11', selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: '12', selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: '13', selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },
  { id: '14', selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '2' },

  { id: '15', selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: '16', selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: '17', selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: '18', selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: '19', selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: '20', selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },
  { id: '21', selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '3' },

  { id: '22', selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: '123', selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: '23', selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: '24', selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: '25', selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: '26', selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },
  { id: '27', selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '4' },

  { id: '28', selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: '29', selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: '30', selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: '31', selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: '32', selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: '33', selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },
  { id: '34', selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '5' },

  { id: '35', selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: '36', selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: '37', selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: '38', selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: '39', selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: '40', selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },
  { id: '41', selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '6' },

  { id: '42', selected: true, name: 'Manchester United FC', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: '43', selected: true, name: 'Arsenal F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: '44', selected: true, name: 'Chelsea F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: '45', selected: true, name: 'Manchester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: '46', selected: true, name: 'Liverpool F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: '47', selected: true, name: 'Tottenham Hotspur F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' },
  { id: '48', selected: true, name: 'Leicester City F.C', sessionSchedule: new TeamSessionSchedule(), leagueID: '9' }
];
