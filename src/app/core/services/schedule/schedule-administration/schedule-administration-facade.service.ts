import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import * as Leagues from 'src/app/store/actions/leagues.actions';
import * as Schedules from 'src/app/store/actions/schedules.actions';
import * as Sports from 'src/app/store/actions/sports.actions';
import * as Teams from 'src/app/store/actions/teams.actions';
import { LeagueState } from 'src/app/store/state/league.state';
import { ScheduleState } from 'src/app/store/state/schedule.state';
import { SportTypeState } from 'src/app/store/state/sport-type.state';
import { TeamState } from 'src/app/store/state/team.state';
import LeagueSessionSchedule from 'src/app/views/admin/schedule/models/session/league-session-schedule.model';
import { SportTypesLeaguesPairs } from 'src/app/views/admin/schedule/models/sport-types-leagues-pairs.model';
import Match from 'src/app/views/schedule/models/classes/match.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { NewSessionScheduleService } from '../session-schedule/new-session-schedule.service';
import { ScheduleAdministrationHelperService } from './schedule-administration-helper.service';

@Injectable({
	providedIn: 'root'
})
export class ScheduleAdministrationFacade {
	// #region Streams

	@Select(SportTypeState.getSportTypes) sports$: Observable<SportType[]>;
	@Select(SportTypeState.getSportTypeByID) getSportByID$: Observable<(id: string) => SportType>;
	@Select(SportTypeState.getSportTypesLeaguesPairs) sportTypesLeaguesPairs$: Observable<SportTypesLeaguesPairs[]>;

	@Select(LeagueState.getAllForSportTypeID) getAllForSportTypeID$: Observable<(id: string) => League[]>;
	@Select(LeagueState.getSelected) selectedLeagues$: Observable<League[]>;

	@Select(TeamState.getUnassigned) unassignedTeams$: Observable<Team[]>;
	@Select(TeamState.getAllForLeagueID) getAllForLeagueID$: Observable<(id: string) => Team[]>;

	get matchesSnapshot(): Match[] {
		return this.store.selectSnapshot(ScheduleState.getMatches);
	}

	get sessionsLeagueIDsSnapshot(): string[] {
		return this.store.selectSnapshot(ScheduleState.getSessionsLeagueIDs);
	}
	// sessionsLeagueIDsSnapshot = this.store.selectSnapshot(ScheduleState.getSessionsLeagueIDs);

	// #endregion

	// #region Snapshots

	// #region

	constructor(
		private scheduleAdminAsync: ScheduleAdministrationAsyncService,
		private store: Store,
		private scheduleAdminHelper: ScheduleAdministrationHelperService,
		private newSessionService: NewSessionScheduleService
	) {}

	// #region NewLeagueSession

	generateNewSchedules(newNewLeagueSessions: LeagueSessionSchedule[]): void {
		const teamEntities = this.store.selectSnapshot<Team[]>((state) => state.teams.entities);
		newNewLeagueSessions = this.scheduleAdminHelper.getTeamsForLeagues(newNewLeagueSessions, teamEntities);
		const newSessions: LeagueSessionSchedule[] = this.newSessionService.generateSchedules(newNewLeagueSessions);
		console.log('newSessions', newSessions);
		this.store.dispatch(new Schedules.CreateSchedules(newSessions));
	}

	// #endregion

	// #region SportTypes

	addSportType(newSport: SportType): void {
		this.scheduleAdminAsync.addSport(newSport).subscribe((newSport) => this.store.dispatch(new Sports.AddSportType(newSport)));
	}

	addSportAndLeague(newSportType: SportType, newLeague: League): void {
		this.scheduleAdminAsync
			.addSport(newSportType)
			.pipe(
				tap((newSportType) => {
					newLeague.sportTypeID = newSportType.id;
					this.addLeague(newLeague);
				})
			)
			.subscribe((newSportType) => this.store.dispatch(new Sports.AddSportType(newSportType)));
	}

	updateSportType(updatedSportType: SportType): void {
		this.scheduleAdminAsync
			.updateSportType(updatedSportType)
			.subscribe((updatedSportType) => this.store.dispatch(new Sports.UpdateSportType(updatedSportType)));
	}

	deleteSportType(id: string): void {
		this.scheduleAdminAsync.deleteSportType(id).subscribe((id) => this.store.dispatch(new Sports.DeleteSportType(id)));
	}

	// #endregion

	// #region Leagues

	addLeague(newLeague: League): void {
		// const addLeageIDsToSportType: { sportTypeID: string; ids: string[] }[] = this.scheduleAdminHelper.generateLeagueIDsForSportType([newLeague]);
		this.scheduleAdminAsync
			.addLeague(newLeague)
			.subscribe((addedLeague) =>
				this.store.dispatch([
					new Sports.AddLeagueIDsToSportType([{ sportTypeID: addedLeague.sportTypeID, ids: [addedLeague.id] }]),
					new Leagues.AddLeague(newLeague)
				])
			);
	}

	updateLeagues(updatedLeagues: League[]): void {
		this.scheduleAdminAsync.updateLeagues(updatedLeagues).subscribe(() => this.store.dispatch(new Leagues.UpdateLeagues(updatedLeagues)));
	}

