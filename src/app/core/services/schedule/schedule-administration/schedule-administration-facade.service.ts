import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { NEVER, Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ActiveSessionInfo } from 'src/app/core/models/schedule/active-session-info.model';
import LeagueSessionScheduleDTO from 'src/app/core/models/schedule/classes/league-session-schedule-DTO.model';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { League } from 'src/app/core/models/schedule/league.model';
import { MatchResult } from 'src/app/core/models/schedule/match-result.model';
import { SportType } from 'src/app/core/models/schedule/sport-type.model';
import { SportTypesLeaguesPairs } from 'src/app/core/models/schedule/sport-types-leagues-pairs.model';
import { TeamSession } from 'src/app/core/models/schedule/team-session.model';
import { Team } from 'src/app/core/models/schedule/team.model';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { SnackBarEvent, SnackBarService } from 'src/app/shared/components/snack-bar/snack-bar-service.service';
import * as Leagues from 'src/app/shared/store/actions/leagues.actions';
import * as Schedules from 'src/app/shared/store/actions/schedules.actions';
import * as Sports from 'src/app/shared/store/actions/sports.actions';
import * as Teams from 'src/app/shared/store/actions/teams.actions';
import { LeagueState } from 'src/app/shared/store/state/league.state';
import { ScheduleState } from 'src/app/shared/store/state/schedule.state';
import { SportTypeState } from 'src/app/shared/store/state/sport-type.state';
import { TeamState } from 'src/app/shared/store/state/team.state';
import { DeviceInfoService } from '../../device-info/device-info.service';
import { NewSessionScheduleService } from './new-session-schedule.service';
import { ScheduleAdministrationHelperService } from './schedule-administration-helper.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationFacade {
	// #region Streams/snapshots

	// #region SportTypes streams

	@Select(SportTypeState.getSportTypes) sports$: Observable<SportType[]>;
	@Select(SportTypeState.getSportTypeByID) getSportByID$: Observable<(id: string) => SportType>;
	@Select(SportTypeState.getSportTypesLeaguesPairs) sportTypesLeaguesPairs$: Observable<SportTypesLeaguesPairs[]>;

	// #endregion

	// #region Leagues streams

	@Select(LeagueState.getLeagues) leagues$: Observable<League[]>;
	@Select(LeagueState.getLeaguesForSportTypeIDFn) getLeaguesForSportTypeIDFn$: Observable<(id: string) => League[]>;
	@Select(LeagueState.getSelectedLeagues) selectedLeagues$: Observable<League[]>;

	// #endregion

	// #region Teams streams

	@Select(TeamState.getUnassignedTeams) unassignedTeams$: Observable<Team[]>;
	@Select(TeamState.getTeamsForLeagueIDFn) getTeamsForLeagueIDFn$: Observable<(id: string) => Team[]>;

	// #endregion

	// #region Schedule streams/snapshots

	// Used by new-schedule component to retrieve session info from the store via observable stream
	@Select(ScheduleState.getSessionInfoByLeagueIDFn) getSessionInfoByLeagueIDFn$: Observable<(id: string) => ActiveSessionInfo>;
	@Select(ScheduleState.getSessionsMatches) sessionsMatches$: Observable<Match[]>;
	@Select(ScheduleState.getSportLeaguePairs) sessionsSportLeaguePairs$: Observable<SportTypesLeaguesPairs[]>;
	@Select(ScheduleState.getSessionsLeagueIDs) sessionsLeagueIDs$: Observable<string[]>;
	@Select(ScheduleState.getTeamsSessionsForLeagueIDFn) sessionsTeamsSessionsByLeagueIDFn$: Observable<(id: string) => TeamSession[]>;
	// Used by the preview component to populate MatTableDataSource.data property
	get matchesSnapshot(): Match[] {
		return this.store.selectSnapshot(ScheduleState.getPreviewMatches);
	}
	// Used by new-schedule component to perform session start date validation. It returns latest snapshot from the store
	sessionInfoByLeagueID(leagueID: string): ActiveSessionInfo {
		return this.store.selectSnapshot(ScheduleState.getSessionInfoByLeagueIDFn)(leagueID);
	}
	// #endregion

	// #endregion Streams/snapshots

	// #region Properties

	isMobile = this.deviceInfo.mobile;

	// #endregion

	constructor(
		private scheduleAdminAsync: ScheduleAdministrationAsyncService,
		private store: Store,
		private scheduleAdminHelper: ScheduleAdministrationHelperService,
		private newSessionService: NewSessionScheduleService,
		private router: Router,
		private deviceInfo: DeviceInfoService,
		public snackBarService: SnackBarService
	) {}

	// #region Schedules

	/**
	 * @description Generates preview schedules for the preview component client side
	 * @param newLeagueSessions
	 */
	generatePreviewSchedules(newLeagueSessions: LeagueSessionScheduleDTO[]): void {
		const teamsForPreviewSchedules: Team[] = this.scheduleAdminHelper.getTeamsForLeagueIDs(newLeagueSessions.map((s) => s.leagueID));
		const newSessions: LeagueSessionScheduleDTO[] = this.newSessionService.generateSchedules(newLeagueSessions, teamsForPreviewSchedules);
		this.store.dispatch(new Schedules.GeneratePreviewSchedules(newSessions));
	}

	/**
	 * @description Publishs session schedules once when user selects 'Publish' button
	 */
	publishSessionSchedules(): void {
		const sessions = this.store.selectSnapshot(ScheduleState.getPreviewSessions);
		this.scheduleAdminAsync
			.publishSessions(sessions)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Schedules published', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.publish_new_sessions}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((_) => {
				// clear created schedules from memory. They were only saved to be displayed
				// in the preview component
				this.store.dispatch(new Schedules.ClearPreviewSchedules());
				this.router.navigate(['admin']);
			});
	}

	/**
	 * @description Gets active sessions info. This is used by the new-session-schedule
	 * component to give user feedback if the league they selected to generate new session for
	 * has a current session and if it does, it will display when that session ends to avoid
	 * creating two sessions that have over lap
	 * @param leagueIDs
	 * @returns active sessions info
	 */
	getActiveSessionsInfo(leagueIDs: string[]): Observable<ActiveSessionInfo[]> {
		return this.scheduleAdminAsync
			.fetchActiveSessionsInfo(leagueIDs)
			.pipe(
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.active_sessions_info}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.pipe(tap((activeSessionsInfo) => this.store.dispatch(new Schedules.InitializeActiveSessionsInfo(activeSessionsInfo))));
	}

	/**
	 * @description Reports the score of the given match. Used by the scoreboard-component
	 * @param report
	 */
	reportMatch(report: { result: MatchResult; sessionID: string }): void {
		this.scheduleAdminAsync
			.reportMatch(report)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Game score saved', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.match_result}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((result) => {
				this.store.dispatch(new Schedules.UpdateMatchResult(result));
			});
	}

	// #endregion

	// #region SportTypes

	/**
	 * @description Adds new sport type
	 * @param newSport
	 */
	addSportType(newSport: SportType): void {
		this.scheduleAdminAsync
			.addSport(newSport)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Sport added', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.sport_type_add}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((newSport) => this.store.dispatch(new Sports.AddSportType(newSport)));
	}

	/**
	 * @description Adds new sport type and new league
	 * @param newSportType
	 * @param newLeague
	 */
	addSportAndLeague(newSportType: SportType, newLeague: League): void {
		this.scheduleAdminAsync
			.addSport(newSportType)
			.pipe(
				tap((newSportType) => this.store.dispatch(new Sports.AddSportType(newSportType))),
				switchMap((newSportType) => {
					newLeague.sportTypeID = newSportType.id;
					return this.scheduleAdminAsync
						.addLeague(newLeague)
						.pipe(
							tap((newLeague) =>
								this.store.dispatch([
									new Leagues.AddLeague(newLeague),
									new Sports.AddLeagueIDsToSportType([{ sportTypeID: newSportType.id, ids: [newLeague.id] }])
								])
							)
						);
				}),
				tap(() => this.snackBarService.openSnackBarFromComponent('Sport and league added', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent([e.error.sport_type_add, e.error.league_add].join(''), 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe();
	}

	/**
	 * @description Updates existing sport type. Currently this is only for updating the name property
	 * @param updatedSportType
	 */
	updateSportType(updatedSportType: SportType): void {
		this.scheduleAdminAsync
			.updateSportType(updatedSportType)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Sport updated', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.sport_type_update}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((updatedSportType) => this.store.dispatch(new Sports.UpdateSportType(updatedSportType)));
	}

	/**
	 * @description Deletes an existing sport type
	 * @param id
	 */
	deleteSportType(id: string): void {
		this.scheduleAdminAsync
			.deleteSportType(id)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Sport deleted', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.sport_type_delete}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((_) => this.store.dispatch(new Sports.DeleteSportType(id)));
	}

	// #endregion

	// #region Leagues

	/**
	 * @description Adds a new league
	 * @param newLeague
	 */
	addLeague(newLeague: League): void {
		this.scheduleAdminAsync
			.addLeague(newLeague)
			.pipe(
				tap(() => {
					this.snackBarService.openSnackBarFromComponent('League added', 'Dismiss', SnackBarEvent.Success);
				}),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.league_add}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((addedLeague) =>
				this.store.dispatch([
					new Leagues.AddLeague(addedLeague),
					new Sports.AddLeagueIDsToSportType([{ sportTypeID: addedLeague.sportTypeID, ids: [addedLeague.id] }])
				])
			);
	}

	/**
	 * @description Updates leagues
	 * @param updatedLeagues
	 */
	updateLeagues(updatedLeagues: League[]): void {
		this.scheduleAdminAsync
			.updateLeagues(updatedLeagues)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Leagues updated', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.league_update}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe(() => this.store.dispatch(new Leagues.UpdateLeagues(updatedLeagues)));
	}

	/**
	 * @description Deletes leagues
	 * @param sportTypeID
	 */
	deleteLeagues(sportTypeID: string): void {
		const leagueIDs = this.store.selectSnapshot<string[]>((state) => state.types.entities[sportTypeID].leagues);
		const leagueEntities = this.store.selectSnapshot<{ [key: string]: League }>((state) => state.leagues.entities);
		const leagueIDsToDelete = this.scheduleAdminHelper.findSelectedIDs(leagueIDs, leagueEntities);
		const teamsToUnassign = this.store.selectSnapshot(LeagueState.getTeamIDsForLeagueIDsFn)(leagueIDsToDelete);

		this.scheduleAdminAsync
			.deleteLeagues(leagueIDsToDelete)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Leagues deleted', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.league_delete}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((_) =>
				this.store.dispatch([
					new Sports.DeleteLeagueIDsFromSportType(sportTypeID, leagueIDsToDelete),
					new Leagues.DeleteLeagues(leagueIDsToDelete),
					new Teams.UnassignTeams(teamsToUnassign)
				])
			);
	}

	/**
	 * @description Updates selected leagues
	 * @param selectedIDs
	 * @param sportTypeID
	 */
	updateSelectedLeagues(selectedIDs: string[], sportTypeID: string): void {
		const effectedLeagueIDs: string[] = this.store.selectSnapshot<string[]>((state) => state.types.entities[sportTypeID].leagues);
		this.store.dispatch(new Leagues.UpdateSelectedLeagues(selectedIDs, effectedLeagueIDs));
	}

	// #endregion

	// #region Teams

	/**
	 * @description Performs async request to add new team.
	 * It then updates the leagues state by passing in an array of objects
	 * that represent the newly added team with information required to update league state,
	 * and at the same time it will update teams state by simply passing in the new team returned
	 * from the async request
	 * @param inNewTeam
	 */
	addTeam(inNewTeam: Team): void {
		this.scheduleAdminAsync
			.addTeam(inNewTeam)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Team added', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.team_add}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((newTeam) =>
				this.store.dispatch([new Leagues.AddTeamIDsToLeague([{ leagueID: newTeam.leagueID, ids: [newTeam.id] }]), new Teams.AddTeam(newTeam)])
			);
	}

	/**
	 * @description Updates the passed in teams
	 * @param updatedTeams
	 */
	updateTeams(updatedTeams: Team[]): void {
		this.scheduleAdminAsync
			.updateTeams(updatedTeams)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Teams updated', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.team_update}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((updatedTeams) => this.store.dispatch(new Teams.UpdateTeams(updatedTeams)));
	}

	/**
	 * @description Performs an async request and unassigns teams from their leagues
	 * based on the passed in teamIDsToUnassign array, it then dispatches
	 * two actions at the same time, one is to update the leagues teams
	 * property (property that contains team ids assigned to this league)
	 * and the other one is to update each teams leagueID property to '-1'
	 * @param leagueID
	 * @param teamIDsToUnassign
	 */
	unassignTeams(leagueID: string): void {
		const teamIDsToUnassign = this.store
			.selectSnapshot(TeamState.getTeamsForLeagueIDFn)(leagueID)
			.filter((t) => t.selected === true)
			.map((t) => t.id);
		this.scheduleAdminAsync
			.unassignTeams(teamIDsToUnassign)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Teams unassigned', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.team_unassign}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((unassignedTeamIDs) =>
				this.store.dispatch([new Leagues.DeleteTeamIDsFromLeague(leagueID, teamIDsToUnassign), new Teams.UnassignTeams(unassignedTeamIDs)])
			);
	}

	/**
	 * @description Receives an array of teams that were selected by the user, in order to assign them
	 * to the corresponding league. Each team object already contains the leagueID
	 * property populated with the leagueID value it is suppoed to be assigned to.
	 * This method takes the teams array and generates a new array of pairs where each pair is
	 * the league ID and list of teams to assign (since this could be a list of teams that must be
	 * assigned to different leagues).
	 * It then dispatches two actions at the same time
	 * to update each league entity's teams property with assigned teams
	 * @param teams
	 */
	assignTeams(teams: Team[]): void {
		const addTeamIDsToLeague: { leagueID: string; ids: string[] }[] = this.scheduleAdminHelper.generateTeamIDsForLeague(teams);
		this.scheduleAdminAsync
			.assignTeams(teams)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Teams assigned', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.team_unassign}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((teams) => this.store.dispatch([new Leagues.AddTeamIDsToLeague(addTeamIDsToLeague), new Teams.AssignTeams(teams)]));
	}

	/**
	 * Performs an async request which deletes the teams based on the
	 * teamIDsToDelete array
	 * It then dispatches two actions, one is to update
	 * the given league teams property
	 * (teams proeprty is a list of team ids assigned to this league)
	 * and then deletes the team from the teams state
	 * @param leagueID
	 * @param teamIDsToDelete
	 */
	deleteTeams(leagueID: string, teamIDsToDelete: string[]): void {
		this.scheduleAdminAsync
			.deleteTeams(teamIDsToDelete)
			.pipe(
				tap(() => this.snackBarService.openSnackBarFromComponent('Teams deleted', 'Dismiss', SnackBarEvent.Success)),
				catchError((e) => {
					this.snackBarService.openSnackBarFromComponent(`${e.error.team_delete}`, 'Dismiss', SnackBarEvent.Error);
					return NEVER;
				})
			)
			.subscribe((_) =>
				this.store.dispatch([new Leagues.DeleteTeamIDsFromLeague(leagueID, teamIDsToDelete), new Teams.DeleteTeams(teamIDsToDelete)])
			);
	}

	/**
	 * @description Updates the selected property setting it to true for every
	 * selected id and sets it to false for all other not effected
	 * teams.
	 */
	updateTeamSelection(event: { selectedTeamIDs: string[]; leagueID: string }[]): void {
		event.forEach((e) => this.store.dispatch(new Teams.UpdateSelectedTeams(e.selectedTeamIDs, e.leagueID)));
	}

	// #endregion
}
