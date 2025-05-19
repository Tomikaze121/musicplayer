import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlaylistService, Playlist, Track } from 'src/app/services/playlist.service';

@Component({
  selector: 'app-playlist-picker',
  templateUrl: './playlist-picker.component.html',
  styleUrls: ['./playlist-picker.component.scss'],
  standalone: false
})
export class PlaylistPickerComponent {
  @Input() track!: Track;
  playlists: Playlist[] = [];

  constructor(
    private playlistService: PlaylistService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.playlists = await this.playlistService.getPlaylists();
  }

  async select(playlist: Playlist) {
    await this.playlistService.addToPlaylist(playlist.name, this.track);
    await this.modalCtrl.dismiss({ added: true, playlist: playlist.name });
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
