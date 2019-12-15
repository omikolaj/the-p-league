import { Action, Selector, State, StateContext } from '@ngxs/store';
import { produce } from 'immer';
import LeagueSessionSchedule from 'src/app/views/admin/schedule/models/session/league-session-schedule.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import * as Schedule from '../actions/schedules.actions';

export interface ScheduleStateModel {
	entities: {
		[id: string]: LeagueSessionSchedule;
	};
	IDs: string[];
}

@State<ScheduleStateModel>({
	name: 'schedules',
	defaults: {
		entities: {},
		IDs: []
	}
})
export class ScheduleState {
	@Selector()
	static getSessions(state: ScheduleStateModel): LeagueSessionSchedule[] {
		return Object.values(state.entities);
	}

	@Selector()
	static getMatches(state: ScheduleStateModel): Match[] {
		let matches: Match[] = [];
		Object.values(state.entities).forEach((entity) => {
			matches = [...matches, ...entity.matches];
		});
		return matches;
	}

	@Selector()
	static getSessionsLeagueIDs(state: ScheduleStateModel): string[] {
		return Object.values(state.entities).map((entity) => entity.leagueID);
	}

	/**
	 * @description Creates sessions for the selected leagues. This can only create a new
	 * session per selected league.
	 * @param ctx
	 * @param action
	 */
	@Action(Schedule.CreateSchedules)
	createSessions(ctx: StateContext<ScheduleStateModel>, action: Schedule.CreateSchedules): void {
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				action.newSessions.forEach((session) => {
					draft.entities[session.leagueID] = session;
				});
			})
		);
	}
}
