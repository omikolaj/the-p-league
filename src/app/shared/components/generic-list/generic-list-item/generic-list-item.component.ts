import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { GenericListItem } from 'src/app/core/models/admin/dashboard/generic-list-item.model';
import { ListItemComponentDirective } from 'src/app/shared/directives/list-item-component.directive';

@Component({
	selector: 'app-generic-list-item',
	templateUrl: './generic-list-item.component.html',
	styleUrls: ['./generic-list-item.component.scss']
})
export class GenericListItemComponent implements OnInit {
	@Input('generic-item') item: GenericListItem;
	@ViewChild(ListItemComponentDirective, { static: true }) listComponentHost: ListItemComponentDirective;

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

	ngOnInit() {
		this.loadComponent();
	}

	loadComponent() {
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.item.component);

		const viewContainerRef = this.listComponentHost.viewContainerRef;
		viewContainerRef.clear();

		const componentRef = viewContainerRef.createComponent(componentFactory);

		(<GenericListItem>componentRef.instance).name = this.item.name;
	}
}
