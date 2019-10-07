import { MatchTime } from './match-time.model';

export interface TimesOfDay {
	[matchDay: string]: MatchTime[]
}