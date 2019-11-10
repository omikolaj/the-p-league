import { FormGroup } from '@angular/forms';
import { ScheduleAdministrationFacade } from './schedule-administration-facade.service';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { SportTypeState, SportTypeStateModel } from 'src/app/store/state/sport-type.state';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor() {}

  // addSportLeague(newSportLeague: FormGroup): void {
  //   const newSportType: SportType = {
  //     name: newSportLeague.get('sportType').value,
  //     leagues: []
  //   };
  //   let newLeague: League = {
  //     name: newSportLeague.get('leagueName').value
  //   };

  //   if (newLeague.name) {
  //     newSportType.leagues.push(newLeague);
  //   }

  //   const sportTypes: SportType[] = this.scheduleAdminFacade.store.selectSnapshot(state => state.types.sports);
  //   // check if were adding to existing sport type
  //   const existingSport = sportTypes.find(s => s.name === newSportType.name);

  //   // means were adding new league to existing sport
  //   if (existingSport) {
  //     newLeague.sportTypeID = existingSport.id;
  //     this.scheduleAdminFacade.addLeague(newLeague);
  //   } else {
  //     this.scheduleAdminFacade.addSport(newSportType);
  //   }
  // }
}
