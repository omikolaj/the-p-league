import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GalleryGridListComponent } from "./gallery-grid-list.component";
import { RolesResolver } from "src/app/core/services/resolvers/roles/roles-resolver.service";

const routes: Routes = [
  {
    path: "",
    component: GalleryGridListComponent,
    data: { animation: "GalleryGridListPage" },
    resolve: { roles: RolesResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule {}
