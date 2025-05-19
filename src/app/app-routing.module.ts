import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'player',
    loadChildren: () =>
      import('./pages/player/player.module').then((m) => m.PlayerPageModule),
  },
  {
    path: 'playlist',
    loadChildren: () =>
      import('./pages/playlist/playlist.module').then((m) => m.PlaylistPageModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then((m) => m.SettingsPageModule),
  },
  {
    path: 'playlist-view/:name',
    loadChildren: () =>
      import('./pages/playlist-view/playlist-view.module').then((m) => m.PlaylistViewPageModule),
  },
  {
    path: 'playlist-list',
    loadChildren: () =>
      import('./pages/playlist-list/playlist-list.module').then((m) => m.PlaylistListPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
