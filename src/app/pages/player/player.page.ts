import { Component, OnInit, NgZone } from '@angular/core';
import { MusicService } from 'src/app/services/music.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
  standalone:false,
})
export class PlayerPage implements OnInit {
  track: any;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  repeat = false;

  constructor(private musicService: MusicService, private router: Router, private zone: NgZone) {}

  ngOnInit() {
    this.track = this.musicService.getCurrentTrack();
    this.isPlaying = this.musicService.isPlaying();
    this.setupProgressWatcher();
  }

  setupProgressWatcher() {
    const sound = (this.musicService as any).currentSound;

    if (sound) {
      this.duration = sound.duration();
      const loop = () => {
        if (sound.playing()) {
          this.zone.run(() => {
            this.currentTime = sound.seek() as number;
          });
          requestAnimationFrame(loop);
        } else if (this.repeat) {
          sound.play();
          requestAnimationFrame(loop);
        }
      };
      loop();
    }
  }

  seekTo(event: any) {
    const newTime = event.detail.value;
    const sound = (this.musicService as any).currentSound;
    if (sound) {
      sound.seek(newTime);
      this.currentTime = newTime;
    }
  }

  play() {
    this.musicService.resume();
    this.isPlaying = true;
    this.setupProgressWatcher();
  }

  pause() {
    this.musicService.pause();
    this.isPlaying = false;
  }

  stop() {
    this.router.navigate(['/home']);
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }
}
