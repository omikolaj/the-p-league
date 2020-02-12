import { Action, Selector, State, StateContext } from '@ngxs/store';
import { produce } from 'immer';
import { ActiveSessionInfo } from 'src/app/core/models/schedule/active-session-info.model';
import LeagueSessionScheduleDTO from 'src/app/core/models/schedule/classes/league-session-schedule-DTO.model';
import LeagueSessionSchedule from 'src/app/core/models/schedule/classes/league-session-schedule.model';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { TeamSession } from 'src/app/core/models/schedule/team-session.model';
import * as Schedule from '../actions/schedules.actions';

export interface ScheduleStateModel {
	entities: {
		previewSchedules: {
			[id: string]: LeagueSessionScheduleDTO;
		};
		matches: {
			[id: string]: Match;
		};
		sessions: {
			[id: string]: LeagueSessionSchedule;
		};
		activeSessionsInfo: {
			[id: string]: ActiveSessionInfo;
		};
	};
}

@State<ScheduleStateModel>({
	name: 'schedules',
	defaults: {
		entities: {
			previewSchedules: {},
			matches: {},
			sessions: {},
			activeSessionsInfo: {}
		}
	}
})
export class ScheduleState {
	constructor() {}

	/**
	 * @description Selects the sessions for the preview that were generated by the admin client side
	 * @returns sessions generated by the admin
	 */
	@Selector()
	static getPreviewSessions(state: ScheduleStateModel): LeagueSessionScheduleDTO[] {
		return Object.values(state.entities.previewSchedules);
	}

	/**
	 * @description Selects matches for the preview that were generated by the admin client side
	 * @returns matches generated for the preview
	 */
	@Selector()
	static getPreviewMatches(state: ScheduleStateModel): Match[] {
		let matches: Match[] = [];
		Object.values(state.entities.previewSchedules).forEach((entity) => {
			matches = [...matches, ...entity.matches];
		});
		return matches;
	}

	/**
	 * @description Selectors all of the matches for the sessions in the store
	 * @returns sessions matches
	 */
	@Selector()
	static getSessionsMatches(state: ScheduleStateModel): Match[] {
		const matches: Match[] = [];
		Object.values(state.entities.sessions).forEach((entity) => {
			entity.matches.forEach((m) => {
				matches.push(state.entities.matches[m]);
			});
		});

		return matches;
	}

	/**
	 * @description Retrieves session's information for the given league id
	 * @param state
	 * @returns session info by league id
	 */
	@Selector()
	static getSessionInfoByLeagueIDFn(state: ScheduleStateModel): (id: string) => ActiveSessionInfo {
		return (id: string): ActiveSessionInfo => Object.values(state.entities.activeSessionsInfo).find((activeSession) => activeSession.leagueId === id);
	}

	@Selector()
	static getTeamsSessionsForLeagueIDFn(state: ScheduleStateModel): (id: string) => TeamSession[] {
		return (id: string): TeamSession[] => Object.values(state.entities.sessions).find((s) => s.leagueID === id).teamsSessions || [];
	}

	/**
	 * @description Returns the active sessions that were fetched from the server
	 * @returns active sessions fetched from server
	 */
	@Selector()
	static getSessions(state: ScheduleStateModel): LeagueSessionSchedule[] {
		return Object.values(state.entities.sessions);
	}

	/**
	 * @description Returns sport league pairs from the schedule state
	 * This may seem redaundent since SportTypeState.getSportTypesLeaguesPairs already exists
	 * but schedule state cannot rely on sportTypes state. Navigating straight to /scoreboards
	 * requires these pairs and fetching sports data just for the pairs purpose is excessive
	 * since all the data to compose pairs is available from this state
	 * @param state
	 * @returns sport league pairs
	 */
	@Selector()
	static getSportLeaguePairs(state: ScheduleStateModel): SportTypesLeaguesPairs[] {
		return Object.values(state.entities.sessions).reduce((accumulator, session) => {
			const existingPair = accumulator.find((pair) => pair.id === session.sportTypeID);
			if (existingPair) {
				existingPair.leagues.push({
					id: session.leagueID,
					name: session.leagueName
				});
			} else {
				accumulator.push({
					id: session.sportTypeID,
					name: session.sportTypeName,
					leagues: [].concat({
						id: session.leagueID,
						name: session.leagueName
					})
				});
			}
			return accumulator;
		}, [] as SportTypesLeaguesPairs[]);
	}

	/**
	 * @description Retrieves all of the league ids for all of the sessions in the store
	 * @param state
	 * @returns sessions league ids
	 */
	@Selector()
	static getSessionsLeagueIDs(state: ScheduleStateModel): string[] {
		return Object.values(state.entities.sessions).map((s) => s.leagueID);
	}

	@Action(Schedule.InitializeSessions)
	initializeSessions(ctx: StateContext<ScheduleStateModel>, action: Schedule.InitializeSessions): void {
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				draft.entities.sessions = action.sessions || {};
			})
		);
	}

	@Action(Schedule.InitializeMatches)
	initializeMatches(ctx: StateContext<ScheduleStateModel>, action: Schedule.InitializeMatches): void {
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				draft.entities.matches = action.matches || {};
			})
		);
	}

	/**
	 * @description Initializes activeSessions, this is used to inform the user
	 * while creating new schedules if there are any active sessions that may overlap
	 * @param ctx
	 * @param Sche
	 */
	@Action(Schedule.InitializeActiveSessionsInfo)
	initializeActiveSessionsInfo(ctx: StateContext<ScheduleStateModel>, action: Schedule.InitializeActiveSessionsInfo): void {
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				action.activeSessions.forEach((activeSession) => {
					if (activeSession) {
						draft.entities.activeSessionsInfo[activeSession.sessionId] = activeSession;
					}
				});
			})
		);
	}

	/**
	 * @description Creates sessions for the selected leagues. This can only create a new
	 * session per selected league. This is only used to store the created sessions so the
	 * Preview component can display them. Entities state of this store slice should be cleared
	 * once user publishes schedules
	 * @param ctx
	 * @param action
	 */
	@Action(Schedule.GeneratePreviewSchedules)
	generatePreviewSchedules(ctx: StateContext<ScheduleStateModel>, action: Schedule.GeneratePreviewSchedules): void {
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				action.newSessions.forEach((session) => {
					draft.entities.previewSchedules[session.leagueID] = session;
				});
			})
		);
	}

	/**
	 * @description Once user publishes client side generated schedules
	 * they are no longer needed to be stored in the state, so remove all references
	 * to them
	 * @param ctx
	 */
	@Action(Schedule.ClearPreviewSchedules)
	clearPreviewSchedules(ctx: StateContext<ScheduleStateModel>): void {
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				draft.entities.previewSchedules = {};
			})
		);
	}

	/**
	 * @description Reports/updates a match result
	 * @param ctx
	 * @param action
	 */
	@Action(Schedule.UpdateMatchResult)
	updateMatchResult(ctx: StateContext<ScheduleStateModel>, action: Schedule.UpdateMatchResult): void {
		ctx.setState(
			produce((draft: ScheduleStateModel) => {
				const match = draft.entities.matches[action.matchResult.matchId];
				if (match) {
					match.matchResult = action.matchResult;
				}
			})
		);
	}
}
