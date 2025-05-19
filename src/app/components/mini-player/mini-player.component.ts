import { Component, OnInit, NgZone } from '@angular/core';
import { MusicService } from 'src/app/services/music.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss'],
  standalone: false,
})
export class MiniPlayerComponent implements OnInit {
  track: any;
  isPlaying = false;
  currentTime = 0;
  duration = 0;

  constructor(private musicService: MusicService, private router: Router, private zone: NgZone) {}

  async ngOnInit() {
    await this.musicService.restoreTrack();
    this.update();
    this.setupProgress();
  }

  update() {
    this.track = this.musicService.getCurrentTrack();
    this.isPlaying = this.musicService.isPlaying();
  }

  setupProgress() {
    const sound = (this.musicService as any).currentSound;
    if (sound) {
      this.duration = sound.duration();
      const loop = () => {
        if (sound.playing()) {
          this.zone.run(() => {
            this.currentTime = sound.seek() as number;
          });
          requestAnimationFrame(loop);
        }
      };
      loop();
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.musicService.pause();
    } else {
      this.musicService.resume();
    }
    setTimeout(() => this.update(), 100);
  }

  playNext() {
    this.musicService.playNext();
    this.update();
  }

  playPrevious() {
    this.musicService.playPrevious();
    this.update();
  }

  openPlayer() {
    this.router.navigate(['/player']);
  }
}
