import { Component } from '@angular/core';
import { FeedPage } from '../feed/feed';
import { AmigosPage } from '../amigos/amigos';
import { PerfilPage } from '../perfil/perfil';
import { NotificacoesPage } from '../notificacoes/notificacoes';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabEventos = FeedPage;
  tabAmigos = AmigosPage;
  tabPerfil = PerfilPage;
  //tabNotificacoes = NotificacoesPage;

  constructor() {

  }

  ionViewDidLoad() {
    
  }
}
