import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { HttpResponse } from '@angular/common/http';
import { AuthorizationProvider } from '../../providers/authorization/authorization';

/**
 * Generated class for the EventoDetalhesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-evento-detalhes',
  templateUrl: 'evento-detalhes.html',
  providers:[
    HelplayProvider
  ]
})
export class EventoDetalhesPage {
  public descricao;
  public usuario_nome
  public data;
  public hora;
  public local;
  public qtde_participantes;
  public informacoes;
  public participantes = [];
  public participante;

  imageUrl: string = 'assets/imgs/ica-slidebox-img-4.png';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public helplayProvider: HelplayProvider,
    public loadingController: LoadingController,
    private authorizationProvider: AuthorizationProvider
  ) {
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {
    this.carregarEvento();
  }

  carregarEvento(){
    let loading = this.loadingController.create({});
    loading.present();
    
    this.helplayProvider.getEvento(this.navParams.get("evento_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        console.log(data.body);

        let participantes_data = data.body.participantes;

        console.log(participantes_data);

        for (let i = 0; i < participantes_data.length; i++) {
          this.participantes.push(participantes_data[i].usuario.nome);
        }

        this.descricao = data.body.descricao;
        this.usuario_nome = data.body.usuario.nome;
        this.data = data.body.dataHora;
        this.hora = data.body.dataHora;
        this.local = data.body.local;
        this.qtde_participantes = data.body.participantes.length;
        this.informacoes = data.body.informacoes;

        console.log(this.participantes);
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }
}
