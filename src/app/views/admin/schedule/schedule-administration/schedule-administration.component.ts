import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { Sport } from "src/app/views/schedule/models/sport.enum";
import { League } from "src/app/views/schedule/models/interfaces/league.model";
import { MatTabGroup, MatTabChangeEvent } from "@angular/material";
import { AdminAdd } from "../../models/admin-add-type.model";
import { ActivatedRoute } from "@angular/router";
import { SportType } from "src/app/views/schedule/models/interfaces/sport-type.model";
import { ScheduleAdministrationService } from "src/app/core/services/schedule/schedule-administration/schedule-administration.service";
import { TabTitles } from "../models/tab-titles.model";
import { LeagueAdministrationService } from "src/app/core/services/schedule/schedule-administration/league-administration/league-administration.service";

@Component({
  selector: "app-schedule-administration",
  templateUrl: "./schedule-administration.component.html",
  styleUrls: ["./schedule-administration.component.scss"],
  providers: [ScheduleAdministrationService]
})
export class ScheduleAdministrationComponent implements OnInit {
  addLeagueType: AdminAdd;
  addTeamType: AdminAdd;
  leagues: League[] = [];
  sports: SportType[] = [];
  tabTitle: TabTitles = "Schedule";
  nextTab: 0 | 1 | 2 | number;

  @ViewChild("matGroup", { static: false }) matTabGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private scheduleAdminService: ScheduleAdministrationService,
    private leagueAdminService: LeagueAdministrationService
  ) {}

  ngOnInit() {
    this.addLeagueType = this.scheduleAdminService.addLeagueConfigData;
    this.addTeamType = this.scheduleAdminService.addTeamConfigData;
    this.sports = this.leagueAdminService.sportTypes;
  }

  checkSelection(): boolean {
    return this.scheduleAdminService.checkLeagueSelection();
  }

  checkExistingSchedule(): boolean {
    const isDisabled = this.checkSelection();
    if (!isDisabled) {
      return this.scheduleAdminService.checkExistingSchedule();
    }
    return isDisabled;
  }

  reset(event: MatTabChangeEvent) {
    this.nextTab = event.index;
  }

  onItemAdded(event) {
    console.log(event);
  }

  onNewSchedule() {
    // Update tab to 'New Schedule' and navigate to it
    this.tabTitle = "New Schedule";
    this.nextTab = 1;
    console.log(this.matTabGroup);
  }

  onPlayOffsSchedule() {
    //TODO filter list of leagues to selected ones
    this.tabTitle = "Playoffs";
    this.nextTab = 1;
  }

  onModifySchedule() {
    //TODO filter list of leagues to selected ones
    this.tabTitle = "Modify";
    this.nextTab = 1;
  }
}
