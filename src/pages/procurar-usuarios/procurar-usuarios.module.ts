import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProcurarUsuariosPage } from './procurar-usuarios';

@NgModule({
  declarations: [
    ProcurarUsuariosPage,
  ],
  imports: [
    IonicPageModule.forChild(ProcurarUsuariosPage),
  ],
})
export class ProcurarUsuariosPageModule {}
