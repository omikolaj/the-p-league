import { Component, OnInit, Input } from '@angular/core';
import { GearItem } from 'src/app/core/models/gear-item.model';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchandiseService } from 'src/app/core/services/merchandise/merchandise.service';
import { Size } from 'src/app/core/models/gear-size.model';

@Component({
  selector: 'app-merchandise-item',
  templateUrl: './merchandise-item.component.html',
  styleUrls: ['./merchandise-item.component.scss']
})
export class MerchandiseItemComponent implements OnInit {
  @Input() gearItem: GearItem;
  defaultImgURL: string = "../../../../assets/default_gear.png"
  sizes = Size;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private merchandiseService: MerchandiseService 
  ) { }

  ngOnInit() {
  }

  onEditGearItem(){
    this.router.navigate([{ outlets: { modal: [this.gearItem.ID, 'edit'] } }], { relativeTo: this.route })
  }

  onDeleteGearItem(){
    this.merchandiseService.deleteGearItem(this.gearItem.ID);
  }

}
