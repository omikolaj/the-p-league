import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { TeamSwapService } from './team-swap.service';

@Directive({
	selector: '[appTeamSwap]'
})
export class TeamSwapDirective {
	@Input() appTeamSwap: Match;
	@HostListener('click', ['$event']) onClick(event: any) {
		this.highlightCell(event);
	}

	constructor(private el: ElementRef, private renderer: Renderer2, private teamSwapService: TeamSwapService) {}

	private highlightCell(event: any): void {
		// get the list of children from the row. This will include mat-cell element
		// for every column in the row. Currentl this will have 3. mat-call for home,
		// mat-cell for away, and mat-call for date
		const rowChildElements = this.el.nativeElement.children as HTMLCollection;
		// iterate over all mat-cell elements and find out which one user clicked on
		for (let index = 0; index < rowChildElements.length; index++) {
			// cast the row element to type 'unknown'
			const rowElement = rowChildElements[index] as any;
			if (rowElement.innerText === event.srcElement.innerText) {
				// check to see if style exists on the element. We have to pass rowElementAsRef
				// because otherwise rowElement.nativeElement is undefined and we cannot inspect values
				if (!this.styleExists(rowElement, this.teamSwapService.backgroundColor, this.teamSwapService.highlightedColor)) {
					if (this.teamSwapService.colorPairNumber < 2) {
						this.teamSwapService.setStyle(rowElement, this.renderer);
					} else {
						this.teamSwapService.setStyleWithNewColor(rowElement, this.renderer);
					}
				} else {
					// remove the highlight
					this.teamSwapService.removeStyle(rowElement, this.renderer);
				}
			}
		}
	}

	private styleExists(el: any, property: string, value: string): boolean {
		return el.style[property] === value;
	}
}
