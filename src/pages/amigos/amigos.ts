import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProcurarUsuariosPage } from '../procurar-usuarios/procurar-usuarios';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { HttpResponse } from '@angular/common/http';
import { VisualizarPerfilPage } from '../visualizar-perfil/visualizar-perfil';

/**
 * Generated class for the AmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-amigos',
  templateUrl: 'amigos.html',
})
export class AmigosPage {
  public amigos = [];
  public amigo;
  public nenhum_amigo_adicionado;

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
    this.amigos = [];

    this.getAmigos();
  }

  procurarNovosUsuarios(){
    this.navCtrl.push(ProcurarUsuariosPage);
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

        console.log(data);

        let amigos_data = data.body;

        for (let i = 0; i < amigos_data.length; i++) {
          let usuarioUm_data = amigos_data[i].usuarioUm;
          let usuarioDois_data = amigos_data[i].usuarioDois;

          let usuario_data;

          if(usuarioUm_data.id != window.localStorage.getItem("usuario_id")){
            usuario_data = usuarioUm_data;
          }else{
            usuario_data = usuarioDois_data;
          }

          let atividades_data = usuario_data.atividades;
          let esportes_data = [];

          for (let k = 0; k < atividades_data.length; k++) {
            esportes_data.push(atividades_data[k].esporte.nome);
          }
          
          let amigo_data = {
            amigo_id: amigos_data[i].id,
            usuario_id: usuario_data.id,
            nome: usuario_data.nome,
            celular: usuario_data.celular,
            esportes: esportes_data.join(", ")
          };

          this.amigos.push(amigo_data);
        }

        if(this.amigos.length <= 0){
          this.nenhum_amigo_adicionado = true;
        }else{
          this.nenhum_amigo_adicionado = false;
        }

        console.log(this.amigos);
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  excluirAmigo(amigo_id){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.excluirAmigo(amigo_id).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.navCtrl.push(AmigosPage);
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
