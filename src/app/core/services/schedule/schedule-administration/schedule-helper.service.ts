import { MatSelectionListChange } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
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
