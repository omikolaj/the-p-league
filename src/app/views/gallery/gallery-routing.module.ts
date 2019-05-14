import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GalleryGridListComponent } from "./gallery-grid-list.component";

const routes: Routes = [
  {
    path: "",
    component: GalleryGridListComponent,
    data: { animation: "GalleryGridListPage" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule {}
