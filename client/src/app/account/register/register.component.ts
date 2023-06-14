import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { debounceTime, finalize, map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[] | null = null;
  complexPassword = "(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$";
  loading = false;
  constructor(private accountService: AccountService, private router: Router) { }


  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email], [this.validateEmailNotTaken()]),
      password: new FormControl('', [Validators.required, Validators.pattern(this.complexPassword)]),
    });
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(user => {
      this.router.navigateByUrl('/shop');
    }, error => {
      this.errors = error.errors;
    })
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(() => {
          this.loading = true;
          return this.accountService.checkEmailExists(control.value).pipe(map(result => result ? { emailExists: true } : null),
            finalize(() => {
              control.markAsTouched;
              this.loading = false;
            }))
        })
      )
    }
  }


}
