import { ILeagueSessionSchedule } from '../interfaces/Ileague-session-schedule.model';
import * as moment from 'moment';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { TimesOfDay } from 'src/app/views/schedule/models/interfaces/times-of-day.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { DateTimeRanges } from 'src/app/views/schedule/models/interfaces/match-time-ranges.model';

export default class SessionSchedule implements ILeagueSessionSchedule{
    startDate: moment.Moment;    
    endDate: moment.Moment;  
    teams: Team[];
    timesOfDays: TimesOfDay[];
    sessionMatches: Match[];

    private _desiredDays: MatchDay[];

    get desiredDays(): MatchDay[]{
        return this._desiredDays;
    }

    set desiredDays(value: MatchDay[]){
        if(value){
            console.log("Sorting desired days list, before: ", value);
            value.sort((a, b) =>  b - a);            
            console.log("Sorting desired days list, after: ", value);
        }
        this._desiredDays = value;
    }

    constructor(private teamsInSession: Team[], private dateTimeRanges: DateTimeRanges) {        
        this.startDate = dateTimeRanges.sportSession.startDate;
        this.endDate = dateTimeRanges.sportSession.endDate;
        this.teams = teamsInSession;
        this.desiredDays = dateTimeRanges.days
        this.timesOfDays = dateTimeRanges.timesOfDays;
    }

    doSomething(){

    }
}