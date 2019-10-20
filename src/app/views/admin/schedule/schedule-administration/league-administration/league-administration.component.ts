import { Component, OnInit, Input } from '@angular/core';
import { League } from 'src/app/views/schedule/models/interfaces/League.model';
import { Sport } from 'src/app/views/schedule/models/sport.enum';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminAdd } from '../../../models/admin-add-type.model';
import { ScheduleAdministrationService } from 'src/app/core/services/schedule/schedule-administration/schedule-administration.service';
import { LeagueAdministrationService } from 'src/app/core/services/schedule/schedule-administration/league-administration/league-administration.service';
import { SelectedLeagues } from 'src/app/core/services/schedule/interfaces/selected-leagues.model';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';

@Component({
  selector: 'app-league-administration',
  templateUrl: './league-administration.component.html',
  styleUrls: ['./league-administration.component.scss']  
})
export class LeagueAdministrationComponent implements OnInit {    
  @Input() sports: Sport[];

  constructor(private leagueAdminService: LeagueAdministrationService) { }

  ngOnInit() {    
  }

  onLeagueSelectionChange(selectedLeaguesForSport: SportType){    
    this.leagueAdminService.onSelectedLeagues(selectedLeaguesForSport)    
  }

}
