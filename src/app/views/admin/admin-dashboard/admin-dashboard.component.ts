import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import AdminControl from '../models/classes/admin-control.model';
import { AdminControlType } from '../models/admin-control-type.enum';
import { GenericListItem } from 'src/app/shared/models/interfaces/generic-list-item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  adminControls: Array<AdminControl> = new Array<AdminControl>(new AdminControl(AdminControlType.Schedule), new AdminControl(AdminControlType.Gallery), new AdminControl(AdminControlType.Merchandise))
  constructor(private router: Router) { }

  ngOnInit() {
  }

  openControl(event: GenericListItem){
    console.log("From AdminControl, event: ", event)
    // navigate to admin/merchandise || admin/gallery || admin/schedule
    this.router.navigate([event.name]);
  }

}
