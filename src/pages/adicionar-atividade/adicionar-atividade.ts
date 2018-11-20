import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PerfilPage } from '../perfil/perfil';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { HttpResponse } from '@angular/common/http';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { FeedPage } from '../feed/feed';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-adicionar-atividade',
  templateUrl: 'adicionar-atividade.html',
  providers:[
    HelplayProvider
  ]
})
export class AdicionarAtividadePage {

  public futebolCaracteristicas = [
    { descricao: "Rápido", checked: false },
    { descricao: "Alto", checked: false },
    { descricao: "Goleiro", checked: false },
    { descricao: "Lateral", checked: false }
  ];

  public esportes = [];
  public esporte;
  public caracteristica;
  

  teste: boolean;

  cucumber: boolean;

  updateCucumber() {
    console.log('Cucumbers new state:' + this.cucumber);
  }

  updateTeste() {
    console.log('Teste new state:' + this.teste);
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private helplayProvider:HelplayProvider,
    public loadingController: LoadingController,
    private authorizationProvider:AuthorizationProvider) {
  }

  ionViewDidLoad() {
    this.mostrarEsportesCaracteristicas();
  }

  mostrarEsportesCaracteristicas(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getTodosEsportesCaracteristicas().subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        let a_esportes = data.body;

        a_esportes.forEach(esporte => {
          let a_caracteristica = [];

          esporte.caracteristicas.forEach(caracteristica => {
            a_caracteristica.push({id: caracteristica.id, descricao: caracteristica.descricao, checked: false});
          });

          esporte.caracteristicas;

          this.esportes.push({id: esporte.id, nome: esporte.nome, checked: false, caracteristicas: a_caracteristica});
        });
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  marcarEsporte(id){
    
    if(document.getElementById("caracteristicas_" + id).style.display == "none"){
      document.getElementById("caracteristicas_" + id).style.display = "";
      document.getElementById("esporte_descricao_" + id).style.color = "#488aff";

      this.esportes.find(esporte => esporte.id == id).checked = true;
    }else{
      document.getElementById("caracteristicas_" + id).style.display = "none";
      document.getElementById("esporte_descricao_" + id).style.color = "#000";

      this.esportes.find(esporte => esporte.id == id).checked = false;

      let listaCaracteristicas = this.esportes.find(esporte => esporte.id == id).caracteristicas;

      for (var i = 0; i < listaCaracteristicas.length; i++) {
        this.trocarEstadoCaracteristica(id, listaCaracteristicas[i].id, false);
      }
    }

  }

  marcarCaracteristica(esporte_id, caracteristica_id){
    let estado_atual = this.esportes.find(esporte => esporte.id == esporte_id).caracteristicas.find(caracteristica => caracteristica.id == caracteristica_id).checked;

    var estado = false;
    if(estado_atual == false){
      var estado = true;
    }

    this.trocarEstadoCaracteristica(esporte_id, caracteristica_id, estado);
  }

  trocarEstadoCaracteristica(esporte_id, caracteristica_id, estado){
    this.esportes.find(esporte => esporte.id == esporte_id).caracteristicas.find(caracteristica => caracteristica.id == caracteristica_id).checked = estado;

    if(estado == true){
      document.getElementById("caracteristica_descricao_" + caracteristica_id).style.color = "#32db64";
    }else{
      document.getElementById("caracteristica_descricao_" + caracteristica_id).style.color = "#000";
    }
  }

  salvarEsportesECaracteristicas(){
    let data = {
      "atividades": []
    };

    let selecionouAlgumEsporte = false;

    this.esportes.forEach(esporte => {
      if(esporte.checked){
        let individualidades_attributes = [];
        
        esporte.caracteristicas.forEach(caracteristica => {
          if(caracteristica.checked){
            individualidades_attributes.push(
              {"caracteristica_id": caracteristica.id}
            );
          }
        });

        let atividade = {
          "atividade":{
            "esporte_id": esporte.id,
            "usuario_id": window.localStorage.getItem("usuario_id"),
            individualidades_attributes
            }
        };

        data.atividades.push(atividade);

        console.log(JSON.parse(JSON.stringify(data)));

        selecionouAlgumEsporte = true;
      }
    });

    if(selecionouAlgumEsporte){

      let loading = this.loadingController.create({});
      loading.present();

      let saveDataSuccesfull = true;

      this.helplayProvider.salvarEsportesECaracteristicas(data).subscribe(
        (data: HttpResponse<any>)=>{
          loading.dismiss();
  
          saveDataSuccesfull = true;
  
          this.authorizationProvider.set_headers(
            data.headers.get("access-token"),
            data.headers.get("client"),
            data.headers.get("uid")
          );
  
          if(saveDataSuccesfull){
            this.continuarParaPerfil();
          }
        },
        error=>{
          loading.dismiss();
          console.log(error);
        }
      )
    }else{
      alert("Nenhum esporte selecionado!");
    }
  }

  continuarParaPerfil(){
    //this.navCtrl.push(PerfilPage);
    //this.navCtrl.push(FeedPage);
    this.navCtrl.push(TabsPage);
  }

}
