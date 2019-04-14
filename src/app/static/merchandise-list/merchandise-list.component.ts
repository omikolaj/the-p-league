import { Component, OnInit } from '@angular/core';
import { GearItem } from 'src/app/core/models/gear-item..model';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { Observable } from 'rxjs';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/core/animations/route.animations';

@Component({
  selector: 'app-merchandise-list',
  templateUrl: './merchandise-list.component.html',
  styleUrls: ['./merchandise-list.component.scss']
})
export class MerchandiseListComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  gearItems$: Observable<GearItem[]>;

  constructor(private merchandiseService: MerchandiseService) { }

  ngOnInit() {
    this.gearItems$ = this.merchandiseService.fetchAllGearItems();
  }

}
