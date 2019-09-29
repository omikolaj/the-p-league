import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import ScheduleDataSource from './leagues/league/league-schedule/league-schedule.datasource';



@Component({
  selector: 'app-schedule-container',
  templateUrl: './schedule-container.component.html',
  styleUrls: ['./schedule-container.component.scss']
})
export class ScheduleContainerComponent implements OnInit {
  

  constructor(private fb: FormBuilder) { }

  ngOnInit() {    
  }

}
