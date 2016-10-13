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
  collections: FirebaseListObservable<any[]>;

  constructor(
    private storyService: StoryService,
    private collectionService: CollectionService
  ) { }

  ngOnInit() {
    this.featuredStories = this.storyService.getXFeaturedStories(4);
    this.collections = this.collectionService.getCollections();
  }

}
