import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationProvider } from '../authorization/authorization';

@Component({
  providers:[
    AuthorizationProvider
  ]
})

@Injectable()
export class LoginProvider {
  constructor(public http: HttpClient, public authorizationProvider: AuthorizationProvider) {

  }

  getUser(email, password) {
    return this.http.post(
      this.authorizationProvider.basepath + "auth/sign_in",
      JSON.stringify({email: email, password: password}), 
      { headers: {'Content-Type': 'application/json'}, observe: 'response' }
    );
  }

  getUsuario(user_id) {
    return this.http.get(
      this.authorizationProvider.basepath + "usuarios/" + user_id,
      { headers: this.authorizationProvider.basic_header(), observe: 'response' }
    );
  }
}
