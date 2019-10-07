import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';
import { ILeagueSessionSchedule } from './Ileague-session-schedule.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { MatchTime } from 'src/app/views/schedule/models/interfaces/match-time.model';

export default abstract class ISessionScheduleService{
    protected abstract nextDay: MatchDay;
    abstract get sessionSchedule(): ILeagueSessionSchedule;
    abstract set sessionSchedule(value: ILeagueSessionSchedule);    
    protected constructor() { }
    abstract generateSchedule(sessionSchedule: ILeagueSessionSchedule): Match[];
    abstract generateMatchUpTimes(matches: Match[]): Match[];
    abstract getNextAvailableTime(times: MatchTime[]): MatchTime;
    abstract getNextAvailableDay(): MatchDay;
    abstract findNextLargestNumber(): MatchDay;
    abstract returnTimesForGivenDay(currentDayNum: MatchDay): MatchTime[];
    protected abstract computeNumberOfDaysNeeded(currentDayNum: MatchDay): number
}