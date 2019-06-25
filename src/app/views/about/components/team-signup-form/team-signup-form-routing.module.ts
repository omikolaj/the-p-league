import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TeamSignupFormComponent } from "./team-signup-form.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "signup",
        component: TeamSignupFormComponent,
        data: { animation: "TeamSignUpPage" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamSignupFormRoutingModule {}
