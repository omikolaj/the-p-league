import { Injectable } from '@angular/core';
import { flattenDepth } from 'lodash';
import { Team } from 'src/app/views/schedule/models/team.model';
import { Match } from 'src/app/views/schedule/models/match.model';

@Injectable()
export class ScheduleService {

  constructor() { }

  generateSchedule(numberOfTeams: number, teams: Team[]): Match[] {
    const dummy: Team = { name: "BYE" };
    let rounds = [];    

    teams = teams.slice();

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
      
      // create inner array to represent the round
      rounds[jindex] = []; // create inner match array for round index
      // split the total number of teams in half. This will allow us to match each team with each other
      // from the two halves.       
      for (let index = 0; index < numberOfTeams / 2; index++) {
        if (teams[index].name !== dummy.name && teams[numberOfTeams - 1 - index].name !== dummy.name) {
          // in the first round add the first team with the last team  
          matches.push({homeTeam: teams[index], awayTeam: teams[(numberOfTeams - 1) - index]})
          rounds[jindex].push([teams[index], teams[(numberOfTeams - 1) - index]]); // insert pair as a match                
        }
      }
      // take the array of teams (ps)
      // take the second (zero based) item in the ps array. That is the 1
      // remove it. Remove only one item. thats the second argument 0
      // Replace that item with the last item from the array
      teams.splice(1, 0, teams.pop());
    }
    console.log("matches: ", matches);
    console.log("Flatten depth: ", flattenDepth(rounds, 1));
    //console.log("Flatten deep: ", flattenDeep(rounds));

    //return flattenDepth(rounds, 1);
    return matches;
  }

}
