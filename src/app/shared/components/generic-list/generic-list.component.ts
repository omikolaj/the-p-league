import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericListItem } from 'src/app/core/models/admin/dashboard/generic-list-item.model';

@Component({
	selector: 'app-generic-list',
	templateUrl: './generic-list.component.html',
	styleUrls: ['./generic-list.component.scss']
})
export class GenericListComponent implements OnInit {
	@Input() list: Array<GenericListItem>;
	@Output() itemSelected: EventEmitter<GenericListItem> = new EventEmitter<GenericListItem>();

	constructor() {}

	ngOnInit() {
		this.list.forEach((i) => console.log(i.name));
	}

	onItemSelected(item: GenericListItem) {
		// open the corresponding
		this.itemSelected.emit(item);
	}
}
