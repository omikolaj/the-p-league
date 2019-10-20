import SessionSchedule from '../classes/session-schedule.model';
import TeamSessionSchedule from '../classes/team-session-schedule.model';

export interface Team {
    name?: string,
    sessionSchedule?: SessionSchedule
  }

export interface HomeTeam extends Team{

}

export interface AwayTeam extends Team {
    
}

// Temporary
export const TEAMS: Team[] = [  
    {name: "Manchester United FC", sessionSchedule: new TeamSessionSchedule()},
    {name: "Arsenal F.C", sessionSchedule: new TeamSessionSchedule()},
    {name: "Chelsea F.C", sessionSchedule: new TeamSessionSchedule()},
    {name: "Manchester City F.C", sessionSchedule: new TeamSessionSchedule()},
    {name: "Liverpool F.C", sessionSchedule: new TeamSessionSchedule()},
    {name: "Tottenham Hotspur F.C", sessionSchedule: new TeamSessionSchedule()},
    {name: "Leicester City F.C", sessionSchedule: new TeamSessionSchedule()}    
  ]