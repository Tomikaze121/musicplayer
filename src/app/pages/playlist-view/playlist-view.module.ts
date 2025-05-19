import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PlaylistViewPage } from './playlist-view.page';
import { PlaylistViewPageRoutingModule } from './playlist-view-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistViewPageRoutingModule,
    SharedModule
  ],
  declarations: [
    PlaylistViewPage
  ]
})
export class PlaylistViewPageModule {}