	deleteLeagues(sportTypeID: string): void {
		const leagueIDs = this.store.selectSnapshot<string[]>((state) => state.types.entities[sportTypeID].leagues);
		const leagueEntities = this.store.selectSnapshot<{ [key: string]: League }>((state) => state.leagues.entities);

		const leagueIDsToDelete = this.scheduleAdminHelper.findSelectedIDs(leagueIDs, leagueEntities);

		this.scheduleAdminAsync
			.deleteLeagues(leagueIDsToDelete)
			.subscribe((deletedLeagueIDs) =>
				this.store.dispatch([new Sports.DeleteLeagueIDsFromSportType(sportTypeID, deletedLeagueIDs), new Leagues.DeleteLeagues(deletedLeagueIDs)])
			);
	}

	updateSelectedLeagues(selectedIDs: string[], sportTypeID: string): void {
		const effectedLeagueIDs: string[] = this.store.selectSnapshot<string[]>((state) => state.types.entities[sportTypeID].leagues);
		this.store.dispatch(new Leagues.UpdateSelectedLeagues(selectedIDs, effectedLeagueIDs));
	}

	checkLeagueSelection(): boolean {
		return; // this.leagueAdminService.allSelectedLeagues.length < 1;
	}

	// #endregion

	// #region Teams

	/**
	 * @param  {Team} inNewTeam
	 * @returns void
	 *
	 * Performs async request to add new team.
	 * It then updates the leagues state by passing in an array of objects
	 * that represent the newly added team with information required to update league state,
	 * and at the same time it will update teams state by simply passing in the new team returned
	 * from the async request
	 */
	addTeam(inNewTeam: Team): void {
		this.scheduleAdminAsync
			.addTeam(inNewTeam)
			.subscribe((newTeam) =>
				this.store.dispatch([new Leagues.AddTeamIDsToLeague([{ leagueID: newTeam.leagueID, ids: [newTeam.id] }]), new Teams.AddTeam(newTeam)])
			);
	}

	/**
	 * @param  {Team[]} updatedTeams
	 *
	 * Updates the passed in teams
	 */
	updateTeams(updatedTeams: Team[]): void {
		this.scheduleAdminAsync.updateTeams(updatedTeams).subscribe((updatedTeams) => this.store.dispatch(new Teams.UpdateTeams(updatedTeams)));
	}

	/**
	 * @param  {string} leagueID
	 * @param  {string[]} teamIDsToUnassign
	 *
	 * Performs an async request and unassigns teams from their leagues
	 * based on the passed in teamIDsToUnassign array, it then dispatches
	 * two actions at the same time, one is to update the leagues teams
	 * property (property that contains team ids assigned to this league)
	 * and the other one is to update each teams leagueID property to '-1'
	 */
	unassignTeams(leagueID: string, teamIDsToUnassign: string[]): void {
		this.scheduleAdminAsync
			.unassignTeams(teamIDsToUnassign)
			.subscribe((unassignedTeamIDs) =>
				this.store.dispatch([new Leagues.DeleteTeamIDsFromLeague(leagueID, teamIDsToUnassign), new Teams.UnassignTeams(unassignedTeamIDs)])
			);
	}

	/**
	 * @param  {Team[]} teams
	 * @returns void
	 *
	 * Receives an array of teams that were selected by the user, in order to assign them
	 * to the corresponding league. Each team object already contains the leagueID
	 * property populated with the leagueID value it is suppoed to be assigned to.
	 * This method takes the teams array and generates a new array of pairs where each pair is
	 * the league ID and list of teams to assign (since this could be a list of teams that must be
	 * assigned to different leagues).
	 * It then dispatches two actions at the same time
	 * to update each league entity's teams property with assigned teams
	 */
	assignTeams(teams: Team[]): void {
		const addTeamIDsToLeague: { leagueID: string; ids: string[] }[] = this.scheduleAdminHelper.generateTeamIDsForLeague(teams);
		this.scheduleAdminAsync
			.assignTeams(teams)
			.subscribe((teams) => this.store.dispatch([new Leagues.AddTeamIDsToLeague(addTeamIDsToLeague), new Teams.AssignTeams(teams)]));
	}

	/**
	 * @param  {string} leagueID
	 * @param  {string[]} teamIDsToDelete
	 * @returns void
	 *
	 * Performs an async request which deletes the teams based on the
	 * teamIDsToDelete array
	 * It then dispatches two actions, one is to update
	 * the given league teams property
	 * (teams proeprty is a list of team ids assigned to this league)
	 * and then deletes the team from the teams state
	 */
	deleteTeams(leagueID: string, teamIDsToDelete: string[]): void {
		this.scheduleAdminAsync
			.deleteTeams(teamIDsToDelete)
			.subscribe((deletedTeamIDs) =>
				this.store.dispatch([new Leagues.DeleteTeamIDsFromLeague(leagueID, deletedTeamIDs), new Teams.DeleteTeams(deletedTeamIDs)])
			);
	}

	/**
	 * @param  {string[]} selectedIDs
	 * @param  {string} leagueID
	 * @returns void
	 *
	 * Updates the selected property setting it to true for every
	 * selected id and sets it to false for all other not effected
	 * teams.
	 * Currently NOT being used
	 */
	updateTeamSelection(selectedIDs: string[], leagueID: string): void {
		const effectedTeamIDs: string[] = this.store.selectSnapshot<string[]>((state) => state.leagues.entities[leagueID].teams);
		this.store.dispatch(new Teams.UpdateSelectedTeams(selectedIDs, effectedTeamIDs));
	}

	// #endregion

	checkExistingSchedule() {
		return false;
	}
}
