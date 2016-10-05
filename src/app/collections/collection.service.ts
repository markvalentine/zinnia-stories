import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Collection } from './collection';
import { Story } from '../stories/story';

@Injectable()
export class CollectionService {

  collectionsUrl = 'collections/'
  storiesUrl = 'stories/';
  featuredUrl = 'featured/';
  featuredStoriesUrl = 'featuredStories/';

  constructor(
    private af: AngularFire,
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

  /**
   * Updates title and description for collection
   * returns promise for completion/err
   */
  updateCollectionProperties(collection: Collection): Promise<any> {
    let collectionRef = this.af.database.object(this.collectionsUrl+collection.$key);
    return new Promise(function(resolve, reject) {
      collectionRef.update({
        'title': collection.title,
        'description': collection.description
      })
        .then(_ => resolve('updated'))
        .catch(err => reject(err));
    });
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

  /**
   * SHOULD ONLY BE CALLED FROM STORY SERVICE: DOES NOT REMOVE THE COLLECTION FROM THE STORY
   * removes a story from the collection list given the storykey and the collectionkey
   */
  removeStoryFromCollection(storyKey: string, collectionKey: string): Promise<any> {
    let collectionRef = this.af.database.list(this.collectionsUrl+collectionKey+'/'+this.storiesUrl);
    return new Promise(function(resolve, reject) {
      collectionRef.remove(storyKey)
        .then(_ => resolve('removed from collection '+collectionKey))
        .catch(err => reject(err));
    });
  }

  /**
   * SHOULD ONLY BE CALLED FROM STORY SERVICE: DOES NOT REMOVE THE COLLECTION FROM THE STORY
   * removes a featured story from the collection list given the storykey and the collectionkey
   */
  removeFeaturedStoryFromCollection(storyKey: string, collectionKey: string): Promise<any> {
    let collectionRef = this.af.database.list(this.collectionsUrl+collectionKey+'/'+this.featuredStoriesUrl);
    return new Promise(function(resolve, reject) {
      collectionRef.remove(storyKey)
        .then(_ => resolve('removed featured story from collection '+collectionKey))
        .catch(err => reject(err));
    });
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

}
