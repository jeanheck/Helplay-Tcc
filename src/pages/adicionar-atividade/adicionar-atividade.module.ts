import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionarAtividadePage } from './adicionar-atividade';

@NgModule({
  declarations: [
    AdicionarAtividadePage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionarAtividadePage),
  ],
})
export class AdicionarAtividadePageModule {}
