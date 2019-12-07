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
