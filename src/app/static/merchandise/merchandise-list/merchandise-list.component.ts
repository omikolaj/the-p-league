import { Component, OnInit } from '@angular/core';
import { GearItem } from 'src/app/core/models/gear-item.model';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { Observable } from 'rxjs';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/core/animations/route.animations';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-merchandise-list',
  templateUrl: './merchandise-list.component.html',
  styleUrls: ['./merchandise-list.component.scss']
})
export class MerchandiseListComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  gearItems: GearItem[] = [];
  pagedGearItems: GearItem[] = [];

  breakpoint: number = 3;
  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6, 12, 18, 25];  
  pageEvent: PageEvent;

  constructor(
    private merchandiseService: MerchandiseService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {    
    this.merchandiseService.fetchAllGearItems().subscribe(
      (gearItems: GearItem[]) => this.gearItems = gearItems);
      
    this.breakpoint = (window.innerWidth <= 800) ? 1 : 3;
    this.pagedGearItems = this.gearItems.slice(0, this.pageSize);
    this.length = this.gearItems.length;
  }

  onAddGearItems(){
    this.router.navigate([{ outlets: { modal: ['new'] } }], { relativeTo: this.route });
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedGearItems = this.gearItems.slice(startIndex, endIndex);
  }

  onResize(event) { //to adjust to screen size
    this.breakpoint = (event.target.innerWidth <= 800) ? 1 : 3;
  }

}
