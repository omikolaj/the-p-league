import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SizeEnumToSizePipe } from "./pipes/sizeEnumToSize/size-enum-to-size.pipe";
import { SharedModule } from "../shared/shared.module";
import { ClearElementValueDirective } from "./directives/clear-element-value/clear-element-value.directive";

@NgModule({
  declarations: [SizeEnumToSizePipe, ClearElementValueDirective],
  imports: [CommonModule, SharedModule],
  exports: [SizeEnumToSizePipe, ClearElementValueDirective]
})
export class CoreModule {}
