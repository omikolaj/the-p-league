import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';

@Component({
	selector: 'app-new-session-schedule',
	templateUrl: './new-session-schedule.component.html',
	styleUrls: ['./new-session-schedule.component.scss']
})
export class NewSessionScheduleComponent implements OnInit {
	@Input() sessionForm: FormGroup;
	@Output() gamesDayAdded: EventEmitter<void> = new EventEmitter<void>();
	@Output() gamesTimeAdded: EventEmitter<{ gamesDayIndex: number; time: string }> = new EventEmitter<{ gamesDayIndex: number; time: string }>();
	@Output() gamesTimeRemoved: EventEmitter<{ gamesDayIndex: number; gamesTimeIndex: number }> = new EventEmitter<{
		gamesDayIndex: number;
		gamesTimeIndex: number;
	}>();
	matchDays = MatchDay;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

	constructor() {}

	ngOnInit(): void {}

	onSubmit(): void {
		console.log('session form', this.sessionForm);
	}

	addGamesDay(): void {
		this.gamesDayAdded.emit();
	}

	addGameTime(event: MatChipInputEvent, gamesDayIndex: number): void {
		const input = event.input;
		const value = event.value;

		if ((value || '').trim()) {
			this.gamesTimeAdded.emit({ gamesDayIndex: gamesDayIndex, time: value });
		}
		if (input) {
			input.value = '';
		}
	}

	removeGameTime(gamesDayIndex: number, gamesTimeIndex: number): void {
		this.gamesTimeRemoved.emit({ gamesDayIndex: gamesDayIndex, gamesTimeIndex: gamesTimeIndex });
	}
}
