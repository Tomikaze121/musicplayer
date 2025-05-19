import { Component } from '@angular/core';
import { PlaylistService, Playlist, Track } from 'src/app/services/playlist.service';
import { Router } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.page.html',
  styleUrls: ['./playlist-list.page.scss'],
  standalone: false
})
export class PlaylistListPage {
  playlists: Playlist[] = [];

  constructor(private playlistService: PlaylistService, private router: Router) {}

  async ionViewWillEnter() {
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

  async deletePlaylist(p: Playlist) {
    const confirm = window.confirm(`Are you sure you want to delete "${p.name}"?`);
    if (confirm) {
      await this.playlistService.deletePlaylist(p.name);
      this.playlists = await this.playlistService.getPlaylists();
    }
  }

  async addTrackToPlaylist(p: Playlist) {
    try {
      const result = await Filesystem.readdir({
        directory: Directory.Documents,
        path: '',
      });

      const tracks: Track[] = result.files
        .filter(file => file.name.match(/\.(mp3|aac|wav|flac|ogg|opus)$/i))
        .map(file => ({
          name: file.name,
          path: `file:///storage/emulated/0/Documents/${file.name}`,
        }));

      const selected = prompt(
        `Select track number to add:\n${tracks.map((t, i) => `${i + 1}. ${t.name}`).join('\n')}`
      );

      const index = parseInt(selected || '', 10) - 1;
      if (tracks[index]) {
        await this.playlistService.addToPlaylist(p.name, tracks[index]);
        alert(`Added ${tracks[index].name} to ${p.name}`);
      }

    } catch (error) {
      console.error('Error accessing files:', error);
    }
  }
}
