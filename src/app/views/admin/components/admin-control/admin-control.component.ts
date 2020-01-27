import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminControl } from './../../../../core/models/admin/dashboard/admin-control.model';

@Component({
	selector: 'app-admin-control',
	templateUrl: './admin-control.component.html',
	styleUrls: ['./admin-control.component.scss']
})
export class AdminControlComponent implements OnInit {
	@Input() control: AdminControl;
	@Output() controlClicked: EventEmitter<AdminControl> = new EventEmitter<AdminControl>();
	constructor() {}

	ngOnInit() {}

	onControlSelected(): void {
		this.controlClicked.emit(this.control);
	}
}
