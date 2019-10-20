import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Sport } from 'src/app/views/schedule/models/sport.enum';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { MatTabGroup } from '@angular/material';
import { AdminAdd } from '../../models/admin-add-type.model';
import { ActivatedRoute } from '@angular/router';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';

@Component({
  selector: 'app-schedule-administration',
  templateUrl: './schedule-administration.component.html',
  styleUrls: ['./schedule-administration.component.scss']
})
export class ScheduleAdministrationComponent implements OnInit {
  addLeagueType: AdminAdd = { kind: 'league', sportTypes: Sport, title: 'Add', description: 'Sport/League' };
  addTeamType: AdminAdd;
  leagues: League[] = [];
  sports: SportType[] = [];  

  get sportTypes(){
    return Sport;
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    
  }

  ngOnInit() {     
    this.sports = this.route.snapshot.data.sports;        
    this.addTeamType = { kind: 'team', title: 'Add', description: 'Team', leagues: [] }  
  }

  onItemAdded(event){
    console.log(event)
  }

  onNewSchedule(){
    //TODO filter list of leagues to selected ones
  }

  onPlayOffsSchedule(){
    //TODO filter list of leagues to selected ones
  }

  onModifySchedule(){
    //TODO filter list of leagues to selected ones
  }

  

}
