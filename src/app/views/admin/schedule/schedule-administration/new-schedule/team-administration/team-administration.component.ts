import { Component, OnInit, Input } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

@Component({
  selector: 'app-team-administration',
  templateUrl: './team-administration.component.html',
  styleUrls: ['./team-administration.component.scss']
})
export class TeamAdministrationComponent implements OnInit {
  @Input() league: League;

  constructor() { }

  ngOnInit() {
    console.log("teamadmin:", this.league);
  }

}
