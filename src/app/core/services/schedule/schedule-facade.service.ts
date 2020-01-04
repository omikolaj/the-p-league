import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LeagueState } from 'src/app/shared/store/state/league.state';
import { ScheduleState } from 'src/app/shared/store/state/schedule.state';
import { SportTypeState } from 'src/app/shared/store/state/sport-type.state';
import { TeamState } from 'src/app/shared/store/state/team.state';
import Match from '../../models/schedule/classes/match.model';
import { League } from '../../models/schedule/league.model';
import { SportTypesLeaguesPairs } from '../../models/schedule/sport-types-leagues-pairs.model';
import { Team } from '../../models/schedule/team.model';
import { ScheduleAsyncService } from './schedule-async.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleFacadeService {
	@Select(SportTypeState.getSportTypesLeaguesPairs) sportTypesLeaguesPairs$: Observable<SportTypesLeaguesPairs[]>;
	@Select(LeagueState.getAll) leagues$: Observable<League[]>;
	@Select(TeamState.getAllForLeagueID) getAllTeamsForLeagueID$: Observable<(id: string) => Team[]>;

	get activeSessionsMatches(): Match[] {
		return this.store.selectSnapshot(ScheduleState.getActiveSessionsMatches);
	}

	constructor(private store: Store, private scheduleAsync: ScheduleAsyncService) {}
}
