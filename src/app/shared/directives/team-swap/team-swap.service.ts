import { Injectable, Renderer2 } from '@angular/core';
import { ScheduleAdministrationFacade } from 'src/app/core/services/schedule/schedule-administration/schedule-administration-facade.service';

@Injectable({
	providedIn: 'root'
})
export class TeamSwapService {
	private _colorPairNumber = 0;
	get colorPairNumber() {
		return this._colorPairNumber;
	}
	set colorPairNumber(value: number) {
		if (value === 1) {
			// dispatch action to store to store the state of teams we want to swap
		}
		this._colorPairNumber = value;
	}
	highlightedColor = '#663399';
	readonly backgroundColor = 'backgroundColor';
	teamsToSwap = [];

	constructor(private scheduleAdminFacade: ScheduleAdministrationFacade) {}

	swapTeams(originalTeam: string, newTeam: string, match: Match): void {}

	removeStyle(el: any, renderer: Renderer2): void {
		this.colorPairNumber--;
		renderer.removeStyle(el, this.backgroundColor);
	}

	setStyle(el: any, renderer: Renderer2): void {
		this.colorPairNumber++;
		renderer.setStyle(el, this.backgroundColor, this.highlightedColor);
	}

	setStyleWithNewColor(el: any, renderer: Renderer2): void {
		this.colorPairNumber = 0;
		this.highlightedColor = this.getNewColor();
		// use renderer to style the element
		this.setStyle(el, renderer);
	}

	private getNewColor(): string {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
}
