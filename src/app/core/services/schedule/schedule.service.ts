import { Injectable } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/team.model';
import { Match } from 'src/app/views/schedule/models/match.model';
import { DateTimeRanges, TimesOfDay } from 'src/app/views/schedule/models/match-time-ranges.model';
import * as moment from 'moment';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';
import { MatchTime } from 'src/app/views/schedule/models/match-time.model';

@Injectable()
export class ScheduleService {
  private _nextDay: number = 0;

  get nextDay(){
    return this._nextDay;
  }

  set nextDay(value: number){
    this._nextDay = value;
  }

  constructor() { }

  generateSchedule(teams: Team[], times: DateTimeRanges): Match[] {
    const dummy: Team = { name: "BYE" };

    teams = teams.slice();
    let numberOfTeams: number = teams.length;

    // if we have odd number of teams
    if (numberOfTeams % 2 === 1) {
      // handle odd numbers
      teams.push(dummy); // so we can match algorithm for even numbers
      numberOfTeams += 1;
    }

    let matches: Match[] = [];
    // loop through all possible opponents (8 teams, means 7 possible opponents)
    // that is why we are subtracting 1
    for (let jindex = 0; jindex < numberOfTeams - 1; jindex++) {      
      // split the total number of teams in half. This will allow us to match each team with each other
      // from the two halves.       
      for (let index = 0; index < numberOfTeams / 2; index++) {
        if (teams[index].name !== dummy.name && teams[numberOfTeams - 1 - index].name !== dummy.name) {
          // in the first round add the first team with the last team  
          matches.push({homeTeam: teams[index], awayTeam: teams[(numberOfTeams - 1) - index], dateTime: null}) // insert pair as a match                          
        }
      }
      // take the array of teams (ps)
      // take the second (zero based) item in the ps array. That is the 1
      // remove it. Remove only one item. thats the second argument 0
      // Replace that item with the last item from the array
      teams.splice(1, 0, teams.pop());
    }
    
    return this.generateMatchUpTimes(matches, times);
  }

  private generateMatchUpTimes(matches: Match[], dtRanges: DateTimeRanges): Match[]{
     // set to english
    moment.locale('en');

    // create a copy of the matches array
    matches = matches.slice();

    const startDate: moment.Moment = dtRanges.sportSession.startDate;
    const endDate: moment.Moment = dtRanges.sportSession.endDate;    
    // sort in descending order
    const availableDaysSorted: MatchDay[] = [...dtRanges.days].sort((current, next) => next - current);

    let current = startDate.clone();
    let index = 0;
    
    while(current.isSame(endDate) || current.isBefore(endDate)){
      // if index is greater than the length of matches return. No longer need to iterate
      // This means that the matches array does not have any other match ups we want to schedule                  
      // get day sunday = 7, monday = 1 etc...
      const currentDayNum = current.isoWeekday();
      // the current date includes one of the days we want to schedule a game on
      // dtRanges.days is Tuesday, Friday, Sunday
      if(dtRanges.days.includes(currentDayNum)){        
        // get next available time
        const timesForCurrentDay: TimesOfDay = dtRanges.timesOfDays.find(timesOfDay => timesOfDay[currentDayNum] !== undefined);

        const listOfMatchTimesForCurrentDay: MatchTime[] = timesForCurrentDay[currentDayNum].sort((a, b) => a.hour - b.hour);
        console.log("listOfMatchTimesForCurrentDay: ", listOfMatchTimesForCurrentDay);

        for (let j = 0; j < listOfMatchTimesForCurrentDay.length; j++) {
          if(index >= matches.length) break; 
          const time: MatchTime = this.getNextAvailableTime(listOfMatchTimesForCurrentDay);      
          
          const match: Match = matches[index];
          const playedThisWeek = moment().clone().subtract(7, 'days').startOf('day');
          // check if team has already played this week

          // if match dateTime is before 7 
          if(match.dateTime.isAfter(playedThisWeek)){
            // it is within a week old
            // skip scheduling another match until next week
            index++;
            continue;
          }
          
          match.dateTime = moment(current).set({hour: time.hour, minute: time.minute});
          // add that this team already has a match this week         
          index++;
        }        
      }

      ///////////////////////////////////////
      /////////NEDS WORK////////////////////
      //////////////////////////////////////
      // If next day in the dtRanges.days array is Sunday and currentDayNum is Friday,
      // I need to add enough days to Friday to make next currentDate be Sunday.
      // This means we need a way to figure out how many days we need to add
      // to the currentDate in order to get to the next date in the dtRanges.days array

      // find next dtRanges.days item, that has a value larger than currentDayNum
      // If we do not find an item, that is larger than currenDayNum,
      // this means currentDayNum is larger than anything we have in the list
      // so start at the begning of the dtRanges.days list
      
      // Find the next smallest available day in the dtRanges.days list
      let nextDayNum: number = this.getNextAvailableDay(availableDaysSorted);
      
      if(currentDayNum !== MatchDay.Sunday){
        nextDayNum = nextDayNum - currentDayNum;
      }

      // Move to the nextDayNum day in the dtRanges.days list
      // If next day we want to schedule games on is Monday, and
      // current date is Friday, we want to add enough days to riday,
      // to take us to next Monday. Thus, current then becomes 
      // actual calendar date for that Monday.
      current.add(nextDayNum, 'days');
    } 
    return matches;
  }

  // Returns next available time when the times array is sorted from earliest games to latest
  // It will modify the array, but moving first item, in the last place
  private getNextAvailableTime(times: MatchTime[]): MatchTime{
    const time: MatchTime = times[0];
    times.splice((times.length - 1), 1, times.shift())
    return time;
  }

  private getNextAvailableDay(days: MatchDay[]): MatchDay{    
    if((this.nextDay === 0) || (this.nextDay === days[0])){
      return this.nextDay = days.reduce((previousDay, currentDay) => Math.min(previousDay, currentDay));
    }
    // if previousDay has been already set
    else{      
      return this.nextDay = this.findNextLargerNumber(days, this.nextDay); 
    }
  }

  private findNextLargerNumber(days: MatchDay[], day: number): MatchDay{
    let next = 0, i = 0;    
    for (; i < days.length; i++) {
      if(days[i] > day){
        next = days[i];        
      }
    }
    return next;
  }
}
