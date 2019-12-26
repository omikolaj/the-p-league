import { Moment } from 'moment';

// Represents a session for any P League, league
// TODO currently not in use
interface Session {
	id?: number;
	leagueID?: number;
	name?: string;
	startDate?: Moment;
	endDate?: Moment;
	totalPrice?: number;
	active?: boolean;
}
