import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { MusicService } from 'src/app/services/music.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: false,
})
export class PlaylistPage implements OnInit {
  playlist: any[] = [];

  constructor(
    private storage: StorageService,
    private music: MusicService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadPlaylist();
  }

  async ionViewWillEnter() {
    await this.loadPlaylist(); 
  }

  async loadPlaylist() {
    this.playlist = await this.storage.getPlaylist();
  }

  play(track: any) {
    this.music.play(track);
    this.router.navigate(['/player']);
  }

  async remove(track: any) {
    await this.storage.removeFromPlaylist(track.path);
    await this.loadPlaylist();
  }
  
  stop() {
  this.router.navigate(['/home']);
}

  
}
