import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { ListItemComponentDirective } from 'src/app/shared/directives/list-item-component.directive';
import { GenericListItem } from 'src/app/shared/models/interfaces/generic-list-item.model';

// @Component({
//   selector: 'app-generic-list-item',
//   templateUrl: './generic-list-item.component.html',
//   styleUrls: ['./generic-list-item.component.scss']
// })
// export class GenericListItemComponent<T extends GenericListItem> implements OnInit {
//   @Input('generic-item') item: T;

//   @ViewChild(ListItemComponentDirective, { static: true }) listComponentHost: ListItemComponentDirective;  

//   constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

//   ngOnInit() {
//     this.loadComponent();
//   }

//   loadComponent(){    
//     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.item.component);

//     const viewContainerRef = this.listComponentHost.viewContainerRef;    
//     viewContainerRef.clear();

//     const componentRef = viewContainerRef.createComponent(componentFactory);
    
//     (<GenericListItem>componentRef.instance).name = this.item.name;    
//   }

// }

@Component({
  selector: 'app-generic-list-item',
  templateUrl: './generic-list-item.component.html',
  styleUrls: ['./generic-list-item.component.scss']
})
export class GenericListItemComponent implements OnInit {
  @Input('generic-item') item: GenericListItem;
  @ViewChild(ListItemComponentDirective, { static: true }) listComponentHost: ListItemComponentDirective;  

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent(){    
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.item.component);

    const viewContainerRef = this.listComponentHost.viewContainerRef;    
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    
    (<GenericListItem>componentRef.instance).name = this.item.name;    
  }

}
