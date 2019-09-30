import { MatchDays } from './match-days.enum';
import { SportSession } from './sport-session.model';
import { MatchTime } from './match-time.model';

export interface DateTimeRanges{    
    days?: MatchDays[],
    times?: MatchTime[],
    sportSession?: SportSession
}