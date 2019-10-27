import { Component, OnInit, Input } from "@angular/core";
import { SportType } from "src/app/views/schedule/models/interfaces/sport-type.model";
import { LeagueAdministrationService } from "src/app/core/services/schedule/schedule-administration/league-administration/league-administration.service";

@Component({
  selector: "app-add-leagues",
  templateUrl: "./add-leagues.component.html",
  styleUrls: ["./add-leagues.component.scss"]
})
export class AddLeaguesComponent implements OnInit {
  title: string = "Add";
  description: string = "Sport/League";
  sportTypes: SportType[];

  constructor(private leagueAdminService: LeagueAdministrationService) {}

  ngOnInit() {
    this.sportTypes = this.leagueAdminService.sportTypes;
  }
}
