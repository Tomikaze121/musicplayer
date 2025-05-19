import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaylistPageRoutingModule } from './playlist-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PlaylistPage } from './playlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistPageRoutingModule,
    SharedModule
  ],
  declarations: [PlaylistPage]
})
export class PlaylistPageModule {}
