import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { GenericListItem } from '../../models/interfaces/generic-list-item.model';

@Component({
  selector: 'app-generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.scss']
})
export class GenericListComponent<T extends GenericListItem> implements OnInit {
  @Input() list: Array<T>;
  @Output() itemSelected: EventEmitter<T> = new EventEmitter<T>();

  constructor() { }

  ngOnInit() {  
    this.list.forEach(i => console.log(i.name))  
  }

  onItemSelected(item: T){
    // open the corresponding 
    this.itemSelected.emit(item);
  }

}
