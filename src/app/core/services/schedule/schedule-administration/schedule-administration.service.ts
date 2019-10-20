import { Injectable } from '@angular/core';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { SelectedLeagues } from '../interfaces/selected-leagues.model';
import { Sport } from 'src/app/views/schedule/models/sport.enum';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationService {  
  private _sportTypes: SportType[];

  get sportTypes(): SportType[]{
    return this._sportTypes
  }

  set sportTypes(value: SportType[]){
    this._sportTypes = value;
  }


  constructor() { }

  getAllSports(): SportType[] {
    return [
      {
        name: "Basketball",
        leagues: [
          { name: "Monday" }, { name: "Friday" }, { name: "Sunday" }
        ]
      },
      {
        name: "Volleyball",
        leagues: [
          { name: "Monday" }, { name: "Friday" }, { name: "Saturday" }
        ]
      },
      {
        name: "Soccer",
        leagues: [
        ]
      }
    ]
  }


}
