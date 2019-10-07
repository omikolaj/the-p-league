import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-schedule-dashboard',
  templateUrl: './admin-schedule-dashboard.component.html',
  styleUrls: ['./admin-schedule-dashboard.component.scss']
})
export class AdminScheduleDashboardComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
