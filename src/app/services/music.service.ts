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

  async play(track: any) {
    if (!track || !track.path) return;

    this.stop();

    this.currentTrack = track;
    await Preferences.set({ key: 'currentTrack', value: JSON.stringify(track) });

    let source = track.path;
    if (track.type === 'local') {
      if (!source.startsWith('file://')) {
        const { uri } = await Filesystem.getUri({ path: source, directory: Directory.Documents });
        source = uri;
      }
      source = this.convertFileSrc(source);
    }

    this.currentSound = new Howl({
      src: [source],
      html5: true,
      format: ['mp3', 'aac', 'wav', 'flac', 'ogg', 'opus'],
      onend: () => this.playNext(),
    });

    this.currentSound.play();
  }

  pause() {
    if (this.currentSound?.playing()) this.currentSound.pause();
  }

  resume() {
    if (this.currentSound && !this.currentSound.playing()) this.currentSound.play();
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

  getCurrentSound() {
    return this.currentSound;
  }

  async restoreTrack() {
    const { value } = await Preferences.get({ key: 'currentTrack' });
    if (value) this.currentTrack = JSON.parse(value);
  }

  setPlaylist(list: any[], index: number) {
    this.playlist = list;
    this.currentIndex = index;
    this.play(this.playlist[this.currentIndex]);
  }

  playNext() {
    if (this.playlist.length) {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      this.play(this.playlist[this.currentIndex]);
    }
  }

  playPrevious() {
    if (this.playlist.length) {
      this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.play(this.playlist[this.currentIndex]);
    }
  }

  setStreamingTrack(track: any) {
  this.playlist = [track];
  this.currentIndex = 0;
  this.play(track);
}


  private convertFileSrc(uri: string): string {
    return Capacitor.getPlatform() === 'android'
      ? uri.replace('file://', 'http://localhost/_capacitor_file_')
      : uri;
  }
  
}
