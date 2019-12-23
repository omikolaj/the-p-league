import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
	declarations: [ToolbarComponent, SidenavListComponent],
	imports: [CommonModule, LayoutModule, SharedModule, RouterModule],
	exports: [ToolbarComponent, SidenavListComponent, SharedModule]
})
export class NavigationModule {}
