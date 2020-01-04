import LeagueSessionSchedule from './league-session-schedule.model';
import { SportTypeDTO } from './sport-type.model';
import { TeamDTO } from './team.model';

// Represents a single league in any P League sport
// TODO convert teams array from any to ids
export interface League {
	id?: string;
	type?: string;
	teams?: string[];
	name: string;
	selected?: boolean;
	sportTypeID?: string;
	sessionIDs?: string[];
}

export interface LeagueDTO {
	id?: string;
	name: string;
	// type represents name of the sport this league is a part of
	type?: string;
	teams?: TeamDTO[];
	// whether this league is selected or not
	selected?: boolean;
	// sportTypeID to which this league belongs
	sportTypeID?: string;
	sportType?: SportTypeDTO;
	sessions?: LeagueSessionSchedule[];
}
