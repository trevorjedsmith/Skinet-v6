import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { IUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.accountService.login(this.loginForm.value).subscribe(user => {
      console.log(user);
    })
  }

}
