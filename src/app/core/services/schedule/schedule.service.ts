import { Injectable } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/team.model';
import { Match } from 'src/app/views/schedule/models/match.model';
import { BehaviorSubject } from 'rxjs';
import { DateTimeRanges } from 'src/app/views/schedule/models/match-time-ranges.model';
import * as moment from 'moment';
import { MatchDays } from 'src/app/views/schedule/models/match-days.enum';
import { MatchTime } from 'src/app/views/schedule/models/match-time.model';

@Injectable()
export class ScheduleService {
  
  constructor() { }

  generateSchedule(teams: Team[], times: DateTimeRanges): Match[] {
    const dummy: Team = { name: "BYE" };
    let rounds = [];    

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
          matches.push({homeTeam: teams[index], awayTeam: teams[(numberOfTeams - 1) - index]}) // insert pair as a match                          
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
    moment.locale('en'); // set to english
    // create a copy of the matches array
    matches = matches.slice();
    const startDate: moment.Moment = dtRanges.sportSession.startDate;
    const endDate: moment.Moment = dtRanges.sportSession.endDate;
    const times: MatchTime[] = dtRanges.times;

    let temp = startDate.clone();
    let index = 0;
    while(temp.isSame(endDate) || temp.isBefore(endDate)){
      // if index is greater than the length of matches return. No longer need to iterate      
      if(index >= matches.length) break;      
      // get day sunday = 7, monday = 1 etc...
      const dayNum = temp.isoWeekday();
      // the current date includes one of the days we want to schedule a game
      if(dtRanges.days.includes(dayNum)){        
        // get next available time
        const time: MatchTime = this.getNextAvailableTime(times);        
        matches[index].dateTime = moment(temp).set({hour: time.hour, minute: time.minute});        
        index++;
      }

      let next: number;     

      ///////////////////////////////////////
      /////////NEDS WORK////////////////////
      //////////////////////////////////////
      //IF THERE IS ONLY ONE DAY IN THE WEEK THIS BREAKS
      // OR IF SUNDAY IS NOT IN THE LIST

      // CAN PROBABLY REMOVE THIS
      if(dayNum === MatchDays.Sunday){
        next = dtRanges.days[0];
      }
      else{
        // find next biggest day
        next = dtRanges.days.find(d => d > dayNum);

        // if we did not find next biggest one this means this is the biggest day
        if(next === undefined){
          next = dtRanges.days[0];
        }
        // then subtract current dayNum from it
        next = next - dayNum;        
      }

      temp.add(next, 'days');
    } 
    return matches;
  }

  private getNextAvailableTime(times: MatchTime[]): MatchTime{
    const time: MatchTime = times[0];
    times.splice(0, 0, times.pop())
    return time;
  }
  

}
