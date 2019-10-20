import { Sport } from "../../schedule/models/sport.enum";
import { League } from '../../schedule/models/interfaces/League.model';
import { Team } from '../../schedule/models/interfaces/team.model';

interface AddItemInfo{
  title: string;
  description: string;  
}

interface AddLeague extends AddItemInfo{
  kind: 'league'
  sportTypes: typeof Sport;
  leagueName?: string;
}

interface AddTeam extends AddItemInfo{
  kind: 'team'
  teamName?: string;
  leagues: Array<League>;
}

export type AdminAdd = AddLeague | AddTeam;
