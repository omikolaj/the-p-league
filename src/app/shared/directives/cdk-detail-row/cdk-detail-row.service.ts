import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { CdkDetailRowDirective } from './cdk-detail-row.directive';

@Injectable({
	providedIn: 'root'
})
export class CdkDetailRowService {
	private previousVcRef: ViewContainerRef;
	private previousOpened: boolean;
	private previousDirectiveRef: CdkDetailRowDirective;
	constructor() {}

	/**
	 * @description Collapse expanded row. It checks to see if the currently clicked
	 * row view container matches, the one that was set in the previous click event,
	 * if it matches it collapses the currently clicked row, if it doesnt, it will collapse
	 * previously clicked row
	 * @param vcRef
	 */
	private collapseExpandedRow(vcRef: ViewContainerRef): void {
		// check if this row is the same as previous
		if (this.previousVcRef && this.previousVcRef === vcRef) {
			// vcRef referes to the currently clicked row
			// this execution path indicates user clicked on the same row
			vcRef.clear();
		}
		// if this is a different row then collapse previously expanded row
		else {
			this.previousVcRef.clear();
			this.previousDirectiveRef.opened = false;
		}
	}

	/**
	 * @description Toggles row clicked by the user
	 * @param vcRef viewContainerRef for clicked row
	 * @param tRef TemplateRef for clicked row
	 * @param row The clicked row object
	 * @param opened Row property, indicating if its opened
	 * @param dRef CdKDetailRowDirective reference. This property is used to set the 'opened' property
	 * @returns the value for the opened property for currently clicked row
	 */
	toggleRow(vcRef: ViewContainerRef, tRef: TemplateRef<any>, row: any, opened: boolean, dRef: CdkDetailRowDirective): boolean {
		if (opened) {
			vcRef.clear();
		} else {
			this.render(vcRef, tRef, row);
		}

		// check if user has a previously expanded row
		if (this.previousOpened) {
			// collapse the expanded row
			this.collapseExpandedRow(vcRef);
		}

		this.previousVcRef = vcRef;
		this.previousDirectiveRef = dRef;
		return (this.previousOpened = vcRef.length > 0);
	}

	/**
	 * @description Creates the view for the expanded row
	 * @param vcRef ViewContainerRef for clicked row
	 * @param tRef TemplateRef for clicked row
	 * @param row currently clicked row
	 */
	private render(vcRef: ViewContainerRef, tRef: TemplateRef<any>, row: any): void {
		vcRef.clear();
		if (tRef && row) {
			vcRef.createEmbeddedView(tRef, { $implicit: row });
		}
	}
}
