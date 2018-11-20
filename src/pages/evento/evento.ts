import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FeedPage } from '../feed/feed';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { HttpResponse } from '@angular/common/http';

/**
 * Generated class for the EventoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-evento',
  templateUrl: 'evento.html',
})
export class EventoPage {
  public nome_evento;
  public data;
  public hora;
  public local_evento;
  public informacoes;

  constructor(public navCtrl: NavController, public navParams: NavParams, private helplayProvider: HelplayProvider,
    private authorizationProvider: AuthorizationProvider,
    public loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventoPage');
  }

  ionViewDidEnter(){
    this.nome_evento = "";
    this.data = "";
    this.hora = "";
    this.local_evento = "";
    this.informacoes = "";
  }

  imageUrl: string = 'assets/imgs/profile/sem_imagem_capa.png';

  salvar(){
    let loading = this.loadingController.create({});
    loading.present();

    let evento_data = {
      evento:{
        "descricao": this.nome_evento,
        "local": this.local_evento,
        "dataHora": this.data + " " + this.hora,
        "informacoes": this.informacoes,
        "publico": true,
        "usuario_id": window.localStorage.getItem("usuario_id")
      }
    };

    this.helplayProvider.salvarEvento(evento_data).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        console.log(data);

        /*this.nome_evento = data.body.descricao;
        this.data = data.body.dataHora;
        this.hora = data.body.dataHora;
        this.local_evento = data.body.local;
        this.informacoes = data.body.informacoes;

        this.navCtrl.push(FeedPage);*/
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }
}
