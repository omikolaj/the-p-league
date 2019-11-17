import { MatSelectionListChange } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { ScheduleAdministrationFacade } from './schedule-administration-facade.service';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { SportTypeState, SportTypeStateModel } from 'src/app/store/state/sport-type.state';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

//TODO make this service only injectable at the level of the component
@Injectable({
  providedIn: 'root'
})
export class ScheduleHelperService {
  constructor() {}

  onSelectionChange(selectedEvent: MatSelectionListChange): string[] {
    const ids: string[] = [];
    for (let index = 0; index < selectedEvent.source.selectedOptions.selected.length; index++) {
      const matListOption = selectedEvent.source.selectedOptions.selected[index];
      ids.push(matListOption.value);
    }
    return ids;
  }
}
