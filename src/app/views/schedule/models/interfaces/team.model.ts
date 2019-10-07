import ITeamSessionSchedule from '../classes/Iteam-session-schedule.model';
import TeamSessionSchedule from '../classes/team-session-schedule.model';

export interface Team {
    name?: string,
    schedule?: ITeamSessionSchedule
  }

export interface HomeTeam extends Team{

}

export interface AwayTeam extends Team {
    
}

// Temporary
export const TEAMS: Team[] = [  
    {name: "A", schedule: new TeamSessionSchedule()},
    {name: "B", schedule: new TeamSessionSchedule()},
    {name: "C", schedule: new TeamSessionSchedule()},
    {name: "D", schedule: new TeamSessionSchedule()},
    {name: "E", schedule: new TeamSessionSchedule()},
    {name: "F", schedule: new TeamSessionSchedule()},
    {name: "G", schedule: new TeamSessionSchedule()}    
  ]