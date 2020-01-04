import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ScheduleState } from 'src/app/shared/store/state/schedule.state';
import Match from '../../models/schedule/classes/match.model';
import { ScheduleAsyncService } from './schedule-async.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleFacadeService {
	get activeSessionsMatches(): Match[] {
		return this.store.selectSnapshot(ScheduleState.getActiveSessionsMatches);
	}

	constructor(private store: Store, private scheduleAsync: ScheduleAsyncService) {}
}
