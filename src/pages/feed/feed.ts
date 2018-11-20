import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { EventoDetalhesPage } from '../evento-detalhes/evento-detalhes';
import { HttpResponse } from '@angular/common/http';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { EventoPage } from '../evento/evento';
import { EditarEventoPage } from '../editar-evento/editar-evento';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
  providers:[
    HelplayProvider,
    AuthorizationProvider
  ]
})
export class FeedPage {
  public lista_eventos = [];
  public nenhum_evento = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private helplayProvider: HelplayProvider,
    private authorizationProvider: AuthorizationProvider,
    public loadingController: LoadingController
  ) {
  }

  ionViewDidLoad() {
    //this.listarEventos();
  }

  ionViewDidEnter() {
    this.lista_eventos = [];

    this.listarEventos();
  }

  listarEventos(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getEventos().subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        let eventos_data = data.body;

        for (let i = 0; i < eventos_data.length; i++) {
          this.lista_eventos.push(
            {
              id: eventos_data[i].id,
              descricao: eventos_data[i].descricao,
              local: eventos_data[i].local,
              data: eventos_data[i].dataHora,
              hora: eventos_data[i].dataHora,
              publico: eventos_data[i].publico,
              usuario_nome: eventos_data[i].usuario.nome,
              editavel: (eventos_data[i].usuario.id == window.localStorage.getItem("usuario_id"))
            }
          );
        }

        console.log(this.lista_eventos);

        this.getTodosEventos();

        /*if(this.lista_eventos.length == 0){
          this.nenhum_evento = true;
        }*/
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  getTodosEventos(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getTodosEventos().subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        let eventos_data = data.body;

        console.log(data.body);

        for (let i = 0; i < eventos_data.length; i++) {
          let participantes = eventos_data[i].participantes;
          let usuario_participa_do_evento = false;

          for (let l = 0; l < participantes.length; l++) {
            if(participantes[l].usuario_id == window.localStorage.getItem("usuario_id")){
              usuario_participa_do_evento = true;
            }            
          }

          let usuario_criou_evento = false;

          if(eventos_data[i].usuario.id == window.localStorage.getItem("usuario_id")){
            usuario_criou_evento = true;
          }

          if(!usuario_criou_evento && usuario_participa_do_evento){
            this.lista_eventos.push(
              {
                id: eventos_data[i].id,
                descricao: eventos_data[i].descricao,
                local: eventos_data[i].local,
                data: eventos_data[i].dataHora,
                hora: eventos_data[i].dataHora,
                publico: eventos_data[i].publico,
                usuario_nome: eventos_data[i].usuario.nome,
                editavel: false
              }
            );
          }
        }

        console.log(this.lista_eventos);

        if(this.lista_eventos.length == 0){
          this.nenhum_evento = true;
        }
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  public abrirDetalhes(evento){
    this.navCtrl.push(EventoDetalhesPage, {evento_id: evento.id});
  }

  adicionarNovoEvento(){
    this.navCtrl.push(EventoPage);
  }

  editarEvento(evento_id){
    this.navCtrl.push(EditarEventoPage, {evento_id: evento_id});
  }
}
