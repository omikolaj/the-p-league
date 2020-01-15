import { Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
	selector: '[appCdkDetailRow]'
})
export class CdkDetailRowDirective {
	private row: any;
	private tRef: TemplateRef<any>;
	private opened: boolean;
	private isAdmin: boolean;

	@HostBinding('class.expanded')
	get expended(): boolean {
		return this.opened;
	}

	@Input()
	set appCdkDetailRow(value: any) {
		if (value !== this.row) {
			this.row = value;
			// this.render();
		}
	}

	@Input('appCdkDetailRowTpl')
	set template(value: TemplateRef<any>) {
		if (value !== this.tRef) {
			this.tRef = value;
			// this.render();
		}
	}

	@Input() set expand(value: any) {
		if (value !== null) {
			this.toggle();
		}
	}

	@Input() set admin(value: boolean) {
		if (typeof value === 'boolean') {
			this.isAdmin = value;
		} else {
			this.isAdmin = false;
		}
	}

	constructor(public vcRef: ViewContainerRef) {}

	@HostListener('click')
	onClick(): void {
		if (this.isAdmin) {
			this.toggle();
		}
	}

	toggle(): void {
		if (this.opened) {
			this.vcRef.clear();
		} else {
			this.render();
		}
		this.opened = this.vcRef.length > 0;
	}

	private render(): void {
		this.vcRef.clear();
		if (this.tRef && this.row) {
			this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row });
		}
	}
}
