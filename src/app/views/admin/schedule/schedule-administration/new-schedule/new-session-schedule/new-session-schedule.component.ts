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
	@Output() gamesDayRemved: EventEmitter<number> = new EventEmitter<number>();
	@Output() gamesTimeAdded: EventEmitter<{ gamesDayIndex: number; time: string }> = new EventEmitter<{ gamesDayIndex: number; time: string }>();
	@Output() gamesTimeRemoved: EventEmitter<{ gamesDayIndex: number; gamesTimeIndex: number }> = new EventEmitter<{
		gamesDayIndex: number;
		gamesTimeIndex: number;
	}>();
	@Output() newSessionGenerated: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
	matchDays = MatchDay;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

	constructor() {}

	ngOnInit(): void {
		for (let index = 0; index < this.sessionForm['controls'].gamesDays['controls'].length; index++) {
			const gamesDay = this.sessionForm['controls'].gamesDays['controls'][index];
			console.log('gamesDay', gamesDay);
			const gamesTimes = gamesDay['controls'].gamesTimes.value;
			console.log('gamesTimes', gamesTimes);
			for (let index = 0; index < gamesTimes.length; index++) {
				const element = gamesTimes[index];
				console.log('gamesTime', element);
			}
		}
	}

	onSubmit(): void {
		this.newSessionGenerated.emit(this.sessionForm);
	}

	addGamesDay(): void {
		this.gamesDayAdded.emit();
	}

	removeGamesDay(gamesDayIndex: number): void {
		this.gamesDayRemved.emit(gamesDayIndex);
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
