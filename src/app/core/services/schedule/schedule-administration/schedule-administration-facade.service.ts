import { LeagueState, LeagueStateModel } from 'src/app/store/state/league.state';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { Injectable, OnInit } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { LeagueService } from './league/league.service';
import { Observable, BehaviorSubject, concat } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SportTypeState, SportTypeStateModel } from 'src/app/store/state/sport-type.state';
import { Schedule } from 'src/app/store/actions/schedule.actions';
import { Leagues } from 'src/app/store/actions/league.actions';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { MatListOption } from '@angular/material';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { tap, concatMap, switchMap, map } from 'rxjs/operators';
import { Teams } from 'src/app/store/actions/team.actions';
import { TeamState } from 'src/app/store/state/team.state';
import { SportTypesLeaguesPairs } from 'src/app/views/admin/schedule/models/sport-types-leagues-pairs.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationFacade implements OnInit {
  @Select(SportTypeState.getSportTypes) sports$: Observable<SportType[]>;
  @Select(LeagueState.getSelected) selectedLeagues$: Observable<League[]>;
  @Select(TeamState.getUnassigned) unassignedTeams$: Observable<Team[]>;
  sportTypesLeaguesPairs$: Observable<SportTypesLeaguesPairs[]> = this.store.select(SportTypeState.getSportTypesLeaguesPairs);

  constructor(private scheduleAdminAsync: ScheduleAdministrationAsyncService, private leagueService: LeagueService, public store: Store) {}

  ngOnInit() {}

  //#region SportTypes

  addSportType(newSport: SportType): void {
    this.scheduleAdminAsync.addSport(newSport).subscribe(newSport => this.store.dispatch(new Schedule.AddSportType(newSport)));
  }

  addSportAndLeague(newSportType: SportType, newLeague: League): void {
    this.scheduleAdminAsync
      .addSport(newSportType)
      .pipe(
        tap(newSportType => {
          newLeague.sportTypeID = newSportType.id;
          this.addLeague(newLeague);
          return newSportType;
        })
      )
      .subscribe(newSportType => this.store.dispatch(new Schedule.AddSportType(newSportType)));
  }

  updateSportType(updatedSportType: SportType): void {
    this.scheduleAdminAsync
      .updateSportTypes(updatedSportType)
      .subscribe(updatedSportType => this.store.dispatch(new Schedule.UpdateSportType(updatedSportType)));
  }

  deleteSportType(id: string): void {
    this.scheduleAdminAsync.deleteSportType(id).subscribe(id => this.store.dispatch(new Schedule.DeleteSportType(id)));
  }

  //#endregion

  //#region Leagues

  addLeague(newLeague: League): void {
    this.scheduleAdminAsync.addLeague(newLeague).subscribe(() => this.store.dispatch(new Leagues.AddLeague(newLeague)));
  }

  updateLeagues(updatedLeagues: League[]): void {
    this.scheduleAdminAsync.updateLeagues(updatedLeagues).subscribe(() => this.store.dispatch(new Leagues.UpdateLeagues(updatedLeagues)));
  }

  deleteLeagues(sportTypeID: string): void {
    const leagueIDsToDelete: string[] = this.store.selectSnapshot(LeagueState.getSelectedLeagueIDsForSportTypeID(sportTypeID));
    this.scheduleAdminAsync
      .deleteLeagues(leagueIDsToDelete)
      .subscribe(deletedLeagueIDs => this.store.dispatch(new Leagues.DeleteLeagues(deletedLeagueIDs)));
  }

  updateSelectedLeagues(selectedIDs: string[], sportTypeID: string): void {
    this.store.dispatch(new Leagues.UpdateSelectedLeagues(selectedIDs, sportTypeID));
  }

  checkLeagueSelection(): boolean {
    return; //this.leagueAdminService.allSelectedLeagues.length < 1;
  }

  //#endregion

  //#region Teams
  addTeam(newTeam: Team): void {
    this.scheduleAdminAsync.addTeam(newTeam).subscribe(newTeam => this.store.dispatch(new Teams.AddTeam(newTeam)));
  }

  updateTeams(updatedTeams: Team[]): void {
    this.scheduleAdminAsync.updateTeams(updatedTeams).subscribe(updatedTeams => this.store.dispatch(new Teams.UpdateTeams(updatedTeams)));
  }

  unassignTeams(leagueID: string) {
    const teamIDsToUnassign: string[] = this.store.selectSnapshot(TeamState.getSelectedTeamIDsForLeagueID(leagueID));
    this.scheduleAdminAsync
      .unassignTeams(teamIDsToUnassign)
      .subscribe(unassignedTeamIDs => this.store.dispatch(new Teams.UnassignTeams(unassignedTeamIDs)));
  }

  deleteTeams(leagueID: string) {
    const teamIDsToDelete: string[] = this.store.selectSnapshot(TeamState.getSelectedTeamIDsForLeagueID(leagueID));
    this.scheduleAdminAsync.deleteTeams(teamIDsToDelete).subscribe(deletedTeamIDs => this.store.dispatch(new Teams.DeleteTeams(deletedTeamIDs)));
  }

  updateTeamSelection(selectedIDs: string[], leagueID: string): void {
    this.store.dispatch(new Teams.UpdateSelectedTeams(selectedIDs, leagueID));
  }
  //#endregion

  checkExistingSchedule() {
    return false;
  }
}
