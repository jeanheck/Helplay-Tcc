import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventoDetalhesPage } from './evento-detalhes';

@NgModule({
  declarations: [
    EventoDetalhesPage,
  ],
  imports: [
    IonicPageModule.forChild(EventoDetalhesPage),
  ],
})
export class EventoDetalhesPageModule {}
