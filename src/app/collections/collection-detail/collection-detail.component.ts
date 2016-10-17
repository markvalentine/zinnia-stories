import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { AdminService } from '../../admin/admin.service';
import { StoryService } from '../../stories/story.service';
import { CollectionService } from '../collection.service';
import { Collection } from '../collection';

@Component({
  selector: 'app-collection-detail',
  templateUrl: './collection-detail.component.html',
  styleUrls: ['./collection-detail.component.css']
})
export class CollectionDetailComponent implements OnInit {

  key: string;
  isAuth: any;
  collectionProperties: FirebaseObjectObservable<any>;
  storyIDs: FirebaseListObservable<any[]>;
  stories: Observable<any[]>;

  featuredStoryIDs: FirebaseListObservable<any[]>;
  featuredStories: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private storyService: StoryService,
    private adminService: AdminService
  ) { }

  /**
   * On Init: 
   * get key from params, get authentication from service, get story from service
   */
  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.params.forEach((params: Params) => {
      this.key = params['key'];
      this.isAuth = this.adminService.isAuth();
      this.collectionProperties = this.collectionService.getCollectionProperties(this.key);
      this.storyIDs = this.storyService.getStoryIDsForCollection(this.key);
      this.stories = this.storyService.getStoriesForCollection(this.key);

      this.featuredStoryIDs = this.storyService.getFeaturedStoryIDsForCollection(this.key);
      this.featuredStories = this.storyService.getFeaturedStoriesForCollection(this.key);
    });
  }

  /**
   * redirects to edit page for this story
   */
  toEdit(): void {
    let link = ['/edit-collection', this.key];
    this.router.navigate(link);
  }

}
