import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { HttpResponse } from '@angular/common/http';
import { VisualizarPerfilPage } from '../visualizar-perfil/visualizar-perfil';

/**
 * Generated class for the ProcurarUsuariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-procurar-usuarios',
  templateUrl: 'procurar-usuarios.html',
})
export class ProcurarUsuariosPage {
  public amigos = [];
  public usuarios;
  public usuario;
  public nenhum_usuario_cadastrado;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private helplayProvider: HelplayProvider,
    private authorizationProvider: AuthorizationProvider,
    public loadingController: LoadingController
  ) {
  }

  ionViewDidLoad() {
    
  }

  ionViewDidEnter() {
    this.getAmigos();
  }

  getAmigos(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getAmigos().subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        let amigos_data = data.body;

        for (let i = 0; i < amigos_data.length; i++) {
          if(amigos_data[i].usuarioUm_id == window.localStorage.getItem("usuario_id")){
            this.amigos.push(amigos_data[i].usuarioDois_id);
          }else{
            this.amigos.push(amigos_data[i].usuarioUm_id);
          }         
        }

        console.log("amigos");
        console.log(this.amigos);

        this.getUsuarios();
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  getUsuarios(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getUsuarios().subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        console.log(data);

        let usuarios_data = data.body;
        let usuarios_array = [];

        for (let i = 0; i < usuarios_data.length; i++) {
          //Verifica antes se já não é amigo

          let usuarioJaAmigo = false;

          for (let k = 0; k < this.amigos.length; k++) {
            if(this.amigos[k] == usuarios_data[i].id){
              console.log("this.amigos[k] " + this.amigos[k]);
              console.log("usuarios_data[i].id " + usuarios_data[i].id);

              usuarioJaAmigo = true;

              console.log("usuarioJaAmigo " + usuarioJaAmigo);
            }
          }

          if(usuarioJaAmigo){
            continue;
          }else{
            let usuario_atividades_data = usuarios_data[i].atividades;
            let esportes_data = [];

            for (let k = 0; k < usuario_atividades_data.length; k++) {
              esportes_data.push(usuario_atividades_data[k].esporte.nome);
            }

            if(usuarios_data[i].id != window.localStorage.getItem("usuario_id")){
              usuarios_array.push({
                id: usuarios_data[i].id,
                nome: usuarios_data[i].nome,
                esportes: esportes_data.join(", ")
              });
            }
          }
        }

        this.usuarios = usuarios_array;

        if(this.usuarios.length <= 0){
          this.nenhum_usuario_cadastrado = true;
        }else{
          this.nenhum_usuario_cadastrado = false;
        }
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  adicionarComoAmigo(usuario_id){
    let loading = this.loadingController.create({});
    loading.present();

    let amigo_data = {
      usuarioUm_id: window.localStorage.getItem("usuario_id"), 
      usuarioDois_id: usuario_id
    }

    this.helplayProvider.adicionarAmigo(amigo_data).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.navCtrl.push(ProcurarUsuariosPage);
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }
  
  visualizarPerfil(usuario_id){
    this.navCtrl.push(VisualizarPerfilPage, {usuario_id: usuario_id});
  }
}
