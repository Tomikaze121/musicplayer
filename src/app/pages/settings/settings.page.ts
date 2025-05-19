import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  audioQuality: string = 'high';
  theme: string = 'light';
  autoplay: boolean = false;

  async ngOnInit() {
    const { value: quality } = await Preferences.get({ key: 'audioQuality' });
    const { value: theme } = await Preferences.get({ key: 'theme' });
    const { value: autoplay } = await Preferences.get({ key: 'autoplay' });

    this.audioQuality = quality || 'high';
    this.theme = theme || 'light';
    this.autoplay = autoplay === 'true';

    if (this.theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  async saveSettings() {
    await Preferences.set({ key: 'audioQuality', value: this.audioQuality });
    await Preferences.set({ key: 'theme', value: this.theme });
    await Preferences.set({ key: 'autoplay', value: this.autoplay.toString() });

    if (this.theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    alert('Settings saved!');
  }
}
