import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminLoginComponent } from "./admin-login/admin-login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [AdminLoginComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, AdminRoutingModule]
})
export class AdminModule {}
