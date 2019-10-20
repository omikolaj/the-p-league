import { Component, OnInit, Input } from '@angular/core';
import { Team } from 'src/app/views/schedule/models/interfaces/team.model';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';

@Component({
  selector: 'app-edit-teams-list',
  templateUrl: './edit-teams-list.component.html',
  styleUrls: ['./edit-teams-list.component.scss']
})
export class EditTeamsListComponent implements OnInit {
  @Input() teams: Team[];
  @Input() league: League;  

  constructor() { }

  ngOnInit() {    
  }

}
