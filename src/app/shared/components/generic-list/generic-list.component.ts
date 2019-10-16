import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GenericListItem } from '../../models/interfaces/generic-list-item.model';

@Component({
  selector: 'app-generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.scss']
})
export class GenericListComponent implements OnInit {
  @Input() list: Array<GenericListItem>;
  @Output() itemSelected: EventEmitter<GenericListItem> = new EventEmitter<GenericListItem>();

  constructor() { }

  ngOnInit() {  
    this.list.forEach(i => console.log(i.name))      
  }

  onItemSelected(item: GenericListItem){
    // open the corresponding 
    this.itemSelected.emit(item);
  }

}
