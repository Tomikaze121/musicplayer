import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MiniPlayerComponent } from '../components/mini-player/mini-player.component';
import { PlaylistPickerComponent } from '../components/playlist-picker/playlist-picker.component';

@NgModule({
  declarations: [MiniPlayerComponent, PlaylistPickerComponent],
  imports: [CommonModule, IonicModule],
  exports: [MiniPlayerComponent, PlaylistPickerComponent] 
})
export class SharedModule {}
