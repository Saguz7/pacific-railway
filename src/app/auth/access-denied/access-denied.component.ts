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
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css'],
})
export class AccessDeniedComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,

  //  private sessionStorageService: SessionStorageService,
   private router?: Router,
   ) {
  }

  ngOnInit(): void {
  }

  gotoLogin(){
    const externalUrl = 'https://cpkc-chassis-management-dev.auth.us-west-2.amazoncognito.com/oauth2/authorize?client_id=78fqe248a2ghet7oi0v94hbtnp&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d1klk34joigd80.amplifyapp.com%2Fcurrent-chassis-location';
    window.location.href = externalUrl;
  }



}
