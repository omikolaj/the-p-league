import { Component, OnInit } from '@angular/core';

import { AdminControlType } from '../models/admin-control-type.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminControlComponent } from './admin-control/admin-control.component';
import { GenericListItem } from 'src/app/shared/models/interfaces/generic-list-item.model';
import { AdminControl } from '../models/interfaces/admin-control.model';

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

  ngOnInit() {}

  openControl(event: GenericListItem) {
    this.router.navigate([event.name.toLocaleLowerCase()], { relativeTo: this.route.parent });
  }
}
