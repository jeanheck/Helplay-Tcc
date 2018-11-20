import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilEditarPage } from './perfil-editar';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    PerfilEditarPage
  ],
  imports: [
    IonicPageModule.forChild(PerfilEditarPage),
    BrMaskerModule
  ],
})
export class PerfilEditarPageModule {}
