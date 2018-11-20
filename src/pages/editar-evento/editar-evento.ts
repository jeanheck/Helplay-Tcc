import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FeedPage } from '../feed/feed';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { HttpResponse } from '@angular/common/http';
import { ProcurarParticipantesPage } from '../procurar-participantes/procurar-participantes';

/**
 * Generated class for the EventoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editar-evento',
  templateUrl: 'editar-evento.html',
})
export class EditarEventoPage {
  public nome_evento;
  public data;
  public hora;
  public local_evento;
  public informacoes;

  public participantes = [];
  public nenhum_participante;

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

    this.participantes = [];
    
    this.carregarEvento();
  }

  imageUrl: string = 'assets/imgs/profile/sem_imagem_capa.png';

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

        this.nome_evento = data.body.descricao;
        this.data = data.body.dataHora;
        this.hora = data.body.dataHora;
        this.local_evento = data.body.local;
        this.informacoes = data.body.informacoes;

        this.getParticipantes();
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  salvarEdicao(){
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

    this.helplayProvider.salvarEventoEdicao(evento_data, this.navParams.get("evento_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        console.log(data);

        this.nome_evento = data.body.descricao;
        this.data = data.body.dataHora;
        this.hora = data.body.dataHora;
        this.local_evento = data.body.local;
        this.informacoes = data.body.informacoes;

        this.navCtrl.push(FeedPage);
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  procurarParticipantes(){
    this.navCtrl.push(ProcurarParticipantesPage, {evento_id: this.navParams.get("evento_id")});
  }

  excluirParticipante(participante_id){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.excluirParticipante(this.navParams.get("evento_id"), participante_id).subscribe(
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

        if(this.participantes.length <= 0){
          this.nenhum_participante = true;
        }else{
          this.nenhum_participante = false;
        }

        console.log("ola crianças");

        console.log(this.participantes);

      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }
}
