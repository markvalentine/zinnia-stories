import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Story } from './story';

import { CollectionService } from '../collections/collection.service';
import { Collection } from '../collections/collection';

@Injectable()
export class StoryService {
  // Base URLS for firebase
  storiesUrl = 'stories/';
  collectionsUrl = 'collections/';
  featuredUrl = 'featured/';
  featuredStoriesUrl = 'featured_stories/';
  featuredCollectionsUrl = 'featured_collections/';
  imagesUrl = 'images/'

  // Default numbers for loading stories
  defaultNumStories = 10;
  defaultIncrement = 5;
  defaultNumFeaturedStories = 2;

  // Number of Stories loaded and BehaviorSubject for updating query
  numStories = this.defaultNumStories;
  storiesLimit: BehaviorSubject<number>;

  // Number of Stories loaded for a collection and BehaviorSubject for updating query
  numStoriesForCollection = this.defaultNumStories - 1;
  storiesForCollectionLimit: BehaviorSubject<number>;

  constructor(
    private af: AngularFire,
    private collectionService: CollectionService
  ) { }

  addStory(story: Story): Promise<any> {
    let date = new Date().getTime();
    let storiesRef = this.af.database.list(this.storiesUrl)
    return new Promise(function(resolve, reject) {
      storiesRef.push({
        'title': story.title,
        'description': story.description,
        'text': story.text,
        'image_url': story.image_url,
        'date_created': -date,
        'delta': story.delta
      })
        .then(story => {
          resolve(story.key);
        })
        .catch(err => reject(err));
    });  

    // if featured make featured
    // if featured in a collection do that
    // if in a collection not featured do that

  }

  addToCollection(story: Story, collection: Collection): Promise<any> {
    let ref = this.af.database.object(this.storiesUrl+story.$key+'/'+this.collectionsUrl+collection.$key);
    let collectionRef = this.af.database.object(this.collectionsUrl+collection.$key+'/'+this.storiesUrl+story.$key);
    let promisesReturned = 0;
    let promisesNeeded = 2;
    return new Promise(function(resolve, reject){
      ref.set(collection.title)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('added');
          }
        })
        .catch(err => reject(err));

