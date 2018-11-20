import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationProvider } from '../authorization/authorization';

@Component({
  providers:[
    AuthorizationProvider
  ]
})

@Injectable()
export class HelplayProvider {
  constructor(public http: HttpClient, private authorizationProvider:AuthorizationProvider) {

  }

  //******* */
  //Eventos
  //******* */

  getEventos() {
    return this.http.get(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/eventos/", 
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response' 
      }
    );
  }

  getTodosEventos() {
    return this.http.get(
      this.authorizationProvider.basepath + "eventos/", 
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response' 
      }
    );
  }

  getEvento(id) {
    return this.http.get(
      this.authorizationProvider.basepath + "eventos/" + id,
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response' 
      }
    );
  }

  salvarEvento(data){
    return this.http.post(
      this.authorizationProvider.basepath + "usuarios/" +  window.localStorage.getItem("usuario_id") + "/eventos/",
      JSON.stringify(data),
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response' 
      }
    )
  }

  salvarEventoEdicao(data, evento_id){
    return this.http.patch(
      this.authorizationProvider.basepath + "usuarios/" +  window.localStorage.getItem("usuario_id") + "/eventos/" + evento_id,
      JSON.stringify(data),
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  //******* */
  //Esportes
  //******* */

  getTodosEsportesCaracteristicas(){
    return this.http.get(
      this.authorizationProvider.basepath + "esportes/",
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  salvarEsportesECaracteristicas(data){
    let usuario_id = window.localStorage.getItem("usuario_id")

    return this.http.post(
      this.authorizationProvider.basepath + "usuarios/" + usuario_id + "/atividades",
      JSON.stringify(data),
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  getEsporteECaracteristicas(esporte_id){
    return this.http.get(
      this.authorizationProvider.basepath + "esportes/" + esporte_id,
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  //******* */
  //Caracteristicas
  //******* */

  salvarEsporteCaracteristicaManual(caracteristica_data, esporte_id){
    return this.http.post(
      this.authorizationProvider.basepath + "esportes/" + esporte_id + "/caracteristicas",
      JSON.stringify(caracteristica_data),
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  excluirCaracteristica(caracteristica_id, esporte_id){
    return this.http.delete(
      this.authorizationProvider.basepath + "esportes/" + esporte_id + "/caracteristicas/" + caracteristica_id,
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  //******* */
  //Individualidades
  //******* */

  getUsuarioAtividadeIndividualidades(atividade_id){
    return this.http.get(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/atividades/" + atividade_id,
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  salvarIndividualidade(individualidade_data, atividade_id){
    return this.http.post(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/atividades/" + atividade_id + "/individualidades",
      JSON.stringify(individualidade_data),
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  excluirIndividualidade(atividade_id, individualidade_id){
    return this.http.delete(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/atividades/" + atividade_id + "/individualidades/" + individualidade_id,
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  //********/
  //Usuário
  //********/

  getUsuario(user_id){
    return this.http.get(
      this.authorizationProvider.basepath + "usuarios/" + user_id,
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  getUsuarios(){
    return this.http.get(
      this.authorizationProvider.basepath + "usuarios",
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  atualizarUsuario(usuario_dados){
    return this.http.patch(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id"),
      JSON.stringify(usuario_dados),
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  //********/
  //Amigo
  //********/

  adicionarAmigo(amigo_data){
    return this.http.post(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/amigos",
      JSON.stringify(amigo_data),
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  getAmigos(){
    return this.http.get(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/amigos",
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  excluirAmigo(amigo_id){
    return this.http.delete(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/amigos/" + amigo_id,
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  //******* */
  //Atividades
  //******* */

  getAtividades(user_id){
    return this.http.get(
      this.authorizationProvider.basepath + "usuarios/" + user_id + "/atividades",
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  excluirAtividade(atividade_id){
    return this.http.delete(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/atividades/" + atividade_id,
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  //************/
  //Participante
  //************/

  adicionarParticipante(evento_id, participante_data){
    return this.http.post(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/eventos/" + evento_id + "/participantes/",
      JSON.stringify(participante_data),
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  excluirParticipante(evento_id, participante_id){
    return this.http.delete(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/eventos/" + evento_id + "/participantes/" + participante_id,
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }

  getParticipantes(evento_id){
    return this.http.get(
      this.authorizationProvider.basepath + "usuarios/" + window.localStorage.getItem("usuario_id") + "/eventos/" + evento_id + "/participantes/",
      {
        headers: this.authorizationProvider.basic_header(), 
        observe: 'response'
      }
    );
  }
}
