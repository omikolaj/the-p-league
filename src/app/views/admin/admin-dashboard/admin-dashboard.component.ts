import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminControlType } from 'src/app/core/models/admin/dashboard/admin-control-type.enum';
import { AdminControl } from 'src/app/core/models/admin/dashboard/admin-control.model';
import { GenericListItem } from 'src/app/core/models/admin/dashboard/generic-list-item.model';
import { AdminControlComponent } from '../components/admin-control/admin-control.component';

@Component({
	selector: 'app-admin-dashboard',
	templateUrl: './admin-dashboard.component.html',
	styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
	adminControls: Array<AdminControl> = new Array<AdminControl>(
		{ component: AdminControlComponent, name: AdminControlType[AdminControlType.Schedule] },
		{ component: AdminControlComponent, name: AdminControlType[AdminControlType.Gallery] },
		{ component: AdminControlComponent, name: AdminControlType[AdminControlType.Merchandise] },
		{ component: AdminControlComponent, name: AdminControlType[AdminControlType.Scoreboards] }
	);

	constructor(private router: Router, private route: ActivatedRoute) {}

	ngOnInit(): void {}

	openControl(event: GenericListItem): void {
		this.router.navigate([event.name.toLocaleLowerCase()], { relativeTo: this.route.parent });
	}
}
