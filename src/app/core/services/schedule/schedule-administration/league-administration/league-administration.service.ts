import { Injectable } from '@angular/core';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { ScheduleAdministrationService } from '../schedule-administration.service';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import SessionSchedule from '../../models/session-schedule.model';
import TeamSessionSchedule from 'src/app/views/schedule/models/classes/team-session-schedule.model';

@Injectable({
  providedIn: 'root'
})
export class LeagueAdministrationService {
  selectedLeaguesOfSportType: SportType[] = [];  

  get allSelectedLeagues(): League[]{
    let chosenLeagues: League[] = []
    for (let index = 0; index < this.selectedLeaguesOfSportType.length; index++) {
      const sport = this.selectedLeaguesOfSportType[index];
      for (let j = 0; j < sport.leagues.length; j++) {
        const league = sport.leagues[j];
        chosenLeagues.push(league);
      }
    }
    return chosenLeagues;
  }

  get unassignedTeams(): Team[]{
    // TODO returns unassigned teams
    return [
      { name: 'Atletico Madrid', sessionSchedule: new TeamSessionSchedule() },
      { name: 'FC Barcelona', sessionSchedule: new TeamSessionSchedule() },
      { name: 'Sevilla FC', sessionSchedule: new TeamSessionSchedule() }
    ];
  }

  get leagues(): League[]{
    return [ 
     {
       name: "Monday", type: { name: 'Basketball' }
     },
     {
       name: "Monday", type: { name: 'Volleyball' }
     }
    ]
  }

  constructor() 
  {
  }

  onSelectedLeagues(selectedLeaguesForSport: SportType) {        
    const existingSportType = this.selectedLeaguesOfSportType.find(s => s.name === selectedLeaguesForSport.name);
    if(existingSportType){
      const existingSportTypeIndex = this.selectedLeaguesOfSportType.indexOf(existingSportType);
      if(existingSportTypeIndex > -1){
        if(selectedLeaguesForSport.leagues.length !== 0){
          this.selectedLeaguesOfSportType.splice(existingSportTypeIndex, 1, selectedLeaguesForSport)
        }
        else{
          this.selectedLeaguesOfSportType.splice(existingSportTypeIndex, 1)
        }
      }
    }
    else{
      this.selectedLeaguesOfSportType.push(selectedLeaguesForSport);
    }   
  }

}
