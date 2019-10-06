import { MatchDay } from './match-days.enum';
import { SportSession } from './sport-session.model';
import { MatchTime } from './match-time.model';
import { Match } from './match.model';

// export interface DateTimeRanges{    
//     days?: MatchDay[],
//     times?: MatchTime[],
//     sportSession?: SportSession
// }

export interface TimesOfDay {
	[matchDay: number]: MatchTime[]
}

export interface DateTimeRanges{    
		timesOfDays: TimesOfDay[],		
		days?: MatchDay[],    
    sportSession?: SportSession
}

// [ 
//	{ MatchDay.Monday: 
//     [ MatchTime, MatchTime, MatchTime ]
//  }, 
//  { MatchDay.Sunday: 
//     [ MatchTime, MatchTime, MatchTime, MatchTime, MatchTime ]
/// } 
//]