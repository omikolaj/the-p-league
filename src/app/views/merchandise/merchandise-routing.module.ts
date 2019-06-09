import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MerchandiseListComponent } from "./merchandise-list/merchandise-list.component";
import { MerchandiseDialogContainerComponent } from "./merchandise-dialog-container/merchandise-dialog-container.component";
import { RolesResolver } from "src/app/core/services/resolvers/roles/roles-resolver.service";
import { MerchandiseService } from "src/app/core/services/merchandise/merchandise.service";

const routes: Routes = [
  {
    path: "",
    component: MerchandiseListComponent,
    data: { animation: "MerchandiseListPage" },
    resolve: { roles: RolesResolver, merchandiseItems: MerchandiseService }
  },
  {
    path: ":id/edit",
    outlet: "modal",
    component: MerchandiseDialogContainerComponent
  },
  {
    path: "new",
    outlet: "modal",
    component: MerchandiseDialogContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchandiseRoutingModule {}
