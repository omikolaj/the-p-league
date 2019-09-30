import { HomeTeam, AwayTeam } from './team.model';
import { Moment } from 'moment';

const TBA: string = "TBA";

// Represents two teams facing each other
export interface Match {
    dateTime?: Moment,
    homeTeam: HomeTeam | string,
    awayTeam: AwayTeam | string
}
