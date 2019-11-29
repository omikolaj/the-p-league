import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-schedule-container',
	templateUrl: './schedule-container.component.html',
	styleUrls: ['./schedule-container.component.scss']
})
export class ScheduleContainerComponent {
	constructor(private fb: FormBuilder) {}
}
