import { Component, OnInit, Input } from "@angular/core";
import { SportType } from "src/app/views/schedule/models/interfaces/sport-type.model";

@Component({
  selector: "app-add-teams",
  templateUrl: "./add-teams.component.html",
  styleUrls: ["./add-teams.component.scss"]
})
export class AddTeamsComponent implements OnInit {
  title: string = "Add";
  description: string = "Team";

  @Input() sportType: SportType;
  constructor() {}

  ngOnInit() {
    console.log("sporType from add teams comp", this.sportType);
  }
}
