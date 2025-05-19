import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private currentSound: Howl | null = null;
  private currentTrack: any = null;
  private playlist: any[] = [];
  private currentIndex: number = 0;

  constructor() {}

  async play(track: any) {
    if (!track || !track.path) return;

    await Preferences.set({ key: 'currentTrack', value: JSON.stringify(track) });
    this.currentTrack = track;

    if (this.currentSound) {
      this.currentSound.unload();
    }

    try {
      let finalUri = track.path;
      if (!track.path.startsWith('file://')) {
        const { uri } = await Filesystem.getUri({
          path: track.path,
          directory: Directory.Documents,
        });
        finalUri = uri;
      }

      const safeUri = this.convertFileSrc(finalUri);

      this.currentSound = new Howl({
        src: [safeUri],
        html5: true,
        format: ['mp3', 'aac', 'wav', 'flac', 'ogg', 'opus'],
        onend: () => this.playNext(),
      });

      this.currentSound.play();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  pause() {
    if (this.currentSound?.playing()) {
      this.currentSound.pause();
    }
  }

  resume() {
    if (this.currentSound && !this.currentSound.playing()) {
      this.currentSound.play();
    }
  }

  stop() {
    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound.unload();
      this.currentSound = null;
    }
  }

  isPlaying(): boolean {
    return this.currentSound?.playing() || false;
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  async restoreTrack() {
    const { value } = await Preferences.get({ key: 'currentTrack' });
    if (value) {
      this.currentTrack = JSON.parse(value);
    }
  }

  setPlaylist(list: any[], startIndex: number) {
    this.playlist = list;
    this.currentIndex = startIndex;
    this.play(this.playlist[this.currentIndex]);
  }

  playNext() {
    if (this.playlist.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      this.play(this.playlist[this.currentIndex]);
    }
  }

  playPrevious() {
    if (this.playlist.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.play(this.playlist[this.currentIndex]);
    }
  }

  private convertFileSrc(uri: string): string {
    if (Capacitor.getPlatform() === 'android') {
      return uri.replace('file://', 'http://localhost/_capacitor_file_');
    }
    return uri;
  }
}
