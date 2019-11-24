import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationHelperService {
  constructor() {}
  /**
   * @param  {string[]} searchIDs
   * @param  {{[key:string]:Team}} entities
   * @returns string
   * Iterates over searchIDs and returns filtered entity string array of IDs that have
   * the selected property set to true
   */
  findSelectedIDs(searchIDs: string[], entities: { [key: string]: Team }): string[] {
    return searchIDs.filter(searchID => {
      if (entities[searchID]) {
        if ('selected' in entities[searchID]) {
          return entities[searchID].selected;
        }
      }
    });
  }
}
