// import { NgModule } from "@angular/core";
// import { Routes, RouterModule } from "@angular/router";
// import { AboutComponent } from "../views/about/about.component";
// import { GalleryGridListComponent } from "./gallery/gallery-grid-list.component";
// import { MerchandiseListComponent } from "./merchandise/merchandise-list/merchandise-list.component";
// import { MerchandiseDialogContainerComponent } from "./merchandise/merchandise-dialog-container/merchandise-dialog-container.component";
// import { TeamSignupFormComponent } from "../views/about/components/team-signup-form/team-signup-form.component";

// const routes: Routes = [
//   {
//     path: "about",
//     component: AboutComponent,
//     data: { animation: "AboutPage" }
//   },
//   {
//     path: "team-signup",
//     component: TeamSignupFormComponent,
//     data: { animation: "TeamSignUpPage" }
//   },
//   {
//     path: "merchandise",
//     children: [
//       {
//         path: "",
//         component: MerchandiseListComponent,
//         data: { animation: "MerchandiseListPage" }
//       },
//       {
//         path: "new",
//         component: MerchandiseDialogContainerComponent,
//         outlet: "modal"
//       },
//       {
//         path: ":id/edit",
//         component: MerchandiseDialogContainerComponent,
//         outlet: "modal"
//       }
//     ]
//   },
//   {
//     path: "gallery",
//     component: GalleryGridListComponent,
//     data: { animation: "GalleryGridListPage" }
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class StaticRoutingModule {}
