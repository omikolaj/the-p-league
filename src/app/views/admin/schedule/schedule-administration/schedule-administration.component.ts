import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Sport } from 'src/app/views/schedule/models/sport.enum';
import { League } from 'src/app/views/schedule/models/interfaces/league.model';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-schedule-administration',
  templateUrl: './schedule-administration.component.html',
  styleUrls: ['./schedule-administration.component.scss']
})
export class ScheduleAdministrationComponent implements OnInit {
  leagues: League[] = [{ name: "Monday", type: Sport.Basketball }, { name: "Friday", type: Sport.Basketball }, { name: "Sunday", type: Sport.Basketball }]
  newSessionForm: FormGroup = new FormGroup({    
    'newSportCategory': new FormControl(null),
    'selectedLeagues': new FormControl(this.leagues, Validators.required)
  })

  get sportTypes(){
    return Sport;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {    
  }

  onNext(){
    
  }

  onAddLeague(){    
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.newSessionForm.get('newLeagues')).push(control);
  }

}
