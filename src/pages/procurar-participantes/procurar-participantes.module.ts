import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProcurarParticipantesPage } from './procurar-participantes';

@NgModule({
  declarations: [
    ProcurarParticipantesPage,
  ],
  imports: [
    IonicPageModule.forChild(ProcurarParticipantesPage),
  ],
})
export class ProcurarParticipantesPageModule {}
