import { Directive, EventEmitter, HostBinding, HostListener, Input, Optional, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import Match from 'src/app/core/models/schedule/classes/match.model';
import { CdkDetailRowService } from './cdk-detail-row.service';

@Directive({
	selector: '[appCdkDetailRow]'
})
export class CdkDetailRowDirective {

	/**
	 * @description this will add the 'expanded' class to the host element
	 * if this.opened is true, otherwise it will return false
	 * and not add the 'expanded' class
	 */
	@HostBinding('class.expanded')
	get expended(): boolean {
		return this.opened;
	}

	/**
	 * @description Hosts listener for click event of row
	 */
	@HostListener('click')
	onClick(): void {
		if (this.isAdmin) {
			this.toggle();
			this.rowClicked.emit({ status: this.opened ? 'expanded' : 'collapsed', match: this.row });
		}
	}

	/**
	 * @description Sets the row value
	 */
	@Input()
	set appCdkDetailRow(value: any) {
		if (value !== this.row) {
			this.row = value;
		}
	}

	/**
	 * @description Sets TemplateRef property of the row
	 */
	@Input('appCdkDetailRowTpl')
	set template(value: TemplateRef<any>) {
		if (value !== this.tRef) {
			this.tRef = value;
		}
	}

	/**
	 * @description Triggers the toggle method for the passed in
	 * row
	 */
	@Input() set expand(value: any) {
		if (value !== null) {
			this.toggle();
		}
	}

	/**
	 * @description Sets admin input property, if passed in value
	 * is not a boolean, set it to false
	 */
	@Input('appCdKAdmin') set admin(value: boolean) {
		if (typeof value === 'boolean') {
			this.isAdmin = value;
		} else {
			this.isAdmin = false;
		}
	}

	@Output() rowClicked: EventEmitter<{ status: 'expanded' | 'collapsed'; match: Match }> = new EventEmitter<{
		status: 'expanded' | 'collapsed';
		match: Match;
	}>();

	/**
	 * @description opened property has to be public. CdKDetailRowService uses it
	 */
	opened: boolean;

	/**
	 * @description Row of cdk detail row directive
	 */
	private row: any;

	/**
	 * @description TemplateRef of cdk detail row directive
	 */
	private tRef: TemplateRef<any>;

	/**
	 * @description isAdmin property determines if this directive should be enabled for togglig table rows
	 */
	private isAdmin: boolean;

	constructor(public vcRef: ViewContainerRef, @Optional() private detailRowService: CdkDetailRowService) {}

	/**
	 * @description Toggles the expansion of a row
	 */
	private toggle(): void {
		// we are passing 'this' as the fourth parameter because when user clicks on a row
		// we need to be able to not only collapse that row but set its state of opened to false
		this.opened = this.detailRowService.toggleRow(this.vcRef, this.tRef, this.row, this.opened, this);
	}
}
