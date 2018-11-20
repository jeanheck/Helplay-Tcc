import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProcurarUsuariosPage } from '../procurar-usuarios/procurar-usuarios';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { HttpResponse } from '@angular/common/http';
import { VisualizarPerfilPage } from '../visualizar-perfil/visualizar-perfil';
import { EditarEventoPage } from '../editar-evento/editar-evento';

/**
 * Generated class for the AmigosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-procurar-participantes',
  templateUrl: 'procurar-participantes.html',
})
export class ProcurarParticipantesPage {
  public amigos = [];
  public amigo;
  public nenhum_amigo_para_adicionar;

  public participantes = [];

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

    this.getParticipantes();
  }

  getParticipantes(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getParticipantes(this.navParams.get("evento_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        console.log(data);

        let participantes_data = data.body;

        for (let i = 0; i < participantes_data.length; i++) {
          let usuario_data = participantes_data[i].usuario;
          let atividades_data = usuario_data.atividades;
          let esportes_data = [];

          for (let k = 0; k < atividades_data.length; k++) {
            esportes_data.push(atividades_data[k].esporte.nome);
          }
          
          let participante_data = {
            usuario_id: usuario_data.id,
            nome: usuario_data.nome,
            celular: usuario_data.celular,
            esportes: esportes_data.join(", "),
            participante_id: participantes_data[i].id
          };

          this.participantes.push(participante_data);
        }
        
        this.getAmigos();

      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
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

          let amigo_ja_participando = false;

          for (let k = 0; k < this.participantes.length; k++) {
            if(this.participantes[k].usuario_id == usuario_data.id){
              amigo_ja_participando = true;
            }
          }

          if(!amigo_ja_participando){
            let amigo_data = {
              amigo_id: amigos_data[i].id,
              usuario_id: usuario_data.id,
              nome: usuario_data.nome,
              celular: usuario_data.celular,
              esportes: esportes_data.join(", ")
            };

            this.amigos.push(amigo_data);
          }
        }

        if(this.amigos.length <= 0){
          this.nenhum_amigo_para_adicionar = true;
        }else{
          this.nenhum_amigo_para_adicionar = false;
        }

        console.log(this.amigos);
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  adicionarAoEvento(usuario_id){
    let loading = this.loadingController.create({});
    loading.present();

    let participante_data = {
      evento_id: this.navParams.get("evento_id"),
      usuario_id: usuario_id
    };

    this.helplayProvider.adicionarParticipante(this.navParams.get("evento_id"), participante_data).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.navCtrl.push(EditarEventoPage, {evento_id: this.navParams.get("evento_id")});
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
