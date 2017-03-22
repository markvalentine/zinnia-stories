import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { StoryService} from '../story.service';
import { Story } from '../story';
import { CollectionService} from '../../collections/collection.service';
import { Collection } from '../../collections/collection';
import { Router } from '@angular/router';

@Component({
  selector: 'app-related-stories',
  templateUrl: './related-stories.component.html',
  styleUrls: ['./related-stories.component.css']
})
export class RelatedStoriesComponent implements OnInit {
  @Input()
  collectionKey: string;

  @Input()
  storyKey: string;

  collection: Collection;

  shouldDisplay = true;

  relatedStories: Observable<any>;

  constructor(
    private storyService: StoryService,
    private collectionService: CollectionService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.collectionKey == undefined) {
      this.shouldDisplay = false;
      this.relatedStories = this.storyService.getXFeaturedStories(2);
    }
    this.collectionService.getCollection(this.collectionKey).subscribe(collectionString => {
      this.collection = new Collection(collectionString);
      this.relatedStories = this.storyService.getRelatedStories(this.collection, this.storyKey);
      this.relatedStories.subscribe(x => {
        if (x.length < 1) {
          this.shouldDisplay = false;
        }
      })
    }); 
  }

  /**
   * navigate to the detail page
   * called by clicking on a story card in template
   */
  goToCollection() {
    let link = ['/collections', this.collectionKey];
    this.router.navigate(link);
  }

}
