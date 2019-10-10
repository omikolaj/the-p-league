import { MatchDay } from '../match-days.enum';
import { Session } from './session.model';
import { TimesOfDay } from './times-of-day.model';

// Represents the desired list of week days that the days should be scheduled for and
// their respective times
export interface DateTimeRanges{    
		timesOfDays: TimesOfDay[],		
		days?: MatchDay[],    
    session?: Session
}