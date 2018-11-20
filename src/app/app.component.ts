import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { PerfilPage } from '../pages/perfil/perfil';
import { FeedPage } from '../pages/feed/feed';
import { PerfilEditarPage } from '../pages/perfil-editar/perfil-editar';
import { AtividadePage } from '../pages/atividade/atividade';
import { AdicionarAtividadePage } from '../pages/adicionar-atividade/adicionar-atividade';
import { NotificacoesPage } from '../pages/notificacoes/notificacoes';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = LoginPage;
  rootPage:any = LoginPage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      /*let config = configProvider.getConfigData();

      console.log(config);
      
      if(config == "undefined"){
        this.rootPage = LoginPage;
        configProvider.setConfigData(false);
      }else{
        this.rootPage = IntroPage;
      }*/

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
