import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
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

  featuredStories: Observable<any[]>;
  featuredStoriesMiddle: Observable<any[]>;
  featuredStoriesLast: Observable<any[]>;
  collections: FirebaseListObservable<any[]>;

  background_url = "./assets/images/0.jpg";

  constructor(
    private storyService: StoryService,
    private collectionService: CollectionService
  ) {
    let date = Math.round((Date.now()/600000));
    this.background_url = "url(./assets/images/backgrounds/"+date%4+".jpg)";
    console.log(date%4);
    console.log(date);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.featuredStories = this.storyService.getXFeaturedStories(3);
    this.featuredStoriesMiddle = this.storyService.getXFeaturedStories(6);
    this.featuredStoriesLast = this.storyService.getXFeaturedStories(10);
    this.collections = this.collectionService.getCollections();
  }

}
