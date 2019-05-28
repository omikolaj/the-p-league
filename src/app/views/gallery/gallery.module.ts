import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GalleryRoutingModule } from "./gallery-routing.module";
import { GalleryGridListComponent } from "./gallery-grid-list.component";
import { SharedModule } from "src/app/shared/shared.module";
import { AdminControlComponent } from "./components/admin-control/admin-control.component";
import { FormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ClearElementValueDirective } from "src/app/core/directives/clear-element-value/clear-element-value.directive";
import { CoreModule } from "src/app/core/core.module";
import { SnackBarComponent } from "src/app/shared/components/snack-bar/snack-bar.component";

@NgModule({
  declarations: [GalleryGridListComponent, AdminControlComponent],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    SharedModule,
    CoreModule,
    FormsModule,
    DragDropModule
  ]
})
export class GalleryModule {}
