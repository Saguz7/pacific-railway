import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
//import { SessionStorageService } from '../../core/services/sessionstorage.service';
declare var M: any;
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-password-rename',
  templateUrl: './password-rename.component.html',
  styleUrls: ['./password-rename.component.css'],
})
export class PasswordRenameComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,

  //  private sessionStorageService: SessionStorageService,
   private router?: Router,
   ) {
    this.form = this.formBuilder.group({
      password_new: this.formBuilder.control('' ),
      password: this.formBuilder.control('' )
    });
  }

  ngOnInit(): void {

  }

  submit(event: any) {
  event.preventDefault();

  if (this.form.valid) {
    const password = this.form.value.password;
    const password_new = this.form.value.password_new;

    this.authService.changePassword('cesarsantiagoguzman@gmail.com', password, password_new)
     .then((result) => {
       console.log('Contraseña cambiada exitosamente');
       console.log(result);

       // Realizar cualquier acción adicional después de cambiar la contraseña
     })
     .catch((error) => {
       console.error('Error al cambiar la contraseña', error);
       // Manejar el error adecuadamente en tu aplicación
     });
/*
    this.authService.login(email, password)
      .then(result => {
        // Autenticación exitosa, redirigir al usuario a la página principal o a otra página deseada
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        // Error de autenticación, mostrar mensaje de error o tomar la acción adecuada
        console.error('Error de autenticación:', error);
      });

      */
  }
}

  correctLogin(){
  }



  get getPassword(): FormGroup {
    return this.form.get('password') as FormGroup;
  }


}
