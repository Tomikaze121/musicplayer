import { Component, OnInit } from '@angular/core';
import { PlaylistService, Playlist } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.page.html',
  styleUrls: ['./playlist-list.page.scss'],
  standalone: false
})
export class PlaylistListPage implements OnInit {
  playlists: Playlist[] = [];

  constructor(private playlistService: PlaylistService, private router: Router) {}

  async ngOnInit() {
    this.playlists = await this.playlistService.getPlaylists();
  }

  openPlaylist(p: Playlist) {
    this.router.navigate(['/playlist-view', p.name]);
  }

  async renamePlaylist(p: Playlist) {
    const newName = prompt(`Rename "${p.name}" to:`, p.name);
    if (newName && newName !== p.name) {
      try {
        await this.playlistService.renamePlaylist(p.name, newName);
        this.playlists = await this.playlistService.getPlaylists();
        alert(`Renamed to "${newName}"`);
      } catch (err: any) {
        alert(err.message);
      }
    }
  }
}
