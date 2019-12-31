import { Action, createSelector, Selector, State, StateContext } from '@ngxs/store';
import { produce } from 'immer';
import { ActiveSessionInfo } from 'src/app/core/models/schedule/active-session-info.model';
import Match from 'src/app/core/models/schedule/classes/match.model';
import LeagueSessionSchedule from 'src/app/core/models/schedule/league-session-schedule.model';
import * as Schedule from '../actions/schedules.actions';

export interface ScheduleStateModel {
	entities: {
		[id: string]: LeagueSessionSchedule;
	};
	activeSessionsInfo: {
		[id: string]: ActiveSessionInfo;
	};
	IDs: string[];
}

@State<ScheduleStateModel>({
	name: 'schedules',
	defaults: {
		entities: {},
		activeSessionsInfo: {},
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

	static getActiveSessionInfoForLeagueID(id: string) {
		return createSelector(
			[ScheduleState],
			(state: ScheduleStateModel): ActiveSessionInfo => {
				return Object.values(state.activeSessionsInfo).find((activeSession) => activeSession.leagueId === id);
			}
		);
	}

	@Action(Schedule.InitializeActiveSessionsInfo)
	initializeSchedules(ctx: StateContext<ScheduleStateModel>, action: Schedule.InitializeActiveSessionsInfo): void {
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				action.activeSessions.forEach((activeSession) => {
					draft.activeSessionsInfo[activeSession.sessionId] = activeSession;
				});
			})
		);
	}

	/**
	 * @description Creates sessions for the selected leagues. This can only create a new
	 * session per selected league.
	 * @param ctx
	 * @param action
	 */
	// TODO add IDs to the IDs property on schedule state
	@Action(Schedule.CreateSchedules)
	createSessions(ctx: StateContext<ScheduleStateModel>, action: Schedule.CreateSchedules): void {
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				action.newSessions.forEach((session) => {
					session.teams.forEach((t) => {
						session.teamsSessions = (session.teamsSessions || []).concat({
							teamId: t.id
						});
					});
					session.teams = [];
					draft.entities[session.leagueID] = session;
				});
			})
		);
	}
}
