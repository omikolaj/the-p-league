import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GalleryRoutingModule } from "./gallery-routing.module";
import { GalleryGridListComponent } from "./gallery-grid-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [GalleryGridListComponent],
  imports: [CommonModule, GalleryRoutingModule, SharedModule]
})
export class GalleryModule {}
