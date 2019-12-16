import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminControlComponent } from './components/admin-control/admin-control.component';
import { GalleryGridListComponent } from './gallery-grid-list.component';
import { GalleryRoutingModule } from './gallery-routing.module';

@NgModule({
	declarations: [GalleryGridListComponent, AdminControlComponent],
	imports: [CommonModule, GalleryRoutingModule, SharedModule, CoreModule, FormsModule, DragDropModule]
})
export class GalleryModule {}
