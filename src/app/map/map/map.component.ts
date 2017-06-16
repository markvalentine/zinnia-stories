import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../stories/story.service';
import { MapService } from '../map.service';
import { FirebaseListObservable } from "angularfire2/database"
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Camp } from '../map';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  lng: number = -98.617067;
  lat: number = 32.8188445;

  zoom: number = 5;

  camps: FirebaseListObservable<Camp[]>
  cards: FirebaseListObservable<any[]>

  styles  = [
    {"featureType": "administrative", "elementType": "geometry", "stylers": [{"color": "#d0d0d0"}]},
    {"featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{"color": "#666666"}]},
    {"featureType": "administrative", "elementType": "labels.text.stroke", "stylers": [{"visibility": "off"}]},
    {"featureType": "administrative.land_parcel","stylers": [{"visibility": "off"}]},
    {"featureType": "administrative.neighborhood", "stylers": [{"visibility": "off"}]},
    {"featureType": "poi", "stylers": [{"visibility": "simplified"}]},
    {"featureType": "poi.business", "stylers": [{"visibility": "off"}]},
    {"featureType": "road", "stylers": [{"visibility": "simplified"}]},
    {"featureType": "road", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"}]},
    {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"color": "#ffffff"}]},
    {"featureType": "road", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
    {"featureType": "transit", "stylers": [{"visibility": "off"}]},
    {"featureType": "water", "elementType": "geometry", "stylers": [{"color": "#a0d3d3"}]}
  ]


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storyService: StoryService,
    private mapService: MapService
    ){ }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['lat'] && params['lng']){
        this.lat = +params['lat']
        this.lng = +params['lng']
        this.zoom = 15;
      }
    });
    this.camps = this.mapService.getCamps();
    //pass undefined to get all
    this.cards = this.storyService.getAllStoryCards();
  }

  goToDetail(key: string) {
    let link = ['/stories', key];
    this.router.navigate(link);
  }

}
