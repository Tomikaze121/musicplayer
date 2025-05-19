import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistViewPage } from './playlist-view.page';

describe('PlaylistViewPage', () => {
  let component: PlaylistViewPage;
  let fixture: ComponentFixture<PlaylistViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
