import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';

@Component({
	selector: 'app-new-session-schedule',
	templateUrl: './new-session-schedule.component.html',
	styleUrls: ['./new-session-schedule.component.scss']
})
export class NewSessionScheduleComponent implements OnInit {
	matchDays = MatchDay;
	newSession: FormGroup = this.fb.group({});

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {}
}
