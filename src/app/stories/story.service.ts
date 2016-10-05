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
  featuredCollectionsUrl = 'featured_collections/';

  // Default numbers for loading stories
  defaultNumStories = 20;
  defaultIncrement = 10;
  defaultNumFeaturedStories = 2;

  // Number of Stories loaded and BehaviorSubject for updating query
  numStories = this.defaultNumStories;
  storiesLimit: BehaviorSubject<number>;

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
        'date_created': -date
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

  featureStory() {

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
  unfeatureStory() {
    
  }

  featureInCollection() {

  }

  removeStoryFromCollection(storyKey: string, collectionKey: string): Promise<any> {
    let storyRef = this.af.database.list(this.storiesUrl+storyKey+'/'+this.collectionsUrl);
    let promise = this.collectionService.removeStoryFromCollection(storyKey, collectionKey)
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

  removeStoryFromFeaturedCollection(storyKey: string, collectionKey: string) {
    let storyRef = this.af.database.list(this.storiesUrl+storyKey+'/'+this.featuredCollectionsUrl);
    let promise = this.collectionService.removeFeaturedStoryFromCollection(storyKey, collectionKey)
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
    return this.af.database.list(this.featuredUrl+'stories', {
      query: {
        orderByValue: true,
        limitToFirst: this.defaultNumFeaturedStories
      }
    });
  }

  /**
   * Get the first x featured stories
   * I think this function could probably use a lot of work
   */
  getFeaturedStories() {
    //get observable of featuredIds
    let featuredIDsObserver = this.getFeaturedStoryIDs();

    //create the observable i think we return
    Observable.create(observer => {
      // subscribe to the ids

      // we'll need to unsubscribe from this?
      featuredIDsObserver.subscribe(ids => {

        let featuredStories = [];
        let featuredIDs = [];

        let numIDs = ids.length;
        let numLoaded = 0;

        // for each id returned
        for (let thisID of ids) {
          //get id and push to id array
          let id = thisID['$key'];
          featuredIDs.push(id);

          // subscribe to the story for the id
          // maybe keep an array of subscribers and unsubscribe and resubscribe when we have to?
          this.getStory(id).subscribe(story => {
            //add into array (probably buggy)
            let indexOfStory = featuredIDs.indexOf(id)
            featuredStories.splice(indexOfStory, 1, story);
            numLoaded++;

            // observe when all loaded
            if (numLoaded == numIDs) {observer.next(featuredStories)}
          }, err => {
            numIDs--;
            if (numLoaded == numIDs) { observer.next(featuredStories) }
          });
        }
      });
    });
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
    return this.af.database.list(this.collectionsUrl+key+'/'+this.storiesUrl, {
      query: {
        orderByValue: true
      }
    })
  }

  // Remove the subsriber?
  getStoriesForCollection(key: string): Observable<any[]> {
    let storyIDs = this.getStoryIDsForCollection(key);
    return Observable.create(subscriber => {
      storyIDs.subscribe(ids => {
        let stories = [];
        for (let id of ids) {
          stories.push(this.getStory(id['$key']));
        }
        subscriber.next(stories);
      })
    })
  }

  nextStoriesForCollection() {
    
  }

    // Only two?
  getFeaturedStoryIDsForCollection() {

  }

  // Only two?
  getFeaturedStoriesForCollection() {

  }

}
