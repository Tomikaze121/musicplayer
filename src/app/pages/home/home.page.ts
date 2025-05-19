import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Dialog } from '@capacitor/dialog';
import { MusicService } from 'src/app/services/music.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { PlaylistPickerComponent } from 'src/app/components/playlist-picker/playlist-picker.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tracks: any[] = [];
  filter: string = 'all';

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private musicService: MusicService,
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadAudioFiles();
  }

  async ionViewWillEnter() {
    await this.loadAudioFiles();
  }

  async loadAudioFiles() {
    try {
      const result = await Filesystem.readdir({
        directory: Directory.Documents,
        path: '',
      });

      this.tracks = result.files
        .filter(file => file.name.match(/\.(mp3|aac|wav|flac|ogg|opus)$/i))
        .map(file => ({
          name: file.name,
          path: `file:///storage/emulated/0/Documents/${file.name}`,
        }));
    } catch (error) {
      console.error('Error reading files', error);
      this.tracks = [];
    }
  }

  playTrack(track: any) {
    const index = this.tracks.findIndex(t => t.path === track.path);
    this.musicService.setPlaylist(this.tracks, index);
    this.router.navigate(['/player']);
  }

  async deleteTrack(track: any) {
    const confirm = await Dialog.confirm({
      title: 'Delete Track',
      message: `Delete ${track.name}?`,
    });

    if (confirm.value) {
      await Filesystem.deleteFile({
        directory: Directory.Documents,
        path: track.name,
      });
      await this.loadAudioFiles();
    }
  }

  async pickAndSaveFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    await Filesystem.writeFile({
      path: file.name,
      data: base64,
      directory: Directory.Documents,
    });

    await this.loadAudioFiles();
  }

  createPlaylist() {
    const name = prompt('New Playlist Name:');
    if (name && name.trim() !== '') {
      this.playlistService.createPlaylist(name.trim()).then(() => {
        alert(`Playlist "${name}" created.`);
      });
    }
  }

  async promptAddToPlaylist(track: any) {
    const modal = await this.modalCtrl.create({
      component: PlaylistPickerComponent,
      componentProps: { track },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.added) {
      const toast = await this.toastCtrl.create({
        message: `Added to "${data.playlist}"`,
        duration: 1500,
        color: 'success',
      });
      await toast.present();
    }
  }

  filterItems() {
    switch (this.filter) {
      case 'music':
        console.log('Filter: Music');
        break;
      case 'podcasts':
        console.log('Filter: Podcasts');
        break;
      default:
        console.log('Filter: All');
        break;
    }
  }
}
