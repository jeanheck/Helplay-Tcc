import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { HttpResponse } from '@angular/common/http';
import { PerfilEditarPage } from '../perfil-editar/perfil-editar';

/**
 * Generated class for the AtividadePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-atividade',
  templateUrl: 'atividade.html',
})
export class AtividadePage {
  public caracteristica;
  public esporte_caracteristicas = [];
  public esporte_nome;

  public usuario_individualidades;

  public caracteristicas_tela = [];

  public caracteristica_manual;

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
    console.log(this.navParams.get("esporte_id"));

    this.mostrarEsporteCaracteristica();
  }

  mostrarEsporteCaracteristica(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getEsporteECaracteristicas(this.navParams.get("esporte_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.esporte_nome = data.body.nome;

        this.esporte_caracteristicas = [];

        this.esporte_caracteristicas = data.body.caracteristicas;

        console.log("escrevendo pela primeira vez")
        console.log(data);

        this.marcarUsuarioAtividadeIndividualidades();
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  marcarUsuarioAtividadeIndividualidades(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getUsuarioAtividadeIndividualidades(this.navParams.get("atividade_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.usuario_individualidades = data.body.individualidades;
        let checked;
        let individualidade_id = "";
        let inseridaPeloUsuario;

        console.log("logo 2 abaixo");
        console.log(data);

        for (let i = 0; i < this.esporte_caracteristicas.length; i++) {
          checked = false;

          for (let k = 0; k < this.usuario_individualidades.length; k++) {
            if(this.usuario_individualidades[k].caracteristica_id == this.esporte_caracteristicas[i].id){
              checked = true;
              individualidade_id = this.usuario_individualidades[k].id;
              break;
            }
          }

          if(this.esporte_caracteristicas[i].inseridaPeloUsuario == null){
            inseridaPeloUsuario = false;
          }else{
            inseridaPeloUsuario = this.esporte_caracteristicas[i].inseridaPeloUsuario;
          }

          let mostrarOpcaoExcluir = false;
          let mostrarOpcaoMarcar = false;

          if(inseridaPeloUsuario){
            mostrarOpcaoExcluir = true;
            mostrarOpcaoMarcar = false;
          }else{
            mostrarOpcaoExcluir = false;
            mostrarOpcaoMarcar = true;
          }

          let bContinuar = (inseridaPeloUsuario == false || (inseridaPeloUsuario && checked == true));

          if(bContinuar){
            this.caracteristicas_tela.push(
              {
                id: this.esporte_caracteristicas[i].id,
                descricao: this.esporte_caracteristicas[i].descricao,
                esporte_id: this.esporte_caracteristicas[i].esporte_id,
                inseridaPeloUsuario: inseridaPeloUsuario,
                mostrarOpcaoExcluir: mostrarOpcaoExcluir,
                mostrarOpcaoMarcar: mostrarOpcaoMarcar,
                checked: checked,
                individualidade_id: individualidade_id
              }
            );
          }
        }

        this.esporte_caracteristicas = this.caracteristicas_tela;

        console.log(this.esporte_caracteristicas);
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  marcar(numero){
    if(document.getElementById("caracteristica_radio_" + numero).getAttribute("name") == "checkmark-circle"){
      document.getElementById("caracteristica_" + numero).innerHTML = "<ion-icon name='checkmark-circle' id='caracteristica_1' color='primary' (click)='marcar(1)'></ion-icon>";
    }else{
      document.getElementById("caracteristica_" + numero).innerHTML = "<ion-icon name='checkmark-circle' id='caracteristica_1' color='primary' (click)='marcar(1)'></ion-icon>";
    }
  }

  excluirAtividade(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.excluirAtividade(this.navParams.get("atividade_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.navCtrl.push(PerfilEditarPage);
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }
  
  inserirCaracteristicaManual(){
    let loading = this.loadingController.create({});
    loading.present();

    let caracteristica_data = {
      caracteristica:{
        descricao: this.caracteristica_manual,
        esporte_id: this.navParams.get("esporte_id"),
        inseridaPeloUsuario: true
      }
    }

    this.helplayProvider.salvarEsporteCaracteristicaManual(caracteristica_data, this.navParams.get("esporte_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        let nova_caracteristica = data.body;

        this.inserirIndividualidade(nova_caracteristica);
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    );
  }

  inserirIndividualidade(nova_caracteristica){
    console.log(nova_caracteristica.id);

    let loading = this.loadingController.create({});
    loading.present();

    let individualidade_data = {
      individualidade:{
        atividade_id: this.navParams.get("atividade_id"),
        caracteristica_id: nova_caracteristica.id
      }
    }

    console.log(individualidade_data);

    this.helplayProvider.salvarIndividualidade(individualidade_data, this.navParams.get("atividade_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        console.log(data.body);

        this.caracteristica_manual = "";

        let inseridaPeloUsuario = true;
        let mostrarOpcaoExcluir = true;
        let mostrarOpcaoMarcar = false;

        this.caracteristicas_tela.push(
          {
            id: nova_caracteristica.id,
            descricao: nova_caracteristica.descricao,
            esporte_id: nova_caracteristica.esporte_id,
            inseridaPeloUsuario: inseridaPeloUsuario,
            mostrarOpcaoExcluir: mostrarOpcaoExcluir,
            mostrarOpcaoMarcar: mostrarOpcaoMarcar,
            checked: true,
            individualidade_id: data.body.id
          }
        );

      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    );
  }

  excluirCaracteristica(caracteristica_id){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.excluirCaracteristica(caracteristica_id, this.navParams.get("esporte_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.navCtrl.push(AtividadePage, {atividade_id: this.navParams.get("atividade_id"), esporte_id: this.navParams.get("esporte_id")});
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    );
  }

  excluirIndividualidade(caracteristica_id, individualidade_id){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.excluirIndividualidade(this.navParams.get("atividade_id"), individualidade_id).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.excluirCaracteristica(caracteristica_id);
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    );
  }

  desmarcarCaracteristica(individualidade_id){
    console.log("desmarcarCaracteristica");

    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.excluirIndividualidade(this.navParams.get("atividade_id"), individualidade_id).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.navCtrl.push(AtividadePage, {atividade_id: this.navParams.get("atividade_id"), esporte_id: this.navParams.get("esporte_id")});
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    );
  }

  marcarCaracteristica(caracteristica_id){
    console.log("marcarCaracteristica");

    let loading = this.loadingController.create({});
    loading.present();

    let individualidade_data = {
      individualidade:{
        atividade_id: this.navParams.get("atividade_id"),
        caracteristica_id: caracteristica_id
      }
    }

    this.helplayProvider.salvarIndividualidade(individualidade_data, this.navParams.get("atividade_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.navCtrl.push(AtividadePage, {atividade_id: this.navParams.get("atividade_id"), esporte_id: this.navParams.get("esporte_id")});
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    );
  }

  marcarDesmarcarCaracteristica(individualidade_id, checked, caracteristica_id){
    console.log(checked);

    //Aqui tem que ser o contrário. Se nao a parada nao funciona corretamente

    if(checked == false){
      this.desmarcarCaracteristica(individualidade_id);
    }else{
      this.marcarCaracteristica(caracteristica_id);
    }
  }
}
