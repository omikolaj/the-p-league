import { Moment } from 'moment';

// Represents a session for any P League, league
export interface Session{
    id?: number,
    leagueId?: number,
    name?: string,
    startDate?: Moment,
    endDate?: Moment, 
    totalPrice?: number
}