import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SharedModule } from '../../shared/shared.module';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';

@NgModule({
  declarations: [    
    ToolbarComponent, SidenavListComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    SharedModule
  ],
  exports:[
    ToolbarComponent, SidenavListComponent, SharedModule
  ]
})
export class NavigationModule { }
