import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string | undefined;
  password: string | undefined;

  constructor() {}
  signIn() {
    console.log(this.email, this.password);
  }
}
