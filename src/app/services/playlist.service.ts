import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface Track {
  name: string;
  path: string;
}

export interface Playlist {
  name: string;
  tracks: Track[];
}

const PLAYLISTS_KEY = 'user_playlists';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  async getPlaylists(): Promise<Playlist[]> {
    const { value } = await Preferences.get({ key: PLAYLISTS_KEY });
    return value ? JSON.parse(value) : [];
  }

  async savePlaylists(playlists: Playlist[]): Promise<void> {
    await Preferences.set({
      key: PLAYLISTS_KEY,
      value: JSON.stringify(playlists),
    });
  }

  async createPlaylist(name: string): Promise<void> {
    const playlists = await this.getPlaylists();
    playlists.push({ name, tracks: [] });
    await this.savePlaylists(playlists);
  }

  async addToPlaylist(playlistName: string, track: Track): Promise<void> {
    const playlists = await this.getPlaylists();
    const target = playlists.find(p => p.name === playlistName);
    if (target && !target.tracks.some((t: Track) => t.path === track.path)) {
      target.tracks.push(track);
      await this.savePlaylists(playlists);
    }
  }

  async removeFromPlaylist(playlistName: string, trackPath: string): Promise<void> {
    const playlists = await this.getPlaylists();
    const target = playlists.find(p => p.name === playlistName);
    if (target) {
      target.tracks = target.tracks.filter((t: Track) => t.path !== trackPath);
      await this.savePlaylists(playlists);
    }
  }

  async renamePlaylist(oldName: string, newName: string): Promise<void> {
    const playlists = await this.getPlaylists();
    const existing = playlists.find(p => p.name === newName);
    if (existing) throw new Error('A playlist with this name already exists.');

    const index = playlists.findIndex(p => p.name === oldName);
    if (index !== -1) {
      playlists[index].name = newName;
      await this.savePlaylists(playlists);
    }
  }
}
