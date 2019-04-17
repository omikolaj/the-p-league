import { Component, OnInit, Input } from '@angular/core';
import { GearItem } from 'src/app/core/models/gear-item.model';

@Component({
  selector: 'app-merchandise-item',
  templateUrl: './merchandise-item.component.html',
  styleUrls: ['./merchandise-item.component.scss']
})
export class MerchandiseItemComponent implements OnInit {
  @Input() gearItem: GearItem;
  defaultImgURL: string = "../../../../assets/default_gear.png"
  constructor() { }

  ngOnInit() {
  }

}
