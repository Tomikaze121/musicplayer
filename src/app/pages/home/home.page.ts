import { Component, OnInit } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Dialog } from '@capacitor/dialog';
import { MusicService } from 'src/app/services/music.service';
import { PlaylistService } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';
import { DeezerService } from 'src/app/services/deezer.service';
import { ModalController, ToastController } from '@ionic/angular';
import { PlaylistPickerComponent } from 'src/app/components/playlist-picker/playlist-picker.component';
import { Howl } from 'howler';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})

//class variables
export class HomePage implements OnInit {
  tracks: any[] = [];
  filteredTracks: any[] = [];
  localQuery: string = '';
  filter: string = 'all';
  deezerQuery = '';
  deezerTracks: any[] = [];
  isOnline: boolean = true;
  currentStreamSound: Howl | null = null;

  //ga inject sa dependencies
  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private musicService: MusicService,
    private playlistService: PlaylistService,
    private router: Router,
    private deezerService: DeezerService
  ) {}

  //mga problema sa na unsa ipangbutang para mu gana sa music player YEYAH!
  async ngOnInit() {
    await this.loadAudioFiles();
  }

  async ionViewWillEnter() {
    this.isOnline = navigator.onLine;
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
          type: 'local'
        }));

      this.filteredTracks = [...this.tracks];
    } catch {
      this.tracks = [];
      this.filteredTracks = [];
    }
  }

  filterLocalTracks() {
    const q = this.localQuery.toLowerCase();
    this.filteredTracks = this.tracks.filter(t => t.name.toLowerCase().includes(q));
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

    // mu store og data
    const arrayBuffer = await file.arrayBuffer();
    const base64 = btoa(new Uint8Array(arrayBuffer).reduce((d, b) => d + String.fromCharCode(b), ''));
    await Filesystem.writeFile({ path: file.name, data: base64, directory: Directory.Documents });
    await this.loadAudioFiles();
  }

  async createPlaylist() {
    const name = prompt('New Playlist Name:');
    if (name && name.trim() !== '') {
      await this.playlistService.createPlaylist(name.trim());
      alert(`Playlist "${name}" created.`);
      this.router.navigate(['/playlist-list']);
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

  async searchDeezer() {
    if (!this.isOnline || !this.deezerQuery.trim()) return;
    this.deezerTracks = await this.deezerService.searchTracks(this.deezerQuery);
  }

  playDeezerPreview(track: any) {
    if (!track.preview) return alert('No preview available');

    if (this.currentStreamSound) {
      this.currentStreamSound.stop();
      this.currentStreamSound = null;
    }

    this.currentStreamSound = new Howl({ src: [track.preview], html5: true });
    this.currentStreamSound.play();

    this.musicService.setStreamingTrack({
      name: track.title,
      path: track.preview,
      type: 'stream',
      album: track.album,
      artist: track.artist
    });

    this.router.navigate(['/player']);
  }

  filterItems() {
    if (this.filter === 'playlists') this.router.navigate(['/playlist-list']);
  }
}
