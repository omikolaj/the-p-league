import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorStateMatcher, MatChipInputEvent } from '@angular/material';
import { MatchDay } from 'src/app/views/schedule/models/match-days.enum';

@Component({
	selector: 'app-new-session-schedule',
	templateUrl: './new-session-schedule.component.html',
	styleUrls: ['./new-session-schedule.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewLeagueSessionScheduleComponent implements OnInit {
	@Input() sessionForm: FormGroup;
	@Input() requireTime: ErrorStateMatcher;
	@Output() gamesDayAdded: EventEmitter<void> = new EventEmitter<void>();
	@Output() gamesDayRemved: EventEmitter<number> = new EventEmitter<number>();
	@Output() gamesTimeAdded: EventEmitter<{ gamesDayIndex: number; time: string }> = new EventEmitter<{ gamesDayIndex: number; time: string }>();
	@Output() gamesTimeRemoved: EventEmitter<{ gamesDayIndex: number; gamesTimeIndex: number }> = new EventEmitter<{
		gamesDayIndex: number;
		gamesTimeIndex: number;
	}>();
	matchDays = MatchDay;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	constructor() {}

	ngOnInit(): void {}

	/**
	 * @description Determines if the 'Add Day' button should be disabled/enabled
	 * If user has not picked a game day, they should not be able to select 'Add Day'
	 * @returns true if game day selected
	 */
	isGameDaySelected(): boolean {
		let isGameDaySelected = false;
		for (let index = 0; index < this.sessionForm.value.gamesDays.length; index++) {
			const gamesDayControl = this.sessionForm.value.gamesDays[index];
			if (gamesDayControl.gamesDay) {
				isGameDaySelected = true;
			} else {
				isGameDaySelected = false;
			}
		}		
		return isGameDaySelected;
	}

	addGamesDay(currentGameDayIndex: number): void {
		console.log('logging currentGameDayIndex', currentGameDayIndex);
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
