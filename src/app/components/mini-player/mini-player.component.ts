import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MusicService } from 'src/app/services/music.service';
import { Howl } from 'howler';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss'],
  standalone: false,
})
export class MiniPlayerComponent implements OnInit {
  track: any = null;
  isPlaying = false;
  currentTime = 0;
  duration = 0;

  constructor(private musicService: MusicService, private router: Router, private zone: NgZone) {}

  ngOnInit() {
    this.updatePlayerState();
    this.watchProgress();
  }

  updatePlayerState() {
    this.track = this.musicService.getCurrentTrack();
    this.isPlaying = this.musicService.isPlaying();
    const sound = (this.musicService as any).currentSound as Howl;
    this.duration = sound?.duration() || 0;
  }

  togglePlayPause(event: Event) {
    event.stopPropagation();
    if (this.isPlaying) {
      this.musicService.pause();
    } else {
      this.musicService.resume();
    }
    this.updatePlayerState();
  }

  playNext(event: Event) {
    event.stopPropagation();
    this.musicService.playNext();
    this.updatePlayerState();
  }

  playPrevious(event: Event) {
    event.stopPropagation();
    this.musicService.playPrevious();
    this.updatePlayerState();
  }

  openPlayer() {
    this.router.navigate(['/player']);
  }

  watchProgress() {
    const update = () => {
      const sound = (this.musicService as any).currentSound as Howl;
      this.zone.run(() => {
        this.currentTime = sound?.seek() as number || 0;
        this.duration = sound?.duration() || 0;
        this.isPlaying = sound?.playing() || false;
        this.track = this.musicService.getCurrentTrack();
      });

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }
}
