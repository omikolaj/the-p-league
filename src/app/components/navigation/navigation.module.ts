import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';

@NgModule({
  declarations: [    
    ToolbarComponent, SidenavListComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    AngularMaterialModule
  ],
  exports:[
    ToolbarComponent, SidenavListComponent, AngularMaterialModule
  ]
})
export class NavigationModule { }
