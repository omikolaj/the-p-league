import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { AboutComponent } from "./views/about/about.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "about",
        loadChildren: "./views/about/about.module#AboutModule"
      },
      {
        path: "team-signup",
        loadChildren:
          "./views/about/components/team-signup-form/team-signup-form.module#TeamSignupFormModule"
      },
      {
        path: "merchandise",
        loadChildren: "./views/merchandise/merchandise.module#MerchandiseModule"
      },
      {
        path: "gallery",
        loadChildren: "./views/gallery/gallery.module#GalleryModule"
      },
      {
        path: "admin",
        loadChildren: "./views/admin/admin.module#AdminModule"
      },
      {
        path: "",
        redirectTo: "about",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "**",
    redirectTo: ""
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      enableTracing: false,
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
