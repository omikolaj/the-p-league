import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MerchandiseListComponent } from "./merchandise-list/merchandise-list.component";
import { MerchandiseDialogContainerComponent } from "./merchandise-dialog-container/merchandise-dialog-container.component";

const routes: Routes = [
  {
    path: "",
    component: MerchandiseListComponent,
    data: { animation: "MerchandiseListPage" }
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
