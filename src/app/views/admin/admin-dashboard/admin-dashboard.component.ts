import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericListItem } from 'src/app/shared/models/interfaces/generic-list-item.model';
import { AdminControlType } from '../models/admin-control-type.enum';
import { AdminControl } from '../models/interfaces/admin-control.model';
import { AdminControlComponent } from './admin-control/admin-control.component';

@Component({
	selector: 'app-admin-dashboard',
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
	adminControls: Array<AdminControl> = new Array<AdminControl>(
		{ component: AdminControlComponent, name: AdminControlType[AdminControlType.Schedule] },
		{ component: AdminControlComponent, name: AdminControlType[AdminControlType.Gallery] },
		{ component: AdminControlComponent, name: AdminControlType[AdminControlType.Merchandise] }
	);

	constructor(private router: Router, private route: ActivatedRoute) {}

	ngOnInit(): void {}

	openControl(event: GenericListItem): void {
		this.router.navigate([event.name.toLocaleLowerCase()], { relativeTo: this.route.parent });
	}
}
