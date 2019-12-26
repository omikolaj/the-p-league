import { LeagueDTO } from './league.model';

export interface SportType {
	id?: string;
	name: string;
	leagues?: string[];
}

/**
 * @description Represents sport type data transfer object that will be sent down from the api
 */
export interface SportTypeDTO {
	id?: string;
	name: string;
	leagues?: LeagueDTO[];
}
