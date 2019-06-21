import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GalleryGridListComponent } from "./gallery-grid-list.component";
import { RolesResolver } from "src/app/core/services/resolvers/roles/roles-resolver.service";
import { GalleryService } from "src/app/core/services/gallery/gallery.service";

const routes: Routes = [
  {
    path: "",
    component: GalleryGridListComponent,
    data: { animation: "GalleryGridListPage" },
    resolve: { roles: RolesResolver, leaguePictures: GalleryService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule {}
