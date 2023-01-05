import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
//import { SessionStorageService } from '../../core/services/sessionstorage.service';
declare var M: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
  //  private sessionStorageService: SessionStorageService,
   private router?: Router,

  ) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('',  [Validators.required]),
      password: this.formBuilder.control('', {
        validators: [Validators.required]
      })
    });
    /*
    socketService.outEven.subscribe(res => {
         console.log('Hola Mundo');
    })
    */
        //this.mockedUser();
  }

  ngOnInit(): void {

  }

  submit(event: any) {
    /*
    this.service.autenticacion({
      email: this.getEmail ?.value,
      password: this.getPassword ?.value,
    }).subscribe({
      next: () => { },
      error: (error) => {
        M.toast({html: '<i class="material-icons left">info</i> Access Denied!'})

      },
      complete: () => {
        this.correctLogin();
      }
    });
    */
  }

  correctLogin(){
  }


  get getEmail(): FormGroup {
    return this.form.get('email')  as FormGroup;
  }

  get getPassword(): FormGroup {
    return this.form.get('password') as FormGroup;
  }


}
