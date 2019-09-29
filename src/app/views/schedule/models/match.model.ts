import { HomeTeam, AwayTeam } from './team.model';

const TBA: string = "TBA";

// Represents two teams facing each other
export interface Match {
    dateTime?: Date | string,
    homeTeam: HomeTeam | string,
    awayTeam: AwayTeam | string
}