      collectionRef.set(story.date_created)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('added');
          }
        })
        .catch(err => reject(err));
    });
  }

  featureInCollection(story: Story, collection: Collection): Promise<any> {
    let ref = this.af.database.object(this.storiesUrl+story.$key+'/'+this.featuredCollectionsUrl+collection.$key);
    let collectionRef = this.af.database.object(this.collectionsUrl+collection.$key+'/'+this.featuredStoriesUrl+story.$key);
    let promisesReturned = 0;
    let promisesNeeded = 2;
    return new Promise(function(resolve, reject){
      ref.set(collection.title)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('added');
          }
        })
        .catch(err => reject(err));

      collectionRef.set(story.date_created)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('added');
          }
        })
        .catch(err => reject(err));
    });
  }

  // Updates -> title, description, text
  updateStoryProperties(story: Story): Promise<any> {
    let storyRef = this.af.database.object(this.storiesUrl+story.$key);
    return new Promise(function(resolve, reject) {
      storyRef.update({
        'title': story.title,
        'description': story.description,
        'text': story.text
      })
        .then(_ => resolve('updated'))
        .catch(err => reject(err));
    });
  }

  updateStory(story: Story): Promise<any> {
    // TODO update everything
    return this.updateStoryProperties(story);
  }

  featureStory(story: Story) {
    let storyRef = this.af.database.object(this.storiesUrl+story.$key+'/'+this.featuredUrl);
    let featuredStoriesRef = this.af.database.object(this.featuredUrl+this.storiesUrl+story.$key);

    return new Promise(function(resolve, reject) {
      storyRef.set(true)
        .then(_ => {
          featuredStoriesRef.set(story.date_created)
            .then(_ => resolve('featured story '+story.$key))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  removeStoryFromFeaturedList(story: Story): Promise<any> {
    let featuredStories = this.af.database.list(this.featuredUrl+this.storiesUrl);
    return new Promise(function(resolve, reject) {
      featuredStories.remove(story.$key)
        .then(_ => resolve('removed from featured list'))
        .catch(err => reject(err));
    });
  }

  /**
   * maybe
   */
  unfeatureStory(story: Story) {
    let storyRef = this.af.database.object(this.storiesUrl+story.$key+'/'+this.featuredUrl);
    let featuredStoriesRef = this.af.database.object(this.featuredUrl+this.storiesUrl+story.$key);

    return new Promise(function(resolve, reject) {
      storyRef.set(false)
        .then(_ => {
          featuredStoriesRef.remove()
            .then(_ => resolve('featured story '+story.$key + 'unfeatured'))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  removeAllStoriesFromCollection(collection: Collection): Observable<any> {
    return Observable.create(subscriber => {
      for (let storyKey of collection.stories) {
        this.af.database.list(this.storiesUrl+storyKey+'/'+this.collectionsUrl).remove(collection.$key)
          .then(_ => subscriber.next('removed collection '+collection.$key+' from story '+storyKey))
          .catch(err => subscriber.error(err));
      }
      for (let storyKey of collection.featuredStories) {
        this.af.database.list(this.storiesUrl+storyKey+'/'+this.featuredCollectionsUrl).remove(collection.$key)
          .then(_ => subscriber.next('removed collection '+collection.$key+' from featured story '+storyKey))
          .catch(err => subscriber.error(err));
      }

      subscriber.complete('completed');
    })
  }

  /**
   * Removes the story from the collection and then removes the collection from the story
   * if deleting the story just use the collecition service (don't need to delete collection from story)
   */
  removeStoryFromCollection(storyKey: string, collectionKey: string): Promise<any> {
    let storyRef = this.af.database.list(this.storiesUrl+storyKey+'/'+this.collectionsUrl);
    let promise = this.collectionService.removeStoryFromCollection(storyKey, collectionKey);
    return new Promise(function(resolve, reject) {
      promise
        .then(_ => {
          storyRef.remove(collectionKey)
            .then(_ => resolve('removed story '+storyKey+' from collection '+collectionKey))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Removes the featured story from the collection and then removes the collection from the story
   * if deleting the story just use the collecition service (don't need to delete collection from story)
   */
  removeStoryFromFeaturedCollection(storyKey: string, collectionKey: string) {
    let storyRef = this.af.database.list(this.storiesUrl+storyKey+'/'+this.featuredCollectionsUrl);
    let promise = this.collectionService.removeFeaturedStoryFromCollection(storyKey, collectionKey);
    return new Promise(function(resolve, reject) {
      promise
        .then(_ => {
          storyRef.remove(collectionKey)
            .then(_ => resolve('removed story '+storyKey+' from collection '+collectionKey))
            .catch(err => reject(err));
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Deletes a given story
   * returns an observable that sends a list of messages with the status of the deletion
   * i.e. deleted from featured, deleted from colleciton, deleted from featured collections
   * finally deleted then completion
   * passes errors when errors occur
   */
  deleteStory(story: Story): Observable<any> {
    let storyRef = this.af.database.object(this.storiesUrl+story.$key);
    return Observable.create(subscriber => {
      if (story.featured) {
        this.removeStoryFromFeaturedList(story)
          .then(message => subscriber.next(message))
          .catch(err => subscriber.error(err));
      } else {
        subscriber.next('not featured');
      }

      for (let collectionKey of story.collections) {
        this.collectionService.removeStoryFromCollection(story.$key, collectionKey)
          .then(message => subscriber.next(message))
          .catch(err => subscriber.error(err));
      }

      for (let collectionKey of story.featuredCollections) {
        this.collectionService.removeFeaturedStoryFromCollection(story.$key, collectionKey)
          .then(message => subscriber.next(message))
          .catch(err => subscriber.error(err));
      }

      storyRef.remove()
        .then(_ => {
          subscriber.next('removed Story');
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
      
    });
  }

  /**
   * Gets a single story for the key passed in
   */
  getStory(key: string): Observable<Story> {
    let storyObservable = this.af.database.object(this.storiesUrl+key);
    return Observable.create(observer => {
      storyObservable.subscribe(x => {
        observer.next(new Story(x));
      });
    });
  }

  /**
   * Gets a single story for the key passed in
   */
  getStoryAsArray(key: string): Observable<Story[]> {
    let storyObservable = this.af.database.object(this.storiesUrl+key);
    return Observable.create(observer => {
      storyObservable.subscribe(x => {
        observer.next([new Story(x)]);
      });
    });
  }

  /**
   * Gets the first x featured story IDs
   * see global variable defaultNumFeaturedStories for number of IDs
   */
  getFeaturedStoryIDs(): FirebaseListObservable<string[]> {
    return this.af.database.list(this.featuredUrl+this.storiesUrl, {
      query: {
        orderByValue: true,
        // limitToFirst: this.defaultNumFeaturedStories
      }
    });
  }

  getXFeaturedStoryIDs(x: number): FirebaseListObservable<string[]> {
    return this.af.database.list(this.featuredUrl+this.storiesUrl, {
      query: {
        orderByValue: true,
        limitToFirst: x
      }
    });
  }

  getFeaturedStories(): Observable<any[]> {
    let storyIDs = this.getFeaturedStoryIDs();
    return Observable.create(subscriber => {
      storyIDs.subscribe(ids => {
        let stories = [];
        for (let id of ids) {
          stories.push(this.getStory(id['$key']));
        }
        subscriber.next(stories);
      });
    });
  }

  getXFeaturedStories(x: number): Observable<any[]> {
    let storyIDs = this.getXFeaturedStoryIDs(x);
    return Observable.create(subscriber => {
      storyIDs.subscribe(ids => {
        let stories = [];
        for (let id of ids) {
          stories.push(this.getStory(id['$key']));
        }
        subscriber.next(stories);
      });
    });
  }

  getFirstFeaturedStories() {

  }

  /**
   * Gets the first x stories sorted by date_created
   * numStories is optional number of stories to load
   * see numStories in global variables for default value
   * passing in undefined will load all stories (i think)
   * see function nextStories() for loading aditionalStories
   */
  getStories(numStories?: number): FirebaseListObservable<any[]> {
    if (numStories) { this.numStories = numStories }
    this.storiesLimit = new BehaviorSubject(this.numStories);
    return this.af.database.list(this.storiesUrl, {
      query: {
        orderByChild: 'date_created',
        limitToFirst: this.storiesLimit
      },
    });
  }

  /**
   * Gets the next x stories for function getStories()
   * increment is the optional number of additional stories to load
   * see defaultIncrement in global variables for default value
   * passing in undefined will load all stories (i think)
   */
  nextStories(increment?: number) {
    if (increment) { this.numStories += increment }
    else { this.numStories += this.defaultIncrement }
    if (this.storiesLimit) { this.storiesLimit.next(this.numStories) }
  }

  getStoryIDsForCollection(key: string): FirebaseListObservable<any[]> {
    console.log('limit')
    return this.af.database.list(this.collectionsUrl+key+'/'+this.storiesUrl, {
      query: {
        orderByValue: true,
        limitToFirst: this.storiesForCollectionLimit
      }
    })
  }

  // Remove the subsriber?
  getStoriesForCollection(key: string): Observable<any[]> {
    this.storiesForCollectionLimit = new BehaviorSubject(this.numStoriesForCollection);
    let storyIDs = this.getStoryIDsForCollection(key);
    return Observable.create(subscriber => {
      storyIDs.subscribe(ids => {
        let stories = [];
        for (let id of ids) {
          stories.push(this.getStory(id['$key']));
        }
        subscriber.next(stories);
      });
    });
  }

  nextStoriesForCollection(increment?: number) {
    if (increment) { this.numStoriesForCollection += increment }
    else { this.numStoriesForCollection += this.defaultIncrement }
    if (this.storiesForCollectionLimit) { this.storiesForCollectionLimit.next(this.numStoriesForCollection) }
  }

    // Only two?
  getFeaturedStoryIDsForCollection(key: string): FirebaseListObservable<any[]> {
    return this.af.database.list(this.collectionsUrl+key+'/'+this.featuredStoriesUrl, {
      query: {
        orderByValue: true
      }
    });
  }

  // Only two?
  getFeaturedStoriesForCollection(key: string): Observable<any[]> {
    let featuredStoryIDs = this.getFeaturedStoryIDsForCollection(key);
    return Observable.create(subscriber => {
      featuredStoryIDs.subscribe(ids => {
        let stories = [];
        for (let id of ids) {
          stories.push(this.getStory(id['$key']));
        }
        subscriber.next(stories);
      });
    });
  }

  uploadImage(file: any): Observable<any> {
    return Observable.create(subscriber => {
      this.af.database.list(this.imagesUrl+this.storiesUrl).push(file.name)
      .then(fileDBRef => {
        let key = fileDBRef.key;
        let uploadTask = firebase.storage().ref().child(this.imagesUrl+this.storiesUrl+key).put(file);
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

  getRelatedStories(collection: Collection, storyKey: string) {
    return Observable.create(subscriber => {
      let relatedKeys = [];
      let stories = [];
      for (let key of collection.featuredStories) {
        if (key != storyKey) relatedKeys.push(key);
      }
      relatedKeys.slice(0, 2);
      let otherStories = collection.stories;
      let indexOfStory = otherStories.indexOf(storyKey);
      if (indexOfStory > -1) {
        otherStories.splice(indexOfStory, 1);
      }
      relatedKeys = relatedKeys.concat(otherStories.slice(0, (2-relatedKeys.length)));
      
      for (let key of relatedKeys) {
        stories.push(this.getStory(key));
      }

      subscriber.next(stories);
    });
  }

}
