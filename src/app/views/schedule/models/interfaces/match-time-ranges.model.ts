import { MatchDay } from '../match-days.enum';
import { SportSession } from './sport-session.model';
import { TimesOfDay } from './times-of-day.model';

export interface DateTimeRanges{    
		timesOfDays: TimesOfDay[],		
		days?: MatchDay[],    
    sportSession?: SportSession
}