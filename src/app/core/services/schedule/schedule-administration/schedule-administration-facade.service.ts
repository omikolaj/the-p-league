import { LeagueState } from 'src/app/store/state/league.state';
import { ScheduleAdministrationAsyncService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-async.service';
import { Injectable, OnInit } from '@angular/core';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { LeagueService } from './league/league.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { SportTypeState } from 'src/app/store/state/sport-type.state';
import { Schedule } from 'src/app/store/actions/schedule.actions';
import { Leagues } from 'src/app/store/actions/league.actions';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { MatListOption } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAdministrationFacade implements OnInit {
  @Select(SportTypeState) sports$: Observable<SportType[]>;
  @Select(LeagueState.getSelected) selectedLeagues$: Observable<League[]>;

  constructor(private scheduleAdminAsync: ScheduleAdministrationAsyncService, private leagueService: LeagueService, public store: Store) {}

  ngOnInit() {}

  //#region SportTypes

  addSportType(newSport: SportType): void {
    this.scheduleAdminAsync.addSport(newSport).subscribe(newSport => {
      this.store.dispatch(new Schedule.AddSportType(newSport));
    });
  }

  updateSportType(updatedSportType: SportType) {
    this.scheduleAdminAsync.updateSportTypes(updatedSportType).subscribe(updatedSportType => {
      this.store.dispatch(new Schedule.UpdateSportType(updatedSportType));
    });
  }

  deleteSportType(id: string) {
    this.scheduleAdminAsync.deleteSportType(id).subscribe(id => {
      this.store.dispatch(new Schedule.DeleteSportType(id));
    });
  }

  //#endregion

  //#region Leagues

  addLeague(newLeague: League): void {
    this.scheduleAdminAsync.addLeague(newLeague).subscribe(() => this.store.dispatch(new Schedule.AddLeague(newLeague)));
  }

  updateSelectedLeagues(allSelected): void {
    this.store.dispatch(new Leagues.UpdateSelectedLeagues(allSelected));
  }

  updateSelectedLeaguesForSportTypeID(selectedOptions: MatListOption[], sportTypeID: string): void {
    const updatedLeagues = this.leagueService.updateSelectedLeaguesForSportTypeID(selectedOptions, sportTypeID);

    this.updateSelectedLeagues(updatedLeagues);
  }

  checkLeagueSelection(): boolean {
    return; //this.leagueAdminService.allSelectedLeagues.length < 1;
  }

  //#endregion

  checkExistingSchedule() {
    return false;
  }
}
