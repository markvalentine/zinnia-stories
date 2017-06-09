import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBannerComponent } from './map-banner.component';

describe('MapBannerComponent', () => {
  let component: MapBannerComponent;
  let fixture: ComponentFixture<MapBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
