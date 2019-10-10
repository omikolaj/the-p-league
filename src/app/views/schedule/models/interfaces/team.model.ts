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
    {name: "A", sessionSchedule: new TeamSessionSchedule()},
    {name: "B", sessionSchedule: new TeamSessionSchedule()},
    {name: "C", sessionSchedule: new TeamSessionSchedule()},
    {name: "D", sessionSchedule: new TeamSessionSchedule()},
    {name: "E", sessionSchedule: new TeamSessionSchedule()},
    {name: "F", sessionSchedule: new TeamSessionSchedule()},
    {name: "G", sessionSchedule: new TeamSessionSchedule()}    
  ]