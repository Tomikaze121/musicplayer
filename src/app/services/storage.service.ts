import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const PLAYLIST_KEY = 'user_playlist';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  async saveToPlaylist(track: any): Promise<void> {
    const list = await this.getPlaylist();
    const exists = list.find(t => t.path === track.path);

    if (!exists) {
      list.push(track);
      await Preferences.set({
        key: PLAYLIST_KEY,
        value: JSON.stringify(list),
      });
    }
  }

  async getPlaylist(): Promise<any[]> {
    const { value } = await Preferences.get({ key: PLAYLIST_KEY });
    return value ? JSON.parse(value) : [];
  }

  async removeFromPlaylist(trackPath: string): Promise<void> {
    const list = await this.getPlaylist();
    const updated = list.filter(t => t.path !== trackPath);
    await Preferences.set({
      key: PLAYLIST_KEY,
      value: JSON.stringify(updated),
    });
  }

  async clearPlaylist(): Promise<void> {
    await Preferences.remove({ key: PLAYLIST_KEY });
  }
}
