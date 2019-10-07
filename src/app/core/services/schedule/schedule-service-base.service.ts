// import { Injectable } from '@angular/core';
// import { MatchTime } from 'src/app/views/schedule/models/match-time.model';
// import { Match } from 'src/app/views/schedule/models/match.model';
// import { DateTimeRanges, TimesOfDay } from 'src/app/views/schedule/models/match-time-ranges.model';
// import * as moment from 'moment';
// import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';
// import { Team } from 'src/app/views/schedule/models/team.model';


// export abstract class ScheduleServiceBase {
//   protected readonly DUMMY: string = "BYE";
  
//   // private _startDate: moment.Moment;

//   // get startDate(): moment.Moment{
//   //   return this._startDate;
//   // }

//   // set startDate(value: moment.Moment){
//   //   this._startDate = value;
//   // }

//   // private _desiredDays: MatchDay[] = [];

//   // get desiredDays(): MatchDay[]{
//   //   return this._desiredDays;
//   // }

//   // set desiredDays(value: MatchDay[]){
//   //   if(this._desiredDays.length === 0){
//   //     this._desiredDays = [...value].sort((current, next) => next - current);    
//   //   }    
//   // }


//   // private _endDate: moment.Moment;

//   // get endDate(): moment.Moment{
//   //   return this._endDate;
//   // }

//   // set endDate(value: moment.Moment){    
//   //   this._endDate = value;
//   // }

//   // private _nextDay: number = 0;

//   // get nextDay(){
//   //   return this._nextDay;
//   // }

//   // set nextDay(value: MatchDay){
//   //   this._nextDay = value;
//   // }

//   protectedconstructor() {
//     // set to english
//     moment.locale('en');
//    }

//    generateSchedule(teams: Team[], times: DateTimeRanges): Match[] {
//     const dummy: Team = { name: this.DUMMY };

//     teams = teams.slice();    

//     // if we have odd number of teams
//     if (teams.length % 2 === 1) {
//       // handle odd numbers
//       teams.push(dummy); // so we can match algorithm for even numbers
//       //teams.length += 1;
//     }

//     let matches: Match[] = [];
//     // loop through all possible opponents (8 teams, means 7 possible opponents)
//     // that is why we are subtracting 1
//     for (let jindex = 0; jindex < teams.length - 1; jindex++) {      
//       // split the total number of teams in half. This will allow us to match each team with each other
//       // from the two halves.       
//       for (let index = 0; index < teams.length / 2; index++) {
//         if (teams[index].name !== dummy.name && teams[teams.length - 1 - index].name !== dummy.name) {
//           // in the first round add the first team with the last team  
//           matches.push({homeTeam: teams[index], awayTeam: teams[(teams.length - 1) - index], dateTime: null}) // insert pair as a match                          
//         }
//       }
//       // take the array of teams (ps)
//       // take the second (zero based) item in the ps array. That is the 1
//       // remove it. Remove only one item. thats the second argument 0
//       // Replace that item with the last item from the array
//       teams.splice(1, 0, teams.pop());
//     }
    
//     return this.generateMatchUpTimes(matches, times);
//   } 

//   protected generateMatchUpTimes(matches: Match[], dtRanges: DateTimeRanges): Match[]{
//    // create a copy of the matches array
//    matches = matches.slice();

//    this.startDate = dtRanges.sportSession.startDate;
//    this.endDate = dtRanges.sportSession.endDate;       
//    this.desiredDays = dtRanges.days;

//    let current = this.startDate.clone();
//    let index = 0;
   
//    while(current.isSame(this.endDate) || current.isBefore(this.endDate)){     
//      const currentDayNum: number = current.isoWeekday();
//      // the current date includes one of the days we want to schedule a game on
//      // dtRanges.days is Tuesday, Friday, Sunday
//      if(this.desiredDays.includes(currentDayNum)){        
//        // get next available time       
//        const listOfMatchTimesForCurrentDay = this.returnTimesOfDay([...dtRanges.timesOfDays], currentDayNum)
//        console.log("listOfMatchTimesForCurrentDay: ", listOfMatchTimesForCurrentDay);

//        for (let j = 0; j < listOfMatchTimesForCurrentDay.length; j++) {
//          if(index >= matches.length) break; 
//          const time: MatchTime = this.getNextAvailableTime(listOfMatchTimesForCurrentDay);      
         
//          const match: Match = matches[index];
//          const playedThisWeek = moment().clone().subtract(7, 'days').startOf('day');
//          // check if team has already played this week

//          // if match dateTime is before 7 
//          if(match.dateTime !== null){
//            if(match.dateTime.isAfter(playedThisWeek)){
//              // it is within a week old
//              // skip scheduling another match until next week
//              index++;
//              continue;
//            }            
//          }
         
//          match.dateTime = moment(current).set({hour: time.hour, minute: time.minute});
//          // add that this team already has a match this week         
//          index++;
//        }        
//      }
//      // Find the next smallest available day in the dtRanges.days list
//      let nextDayNum: number = this.getNextAvailableDay(this.desiredDays);
     
//      if(currentDayNum !== MatchDay.Sunday){
//        nextDayNum = nextDayNum - currentDayNum;
//      }
//      current.add(nextDayNum, 'days');
//    } 
//    return matches;
//  }

//  // Returns next available time when the times array is sorted from earliest games to latest
//  // It will modify the array, but moving first item, in the last place
//  private getNextAvailableTime(times: MatchTime[]): MatchTime{
//    const time: MatchTime = times[0];
//    times.splice((times.length - 1), 1, times.shift())
//    return time;
//  }

//  private getNextAvailableDay(days: MatchDay[]): MatchDay{    
//    if((this.nextDay === 0) || (this.nextDay === days[0])){
//      return this.nextDay = days.reduce((previousDay, currentDay) => Math.min(previousDay, currentDay));
//    }
//    // if previousDay has been already set
//    else{      
//      return this.nextDay = this.findNextLargerNumber(days, this.nextDay); 
//    }
//  }

//  private findNextLargerNumber(days: MatchDay[], day: number): MatchDay{
//    let next = 0, i = 0;    
//    for (; i < days.length; i++) {
//      if(days[i] > day){
//        next = days[i];        
//      }
//    }
//    return next;
//  }

//  private returnTimesOfDay(timesOfDays: TimesOfDay[], currentDayNum: number): MatchTime[]{
//   const timesForCurrentDay: TimesOfDay = timesOfDays.find(timesOfDay => timesOfDay[MatchDay[currentDayNum]] !== undefined);

//   return timesForCurrentDay[MatchDay[currentDayNum]].sort((a, b) => a.hour - b.hour);
//  }  
// }
