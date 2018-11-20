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
export class RegisterProvider {
  constructor(public http: HttpClient, private authorizationProvider:AuthorizationProvider) {

  }
  
  registrarUser(data) {
    let headers = {
      'Content-Type': 'application/json'
    }

    let user_data = {
      'email': data.email,
      'password': data.password,
      'password_confirmation': data.password_confirmation
    }

    return this.http.post(
      this.authorizationProvider.basepath + "auth", 
      user_data, 
      {
        headers: headers, 
        observe: 'response'
      }
    );
  }

  registrarUsuario(data) {
    let usuario_data = {
      'nome': data.nome,
      'dataNascimento': data.dataNascimento,
      'sexo': data.sexo,
      'user_id': data.user_id,
      'celular': data.celular
    }

    return this.http.post(
      this.authorizationProvider.basepath + "usuarios", 
      usuario_data, 
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }
}
