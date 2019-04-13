import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-signup-form',
  templateUrl: './team-signup-form.component.html',
  styleUrls: ['./team-signup-form.component.scss']
})
export class TeamSignupFormComponent {
  contactForm = this.fb.group({    
    teamName: this.fb.control(null, Validators.required),
    firstName: this.fb.control(null, Validators.required),
    lastName: this.fb.control(null, Validators.required),
    phoneNumber: this.fb.control(null, [Validators.required, Validators.pattern("[0-9]{0,10}")]),
    email: this.fb.control(null, [Validators.required, Validators.email]),
  });  

  constructor(private fb: FormBuilder, private router: Router) {}

  onSubmit() {
    alert('Thanks!');
  }

  onCancel(){

  }
}
