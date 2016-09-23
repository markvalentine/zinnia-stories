import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Collection } from './collection';
import { StoryService } from '../stories/story.service';
import { Story } from '../stories/story';

@Injectable()
export class CollectionService {

  collectionsUrl = 'collections/'
  storiesUrl = 'stories/';
  featuredUrl = 'featured/';

  constructor(
    private af: AngularFire,
    private storyService: StoryService
  ) { }

  /**
   * Add a collection
   * for now just adds the properties
   * need to implement featuring, adding stories
   */
  addCollection(collection: Collection): Promise<any> {
    let date = new Date().getTime();
    let collectionsRef = this.af.database.list(this.collectionsUrl)
    return new Promise(function(resolve, reject) {
      collectionsRef.push({
        'date_created': -date,
        'properties': {
          'title': collection.title,
          'description': collection.description
        }
      })
      .then(_ => resolve('added'))
      .catch(err => reject(err));
    });  

    // if featured make featured
    // if has stories do that
    // if has featured stories do that

  }

  addStoryToCollection() {

  }

  updateCollectionProperties() {

  }

  updateCollection() {

  }

  featureCollection() {

  }

  unfeatureCollection() {

  }

  featureStoryInCollection() {

  }

  deleteCollection() {

  }

  getCollections(): FirebaseListObservable<any[]> {
    return this.af.database.list(this.collectionsUrl, {
      query: {
        orderByChild: 'date_created'
      }
    });
  }

  getCollection(key: string): FirebaseObjectObservable<any> {
    return this.af.database.object(this.collectionsUrl+key);
  }

  getCollectionProperties(key: string): FirebaseObjectObservable<any> {
    return this.af.database.object(this.collectionsUrl+key+'/properties');
  }

  getFeaturedCollectionIDs() {

  }

  getFeaturedCollections() {

  }

  // Only two?
  getFeaturedStoryIDsForCollection() {

  }

  // Only two?
  getFeaturedStoriesForCollection() {

  }

  getStoryIDsForCollection(key: string): FirebaseListObservable<any[]> {
    return this.af.database.list(this.collectionsUrl+key+'/'+this.storiesUrl, {
      query: {
        orderByValue: true
      }
    })
  }

  getStoriesForCollection(key: string): Observable<any[]> {
    let storyIDs = this.getStoryIDsForCollection(key);
    return Observable.create(subscriber => {
      storyIDs.subscribe(ids => {
        let stories = [];
        for (let id of ids) {
          stories.push(this.storyService.getStory(id['$key']))
          // this.getCollection(id['$key']).subscribe(story => {
          //   collections.push(story);
          //   console.log(story);
          //   if (collections.length == ids.length) {
          //     subscriber.next(collections);
          //   }
          // })
          // collections.push(this.getCollection(id['$key']));
        }
        subscriber.next(stories);
      })
    })
  }

  nextStoriesForCollection() {

  }

}
