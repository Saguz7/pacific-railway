import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
//import { SessionStorageService } from '../../core/services/sessionstorage.service';
declare var M: any;
import { AuthService } from '../services/auth.service';
import AWS from 'aws-sdk';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
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
    private authService: AuthService,
    private http: HttpClient,

  //  private sessionStorageService: SessionStorageService,
   private router?: Router,
   ) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('',  [Validators.required]),
      password: this.formBuilder.control('', {
        validators: [Validators.required]
      })
    });
  }

  ngOnInit(): void {
     this.verificarSesion();
  }

  verificarSesion(): void {
      const poolData = {
        UserPoolId: 'us-west-2_YKTiEMjtU',
        ClientId: '78fqe248a2ghet7oi0v94hbtnp'
      };
  
      const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser != null) {
        cognitoUser.getSession((error: any, session: any) => {
          if (error) {
            console.log('No hay sesión activa en Cognito');
          } else {
            console.log('Sesión activa en Cognito');
            console.log('Token de acceso:', session.getAccessToken().getJwtToken());
          }
        });
      } else {
        console.log('No hay sesión activa en Cognito');
      }
    }

  serialize(obj: any): string {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p) && obj[p]) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }
  return str.join('&');
}

  submit(event: any) {

    const tokenEndpoint = 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/token';
    const clientId = '78fqe248a2ghet7oi0v94hbtnp';
    const code = '44374716-5a89-4095-8fd3-1ccb73e705e8';

    const requestBody = {
      grant_type: 'authorization_code',
      client_id: clientId,
      code: code,
      redirect_uri: 'https://dev.d1klk34joigd80.amplifyapp.com/current-chassis-location'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post(tokenEndpoint, this.serialize(requestBody), { headers: headers })
      .subscribe((response) => {
        console.log(response);
        // Procesar los tokens de respuesta y establecer la sesión del usuario
      }, (error) => {
        console.error(error);
        // Manejar el error de solicitud de token
      });

    /*
  event.preventDefault();

  if (this.form.valid) {
    const email = this.form.value.email;
    const password = this.form.value.password;

    this.authService.login(email, password)
      .then(result => {
        // Autenticación exitosa, redirigir al usuario a la página principal o a otra página deseada
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        // Error de autenticación, mostrar mensaje de error o tomar la acción adecuada
        console.error('Error de autenticación:', error);
      });
  }

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
