import { Sport } from '../../schedule/models/sport.enum';
import { League } from '../../schedule/models/interfaces/League.model';
import { Team } from '../../schedule/models/interfaces/team.model';
import { SportType } from '../../schedule/models/interfaces/sport-type.model';

interface AddItemInfo {
	title: string;
	description: string;
	sportTypes: SportType[];
}

interface AddLeague extends AddItemInfo {
	kind: 'league';
}

interface AddTeam extends AddItemInfo {
	kind: 'team';
}

export type AdminAdd = AddLeague | AddTeam;
