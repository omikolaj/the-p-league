import { MatchTime } from './match-time.model';

// Represents a list of all of the desired tiems for a day
// Could be { MatchDay.Sunday: [ { hour: 20, minute: 30 } ] }
export interface TimesOfDay {
	[matchDay: string]: MatchTime[]
}