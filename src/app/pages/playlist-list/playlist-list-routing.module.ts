import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaylistListPage } from './playlist-list.page';

const routes: Routes = [
  {
    path: '',
    component: PlaylistListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistListPageRoutingModule {}
