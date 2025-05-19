import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService, Track, Playlist } from 'src/app/services/playlist.service';
import { MusicService } from 'src/app/services/music.service';

@Component({
  selector: 'app-playlist-view',
  templateUrl: './playlist-view.page.html',
  styleUrls: ['./playlist-view.page.scss'],
  standalone: false
})
export class PlaylistViewPage implements OnInit {
  playlistName: string = '';
  tracks: Track[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService,
    private musicService: MusicService
  ) {}

  async ngOnInit() {
    this.playlistName = this.route.snapshot.paramMap.get('name') || '';
    const playlists = await this.playlistService.getPlaylists();
    const match = playlists.find(p => p.name === this.playlistName);
    this.tracks = match?.tracks || [];
  }

  playTrack(track: Track) {
    const index = this.tracks.findIndex(t => t.path === track.path);
    this.musicService.setPlaylist(this.tracks, index);
    this.router.navigate(['/player']);
  }

  async deleteTrack(track: Track) {
    const confirmed = confirm(`Remove "${track.name}" from "${this.playlistName}"?`);
    if (confirmed) {
      await this.playlistService.removeFromPlaylist(this.playlistName, track.path);
      this.tracks = this.tracks.filter(t => t.path !== track.path);
    }
  }
}
