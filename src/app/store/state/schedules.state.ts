import { Action, Selector, State, StateContext } from '@ngxs/store';
import { produce } from 'immer';
import LeagueSessionSchedule from 'src/app/views/admin/schedule/models/session/league-session-schedule.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import * as Schedule from '../actions/schedule.actions';

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
	static getSchedules(state: ScheduleStateModel): LeagueSessionSchedule[] {
		console.log('returning schedules', state.entities)
		return Object.values(state.entities);
	}

	@Selector()
	static getMatches(state: ScheduleStateModel): Match[] {
		let matches: Match[] = [];
		Object.values(state.entities).forEach((entity) => {
			matches = [...matches, ...entity.matches]
		})
		console.log('returning matches for data source', matches)
		return matches;
	}

	@Action(Schedule.CreateSchedules)
	createSessions(ctx: StateContext<ScheduleStateModel>, action: Schedule.CreateSchedules): void {
		console.log('createSessions', action);
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				action.newSessions.forEach((session) => {
					draft.entities[session.leagueID] = new LeagueSessionSchedule(session);
				});
			})
		);
		console.log('state after adding sessions', ctx.getState());
	}
}
