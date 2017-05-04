import { Injectable } from '@angular/core';
// import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Collection } from './collection';
import { Story } from '../stories/story';

@Injectable()
export class CollectionService {

  collectionsUrl = 'collections/'
  storiesUrl = 'stories/';
  featuredUrl = 'featured/';
  featuredStoriesUrl = 'featured_stories/';
  imagesUrl = 'images/';

  constructor(
    private af: AngularFireDatabase,
  ) { }

  /**
   * Add a collection
   * for now just adds the properties
   * need to implement featuring, adding stories
   */
  addCollection(collection: Collection): Promise<any> {
    let date = new Date().getTime();
    let collectionsRef = this.af.list(this.collectionsUrl)
    return new Promise(function(resolve, reject) {
      collectionsRef.push({
        'date_created': -date,
        'properties': {
          'title': collection.title,
          'description': collection.description,
          'image_url': collection.image_url
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
    let collectionRef = this.af.object(this.collectionsUrl+collection.$key);
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

  /**
   * CAN ONLY DELETE AN EMPTY COLLECTION
   * if the collection still has stories their references will not be removed
   * must use removeAllStoriesFromCollection in story service
   */
  deleteCollection(collection: Collection): Promise<any> {
    let collectionRef = this.af.object(this.collectionsUrl+collection.$key);
    return new Promise(function(resolve, reject) {
      collectionRef.remove()
        .then(_ => resolve('collection deleted'))
        .catch(err => reject(err));
    })
  }

  /**
   * SHOULD ONLY BE CALLED FROM STORY SERVICE: DOES NOT REMOVE THE COLLECTION FROM THE STORY
   * removes a story from the collection list given the storykey and the collectionkey
   */
  removeStoryFromCollection(storyKey: string, collectionKey: string): Promise<any> {
    let collectionRef = this.af.list(this.collectionsUrl+collectionKey+'/'+this.storiesUrl);
    return new Promise(function(resolve, reject) {
      collectionRef.remove(storyKey)
        .then(_ => {
          console.log('removed from collection '+collectionKey);
          resolve('removed from collection '+collectionKey)
        })
        .catch(err => reject(err));
    });
  }

  /**
   * SHOULD ONLY BE CALLED FROM STORY SERVICE: DOES NOT REMOVE THE COLLECTION FROM THE STORY
   * removes a featured story from the collection list given the storykey and the collectionkey
   */
  removeFeaturedStoryFromCollection(storyKey: string, collectionKey: string): Promise<any> {
    let collectionRef = this.af.list(this.collectionsUrl+collectionKey+'/'+this.featuredStoriesUrl);
    return new Promise(function(resolve, reject) {
      collectionRef.remove(storyKey)
        .then(_ => {
          console.log('removed featured story from collection '+collectionKey);
          resolve('removed featured story from collection '+collectionKey);
        })
        .catch(err => reject(err));
    });
  }

  getCollections(): FirebaseListObservable<any[]> {
    return this.af.list(this.collectionsUrl, {
      query: {
        orderByChild: 'date_created'
      }
    });
  }

  getCollection(key: string): FirebaseObjectObservable<any> {
    return this.af.object(this.collectionsUrl+key);
  }

  getCollectionProperties(key: string): FirebaseObjectObservable<any> {
    return this.af.object(this.collectionsUrl+key+'/properties');
  }

  getFeaturedCollectionIDs() {

  }

  getFeaturedCollections() {

  }

  uploadImage(file: any): Observable<any> {
    return Observable.create(subscriber => {
      this.af.list(this.imagesUrl+this.collectionsUrl).push(file.name)
      .then(fileDBRef => {
        let key = fileDBRef.key;
        let uploadTask = firebase.storage().ref().child(this.imagesUrl+this.collectionsUrl+key).put(file);
        uploadTask.on('state_changed', function(snapshot) {
          console.log(snapshot);
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress.toFixed(0));
          subscriber.next(progress.toFixed(0));
        }, function(err) {
          console.log(err);
          subscriber.error(err);
        }, function() {
          console.log('complete?');
          subscriber.next(uploadTask.snapshot.downloadURL);
          subscriber.complete(uploadTask.snapshot.downloadURL);
        })
      })
      .catch(err => subscriber.error(err));
    })
  }

}
