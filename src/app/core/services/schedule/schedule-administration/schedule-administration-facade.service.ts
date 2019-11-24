import { LeagueState } from 'src/app/store/state/league.state';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { Injectable, OnInit } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SportTypeState } from 'src/app/store/state/sport-type.state';
import { Sports } from 'src/app/store/actions/sports.actions';
import { Leagues } from 'src/app/store/actions/leagues.actions';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { tap, map } from 'rxjs/operators';
import { Teams } from 'src/app/store/actions/teams.actions';
import { TeamState } from 'src/app/store/state/team.state';
import { SportTypesLeaguesPairs } from 'src/app/views/admin/schedule/models/sport-types-leagues-pairs.model';
import { ScheduleAdministrationHelperService } from './schedule-administration-helper.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationFacade implements OnInit {
  //#region Streams

  @Select(SportTypeState.getSportTypes) sports$: Observable<SportType[]>;
  @Select(SportTypeState.getSportTypesLeaguesPairs) sportTypesLeaguesPairs$: Observable<SportTypesLeaguesPairs[]>;

  @Select(LeagueState.getAllForSportTypeID) getAllForSportTypeID$: Observable<(id: string) => League[]>;
  @Select(LeagueState.getSelected) selectedLeagues$: Observable<League[]>;

  @Select(TeamState.getUnassigned) unassignedTeams$: Observable<Team[]>;
  @Select(TeamState.getAllForLeagueID) getAllForLeagueID$: Observable<(id: string) => Team[]>;

  //#endregion

  //#region Snapshots

  //#region

  constructor(
    private scheduleAdminAsync: ScheduleAdministrationAsyncService,
    private store: Store,
    private scheduleAdminHelper: ScheduleAdministrationHelperService
  ) {}

  ngOnInit() {}

  //#region SportTypes

  addSportType(newSport: SportType): void {
    this.scheduleAdminAsync.addSport(newSport).subscribe(newSport => this.store.dispatch(new Sports.AddSportType(newSport)));
  }

  addSportAndLeague(newSportType: SportType, newLeague: League): void {
    this.scheduleAdminAsync
      .addSport(newSportType)
      .pipe(
        tap(newSportType => {
          newLeague.sportTypeID = newSportType.id;
          this.addLeague(newLeague);
        })
      )
      .subscribe(newSportType => this.store.dispatch(new Sports.AddSportType(newSportType)));
  }

  updateSportType(updatedSportType: SportType): void {
    this.scheduleAdminAsync
      .updateSportTypes(updatedSportType)
      .subscribe(updatedSportType => this.store.dispatch(new Sports.UpdateSportType(updatedSportType)));
  }

  deleteSportType(id: string): void {
    this.scheduleAdminAsync.deleteSportType(id).subscribe(id => this.store.dispatch(new Sports.DeleteSportType(id)));
  }

  //#endregion

  //#region Leagues

  addLeague(newLeague: League): void {
    this.scheduleAdminAsync
      .addLeague(newLeague)
      .subscribe(() => this.store.dispatch([new Sports.AddSportTypeLeagueID(newLeague.sportTypeID, newLeague.id), new Leagues.AddLeague(newLeague)]));
  }

  updateLeagues(updatedLeagues: League[]): void {
    this.scheduleAdminAsync.updateLeagues(updatedLeagues).subscribe(() => this.store.dispatch(new Leagues.UpdateLeagues(updatedLeagues)));
  }

  deleteLeagues(sportTypeID: string): void {
    const leagueIDs = this.store.selectSnapshot<string[]>(state => state.types.entities[sportTypeID].leagues);
    const leagueEntities = this.store.selectSnapshot<{ [key: string]: League }>(state => state.leagues.entities);

    const leagueIDsToDelete = this.scheduleAdminHelper.findSelectedIDs(leagueIDs, leagueEntities);

    this.scheduleAdminAsync
      .deleteLeagues(leagueIDsToDelete)
      .subscribe(deletedLeagueIDs =>
        this.store.dispatch([new Sports.DeleteSportTypeLeagueIDs(sportTypeID, deletedLeagueIDs), new Leagues.DeleteLeagues(deletedLeagueIDs)])
      );
  }

  updateSelectedLeagues(selectedIDs: string[], sportTypeID: string): void {
    const effectedLeagueIDs: string[] = this.store.selectSnapshot<string[]>(state => state.types.entities[sportTypeID].leagues);

    this.store.dispatch(new Leagues.UpdateSelectedLeagues(selectedIDs, effectedLeagueIDs));
  }

  checkLeagueSelection(): boolean {
    return; //this.leagueAdminService.allSelectedLeagues.length < 1;
  }

  //#endregion

  //#region Teams
  addTeam(newTeam: Team): void {
    this.scheduleAdminAsync
      .addTeam(newTeam)
      .subscribe(newTeam => this.store.dispatch([new Leagues.AddLeagueTeamID(newTeam.leagueID, newTeam.id), new Teams.AddTeam(newTeam)]));
  }

  updateTeams(updatedTeams: Team[]): void {
    this.scheduleAdminAsync.updateTeams(updatedTeams).subscribe(updatedTeams => this.store.dispatch(new Teams.UpdateTeams(updatedTeams)));
  }

  unassignTeams(leagueID: string): void {
    const teamIDs = this.store.selectSnapshot<string[]>(state => state.leagues.entities[leagueID].teams);
    const teamEntities = this.store.selectSnapshot<{ [key: string]: Team }>(state => state.teams.entities);

    const teamIDsToUnassign = this.scheduleAdminHelper.findSelectedIDs(teamIDs, teamEntities);

    this.scheduleAdminAsync
      .unassignTeams(teamIDsToUnassign)
      .subscribe(unassignedTeamIDs => this.store.dispatch(new Teams.UnassignTeams(unassignedTeamIDs)));
  }

  assignTeams(teams: Team[]): void {
    this.scheduleAdminAsync.assignTeams(teams).subscribe(teams => this.store.dispatch(new Teams.AssignTeams(teams)));
  }

  deleteTeams(leagueID: string): void {
    const teamIDs = this.store.selectSnapshot<string[]>(state => state.leagues.entities[leagueID].teams);
    const teamEntities = this.store.selectSnapshot<{ [key: string]: Team }>(state => state.teams.entities);

    const teamIDsToDelete = this.scheduleAdminHelper.findSelectedIDs(teamIDs, teamEntities);

    this.scheduleAdminAsync
      .deleteTeams(teamIDsToDelete)
      .subscribe(deletedTeamIDs =>
        this.store.dispatch([new Leagues.DeleteLeagueTeamIDs(leagueID, deletedTeamIDs), new Teams.DeleteTeams(deletedTeamIDs)])
      );
  }

  updateTeamSelection(selectedIDs: string[], leagueID: string): void {
    const effectedTeamIDs: string[] = this.store.selectSnapshot<string[]>(state => state.leagues.entities[leagueID].teams);
    this.store.dispatch(new Teams.UpdateSelectedTeams(selectedIDs, effectedTeamIDs));
  }
  //#endregion

  checkExistingSchedule() {
    return false;
  }
}
