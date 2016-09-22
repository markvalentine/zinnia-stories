import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Collection } from './collection';

@Injectable()
export class CollectionService {

  collectionsUrl = 'collections/'
  storiesUrl = 'stories/';
  featuredUrl = 'featured/';


  constructor(public af: AngularFire) { }

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

  getStoryIDsForCollection() {

  }

  getStoriesForCollection() {

  }

  nextStoriesForCollection() {

  }

}
