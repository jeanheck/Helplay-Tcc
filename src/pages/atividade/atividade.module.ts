import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AtividadePage } from './atividade';

@NgModule({
  declarations: [
    AtividadePage,
  ],
  imports: [
    IonicPageModule.forChild(AtividadePage),
  ],
})
export class AtividadePageModule {}
