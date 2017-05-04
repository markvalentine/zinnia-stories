import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { StoryService } from '../../stories/story.service';
import { Story } from '../../stories/story';
import { CollectionService } from '../../collections/collection.service';
import { Collection } from '../../collections/collection';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  featuredStoryCards: Observable<any[]>;
  featuredStoryCardsMiddle: Observable<any[]>;
  featuredStoryCardsLast: Observable<any[]>;
  collections: FirebaseListObservable<any[]>;

  background_url = "assets/images/0.jpg";
  background_color= "#C58B57";

  colors = ["#C58B57", "#28342E", "#233128", "#E6BB58"];

  constructor(
    private storyService: StoryService,
    private collectionService: CollectionService
  ) {
    let index = (Math.round((Date.now()/600000))%4);
    this.background_url = "url(/assets/images/backgrounds/"+index+".jpg)";
    this.background_color = this.colors[index];
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.featuredStoryCards = this.storyService.getXFeaturedStoryCards(3);
    this.featuredStoryCardsMiddle = this.storyService.getXFeaturedStoryCards(6);
    this.featuredStoryCardsLast = this.storyService.getXFeaturedStoryCards(10);
    this.collections = this.collectionService.getCollections();
  }

}
