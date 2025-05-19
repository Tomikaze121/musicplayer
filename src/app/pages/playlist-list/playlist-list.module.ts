import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PlaylistListPage } from './playlist-list.page';
import { PlaylistListPageRoutingModule } from './playlist-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaylistListPageRoutingModule,
    SharedModule
  ],
  declarations: [
    PlaylistListPage
  ]
})
export class PlaylistListPageModule {}
