import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import Parallax from "parallax-js";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "app-team-signup-form",
  templateUrl: "./team-signup-form.component.html",
  styleUrls: ["./team-signup-form.component.scss"]
})
export class TeamSignupFormComponent implements OnInit, OnDestroy {
  contactForm = this.fb.group({
    teamName: this.fb.control(null, Validators.required),
    firstName: this.fb.control(null, Validators.required),
    lastName: this.fb.control(null, Validators.required),
    phoneNumber: this.fb.control(null, [
      Validators.required,
      Validators.pattern("[0-9]{0,10}")
    ]),
    email: this.fb.control(null, [Validators.required, Validators.email])
  });
  parallaxInstance: Parallax;
  @ViewChild("contactFormElement") contactFormElement: ElementRef;
  isMobile: boolean;

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit(): void {
    this.epicFunction();
    if (!this.isMobile) {
      var scene = document.getElementById("scene");
      this.parallaxInstance = new Parallax(scene);
    }
  }

  epicFunction() {
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnDestroy() {
    this.parallaxInstance.destroy();
  }

  onArrowClick() {
    const targetELement = this.contactFormElement.nativeElement as HTMLElement;
    targetELement.scrollIntoView({ behavior: "smooth" });
  }

  onSubmit() {
    alert("Thanks!");
  }

  onCancel() {}
}
