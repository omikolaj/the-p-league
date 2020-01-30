import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ScheduleState } from 'src/app/shared/store/state/schedule.state';
import Match from '../../models/schedule/classes/match.model';
import { SportTypesLeaguesPairs } from '../../models/schedule/sport-types-leagues-pairs.model';
import { TeamSession } from '../../models/schedule/team-session.model';
import { DeviceInfoService } from '../device-info/device-info.service';
import { ScheduleAsyncService } from './schedule-async.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleFacadeService {
	@Select(ScheduleState.getSportLeaguePairs) sessionsSportLeaguePairs$: Observable<SportTypesLeaguesPairs[]>;
	@Select(ScheduleState.getSessionsLeagueIDs) sessionsLeagueIDs$: Observable<string[]>;
	@Select(ScheduleState.getTeamsSessionsForLeagueIDFn) sessionsTeamsSessionsByLeagueIDFn$: Observable<(id: string) => TeamSession[]>;
	isMobile = this.deviceInfo.mobile;

	get sessionsMatches(): Match[] {
		return this.store.selectSnapshot(ScheduleState.getSessionsMatches);
	}

	constructor(private store: Store, private scheduleAsync: ScheduleAsyncService, private deviceInfo: DeviceInfoService) {}
}
