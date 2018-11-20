import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FeedPageModule } from '../pages/feed/feed.module';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HelplayProvider } from '../providers/helplay/helplay';
import { EventoDetalhesPageModule } from '../pages/evento-detalhes/evento-detalhes.module';
import { IntroPageModule } from '../pages/intro/intro.module';
import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { AmigosPageModule } from '../pages/amigos/amigos.module';
import { PerfilPageModule } from '../pages/perfil/perfil.module';
import { PerfilEditarPageModule } from '../pages/perfil-editar/perfil-editar.module';
import { AtividadePageModule } from '../pages/atividade/atividade.module';
import { AdicionarAtividadePageModule } from '../pages/adicionar-atividade/adicionar-atividade.module';
import { LoginProvider } from '../providers/login/login';
import { RegisterProvider } from '../providers/register/register';
import { IonicStorageModule } from '@ionic/storage';
import { AuthorizationProvider } from '../providers/authorization/authorization';
import { ProcurarUsuariosPageModule } from '../pages/procurar-usuarios/procurar-usuarios.module';
import { NotificacoesPageModule } from '../pages/notificacoes/notificacoes.module';
import { EventoPageModule } from '../pages/evento/evento.module';
import { VisualizarPerfilPageModule } from '../pages/visualizar-perfil/visualizar-perfil.module';
import { EditarEventoPageModule } from '../pages/editar-evento/editar-evento.module';
import { ProcurarParticipantesPageModule } from '../pages/procurar-participantes/procurar-participantes.module';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FeedPageModule,
    HttpModule,
    HttpClientModule,
    EventoDetalhesPageModule,
    IntroPageModule,
    LoginPageModule,
    RegisterPageModule,
    AmigosPageModule,
    PerfilPageModule,
    PerfilEditarPageModule,
    AtividadePageModule,
    ProcurarUsuariosPageModule,
    AdicionarAtividadePageModule,
    NotificacoesPageModule,
    EventoPageModule,
    VisualizarPerfilPageModule,
    EditarEventoPageModule,
    ProcurarParticipantesPageModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HelplayProvider,
    LoginProvider,
    RegisterProvider,
    AuthorizationProvider
  ]
})
export class AppModule {}
