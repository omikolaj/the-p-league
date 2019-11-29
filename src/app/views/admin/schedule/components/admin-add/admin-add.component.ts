import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SportType } from 'src/app/views/schedule/models/interfaces/sport-type.model';
import { AddFor } from '../../models/add-for.enum';

@Component({
	selector: 'app-admin-add',
	templateUrl: './admin-add.component.html',
	styleUrls: ['./admin-add.component.scss']
})
export class AdminAddComponent implements OnInit {
	@Output() itemAdded = new EventEmitter<FormGroup>();

	description: string;

	title = 'Add';
	addItemForm: FormGroup;

	private _data: SportType;
	get data(): SportType {
		return this._data;
	}
	@Input()
	set data(value: SportType) {
		if (value) {
			this._data = value;
		} else {
			throw Error('You must pass in SportType');
		}
	}

	private _for: AddFor;
	get for(): AddFor {
		return this._for;
	}
	@Input()
	set for(value) {
		this._for = value;
	}

	constructor() {}

	ngOnInit(): void {}

	onAddItem(): void {
		this.itemAdded.emit(this.addItemForm);
	}
}
