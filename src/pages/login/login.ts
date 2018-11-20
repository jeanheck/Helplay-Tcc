import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { LoginProvider } from '../../providers/login/login';
import { TabsPage } from '../tabs/tabs';
import { HttpResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AuthorizationProvider } from '../../providers/authorization/authorization';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[
    LoginProvider,
    AuthorizationProvider
  ]
})
export class LoginPage {
  email:string;
  password:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loginProvider: LoginProvider,
    public loadingController: LoadingController,
    public authorizationProvider: AuthorizationProvider,
    private storage: Storage
  ) {
  }

  ionViewDidLoad() {

  }

  entrar(){
    window.localStorage.clear();

    this.logar();
  }

  logar(){
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

        this.obterUsuarioId(data.body.data.id);
      },
      error=>{
        loading.dismiss();
        console.log(error);
        document.getElementById("login_erro").innerHTML = "Email/Senha incorretos!";
      }
    )
  }

  obterUsuarioId(user_id){
    let loading = this.loadingController.create({});
    loading.present();

    this.loginProvider.getUsuario(user_id).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        //Salva o ID do usuário pra usar em alguns processos do app
        window.localStorage.setItem("usuario_id", data.body.id);

        this.navCtrl.push(TabsPage);
      },
      error=>{
        loading.dismiss();
        console.log(error);
        document.getElementById("login_erro").innerHTML = "Email/Senha incorretos!";
      }
    )

  }

  goNovoUsuario(){
    this.navCtrl.push(RegisterPage);
  }
}
