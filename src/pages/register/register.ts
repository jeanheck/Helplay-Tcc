import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { IntroPage } from '../intro/intro';
import { RegisterProvider } from '../../providers/register/register';
import { HttpResponse } from '@angular/common/http';
import { LoginProvider } from '../../providers/login/login';
import { AuthorizationProvider } from '../../providers/authorization/authorization';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers:[
    RegisterProvider, LoginProvider, AuthorizationProvider
  ]
})
export class RegisterPage {
  public myModel = ''
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

  nome:string;
  sexo:string;
  celular:string;
  data_nascimento;

  email:string;
  password:string;
  password_confirmation:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingController: LoadingController, private registerProvider: RegisterProvider, private loginProvider: LoginProvider,
    private authorizationProvider:AuthorizationProvider) {
  }

  ionViewDidLoad() {

  }

  registrar(){
    window.localStorage.clear();
    
    //setTimeout(() => {/*Apenas esperar sem fazer nada*/}, 1000);

    this.registrarUser();
  }

  registrarUser(){
    let data_user = {
      "email" : this.email,
      "password" : this.password,
      "password_confirmation": this.password_confirmation
    }

    let loading = this.loadingController.create({});
    loading.present();

    var saveUserDataSuccesfull = false;

    this.registerProvider.registrarUser(data_user).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        saveUserDataSuccesfull = true;

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"),
          data.headers.get("client"),
          data.headers.get("uid")
        );

        if(saveUserDataSuccesfull){
          this.entrar();
        }
      },
      error=>{
        loading.dismiss();
        console.log(error);
      }
    )
  }

  entrar(){
    let loading = this.loadingController.create({});
    loading.present();

    this.loginProvider.getUser(this.email, this.password).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"),
          data.headers.get("client"),
          data.headers.get("uid")
        );

        this.registrarUsuario(data.body.data.id);
      },
      error=>{
        loading.dismiss();
        console.log(error);
      }
    )
  }

  registrarUsuario(user_id){
    let data_usuario = {
      "nome" : this.nome,
      "sexo" : this.sexo,
      "celular": this.celular,
      "user_id": user_id,
      "dataNascimento": this.data_nascimento
    }

    let loading = this.loadingController.create({});
    loading.present();

    this.registerProvider.registrarUsuario(data_usuario).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        //Salva o ID do usuário pra usar em alguns processos do app
        window.localStorage.setItem("usuario_id", data.body.id);

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"),
          data.headers.get("client"),
          data.headers.get("uid")
        );

        this.navCtrl.push(IntroPage);
      },
      error=>{
        loading.dismiss();
        console.log(error);
      }
    )
  }
}
