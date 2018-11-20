import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AtividadePage } from '../atividade/atividade';
import { AdicionarAtividadePage } from '../adicionar-atividade/adicionar-atividade';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { HttpResponse } from '@angular/common/http';
/**
 * Generated class for the PerfilEditarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil-editar',
  templateUrl: 'perfil-editar.html',
  providers:[
    HelplayProvider,
    AuthorizationProvider
  ]
})
export class PerfilEditarPage {
  imageUrl: string = 'assets/imgs/profile/profile-cover.jpg';

  public nome;
  public dataNascimento;
  public sexo;
  public celular;
  public usuario_atividades;
  public nenhuma_atividade_cadastrada;
  public atividade;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private helplayProvider: HelplayProvider,
    private authorizationProvider: AuthorizationProvider,
    public loadingController: LoadingController
  ) {
  }

  ionViewDidLoad() {
    //this.carregarUsuario();
  }

  ionViewDidEnter() {
    this.carregarUsuario();
  }

  editarAtividade(atividade_id, esporte_id){
    this.navCtrl.push(AtividadePage, {atividade_id: atividade_id, esporte_id: esporte_id});
  }

  adicionarNovaAtividade(){
    this.navCtrl.push(AdicionarAtividadePage);
  }

  salvarDadosUsuario(){
    let loading = this.loadingController.create({});
    loading.present();

    let usuario_data = {
      usuario:{
        "id": window.localStorage.getItem("usuario_id"),
        "nome": this.nome,
        "dataNascimento": this.dataNascimento,
        "sexo": this.sexo,
        "celular": this.celular
      }
    };

    /*console.log(JSON.stringify(usuario_data));*/

    this.helplayProvider.atualizarUsuario(usuario_data).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        console.log(data);

        this.nome = data.body.nome;
        this.dataNascimento = data.body.dataNascimento;
        this.sexo = data.body.sexo;
        this.celular = data.body.celular;
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  carregarUsuario(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getUsuario(window.localStorage.getItem("usuario_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        console.log(data);

        this.nome = data.body.nome;
        this.dataNascimento = data.body.dataNascimento;
        this.sexo = data.body.sexo;
        this.celular = data.body.celular;

        this.carregarAtividadesUsuario();
        
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }

  carregarAtividadesUsuario(){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.getAtividades(window.localStorage.getItem("usuario_id")).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        if(data.body.length == 0){
          this.nenhuma_atividade_cadastrada = true;
        }else{
          this.nenhuma_atividade_cadastrada = false;
        }

        if(!this.nenhuma_atividade_cadastrada){
          this.usuario_atividades = [];
          
          data.body.forEach(atividade => {
            let caracteristicas_atividade = [];

            atividade.individualidades.forEach(individualidade => {
              caracteristicas_atividade.push(individualidade.caracteristica.descricao);
            });

            this.usuario_atividades.push({
              id: atividade.id,
              esporte_id: atividade.esporte.id,
              nome: atividade.esporte.nome,
              caracteristicas: caracteristicas_atividade.join(", ")
            });
          });
        }        
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }
}
