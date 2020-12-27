import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  isLoading = false;
  public birthday: string;
  public gender = '';
  constructor(public authService: AuthService) {}

  onSignUp(form: NgForm) {
    this.birthday = form.value.birthday;
    const x = this.birthday.toString().split('-');
    const d1 = new Date();
    const d2 = new Date(+x[0], (+x[1]) - 1, +x[2]);
    if (form.invalid || d1 < d2) {
      return;
    }
    this.isLoading = true;
    this.authService.registerUser(form.value.email, form.value.password, form.value.firstName, form.value.lastName, d2, this.gender);
  }


}
