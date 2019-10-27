import { Injectable, OnInit } from "@angular/core";
import { League } from "src/app/views/schedule/models/interfaces/League.model";
import { SportType } from "src/app/views/schedule/models/interfaces/sport-type.model";
import { SelectedLeagues } from "../interfaces/selected-leagues.model";
import { Sport } from "src/app/views/schedule/models/sport.enum";
import { LeagueAdministrationService } from "./league-administration/league-administration.service";
import { AdminAdd } from "src/app/views/admin/models/admin-add-type.model";

@Injectable()
export class ScheduleAdministrationService implements OnInit {
  private _addLeagueConfigData: AdminAdd;

  get addLeagueConfigData(): AdminAdd {
    const sportTypes = this.leagueAdminService.sportTypes;
    return (this._addLeagueConfigData = {
      kind: "league",
      sportTypes: sportTypes,
      title: "Add",
      description: "Sport/League"
    });
  }

  private _addTeamConfigData: AdminAdd;

  get addTeamConfigData(): AdminAdd {
    const leagues = this.leagueAdminService.leagues;
    const sportTypes = this.leagueAdminService.sportTypes;
    return (this._addTeamConfigData = {
      kind: "team",
      title: "Add",
      description: "Team",
      sportTypes: sportTypes
    });
  }

  private _sportTypes: SportType[];
  get sportTypes(): SportType[] {
    return this._sportTypes;
  }
  set sportTypes(value: SportType[]) {
    this._sportTypes = value;
  }

  constructor(private leagueAdminService: LeagueAdministrationService) {}

  ngOnInit() {
    this.sportTypes = this.leagueAdminService.sportTypes;
  }

  checkLeagueSelection(): boolean {
    return this.leagueAdminService.allSelectedLeagues.length < 1;
  }

  checkExistingSchedule() {
    // TODO check if any of the selected league has a schedule to modify
    const allSelectedLeagues = this.leagueAdminService.allSelectedLeagues;
    return false;
  }
}
