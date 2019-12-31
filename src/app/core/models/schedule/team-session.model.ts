import LeagueSessionSchedule from './league-session-schedule.model';
import { Team } from './team.model';

export interface TeamSession {
  id?: string;
  team?: Team;
  teamId?: string;
  leagueSessionSchedule?: LeagueSessionSchedule;
  leagueSessionScheduleId?: string;
}