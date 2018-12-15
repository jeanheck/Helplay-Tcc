import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PerfilEditarPage } from '../perfil-editar/perfil-editar';
import { HelplayProvider } from '../../providers/helplay/helplay';
import { AuthorizationProvider } from '../../providers/authorization/authorization';
import { HttpResponse } from '@angular/common/http';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
  providers:[
    HelplayProvider,
    AuthorizationProvider
  ]
})
export class PerfilPage {
  posts = [];
  imageUrl: string = 'assets/imgs/profile/sem_imagem_capa.png';

  public nenhuma_atividade_cadastrada;
  public usuario_atividades;
  public atividade;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private helplayProvider: HelplayProvider,
    private authorizationProvider: AuthorizationProvider,
    public loadingController: LoadingController
  ) {
    for (let i = 0; i < 10; i++) {
      this.posts[i] = {
        text: 'Post text ' + i,
        created_at: (i + 1),
      };
    }
  }

  ionViewDidLoad(){

  }

  ionViewDidEnter(){
    this.carregarDadosUsuario();
  }

  carregarDadosUsuario(){
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

        document.getElementById("usuario_nome").innerHTML = data.body.nome;
        document.getElementById("usuario_dataNascimento").innerHTML = data.body.dataNascimento_br;
        document.getElementById("usuario_celular").innerHTML = data.body.celular;

        if(data.body.sexo == "F"){
          document.getElementById("usuario_sexo").innerHTML = "Feminino";
        }else{
          document.getElementById("usuario_sexo").innerHTML = "Masculino";
        }

        console.log(data);

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

        //console.log(data);

        if(!this.nenhuma_atividade_cadastrada){
          this.usuario_atividades = [];
          
          data.body.forEach(atividade => {
            console.log(atividade);

            let caracteristicas_atividade = [];

            atividade.individualidades.forEach(individualidade => {
              caracteristicas_atividade.push(individualidade.caracteristica.descricao);
            });

            this.usuario_atividades.push({
              id: atividade.id,
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

  editar(){
    this.navCtrl.push(PerfilEditarPage);
  }

  excluirAtividade(atividade_id){
    let loading = this.loadingController.create({});
    loading.present();

    this.helplayProvider.excluirAtividade(atividade_id).subscribe(
      (data: HttpResponse<any>)=>{
        loading.dismiss();

        this.authorizationProvider.set_headers(
          data.headers.get("access-token"), 
          data.headers.get("client"), 
          data.headers.get("uid")
        );

        this.carregarAtividadesUsuario();
      },
      error=>{
        loading.dismiss();
        console.log(error)
      }
    )
  }
}
