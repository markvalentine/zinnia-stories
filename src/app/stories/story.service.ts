import { Injectable } from '@angular/core';
// import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from "angularfire2/database"
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Story, StoryCard } from './story';

import { CollectionService } from '../collections/collection.service';
import { Collection } from '../collections/collection';

import * as firebase from 'firebase';

@Injectable()
export class StoryService {
  // Base URLS for firebase
  storiesUrl = 'stories/';
  storycardsUrl = 'storycards/';
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

  // Number of Storycards loaded and BehaviorSubject for updating query
  numStorycards = this.defaultNumStories;
  storycardsLimit: BehaviorSubject<number>;

  // Number of Stories loaded for a collection and BehaviorSubject for updating query
  numStoriesForCollection = this.defaultNumStories - 1;
  storiesForCollectionLimit: BehaviorSubject<number>;

  // Number of storycards loaded for a collection and BehaviorSubject for updating query
  numStorycardsForCollection = this.defaultNumStories - 1;
  storycardsForCollectionLimit: BehaviorSubject<number>;

  constructor(
    private af: AngularFireDatabase,
    private collectionService: CollectionService
  ) { }

  addStory(story: Story, storycard_image: string): Promise<any> {
    let date = new Date().getTime();
    let storiesRef = this.af.list(this.storiesUrl)

    // let db = this.af.database;
    let db = this.af;
    let storycardsUrl = this.storycardsUrl;

    return new Promise(function(resolve, reject) {
      storiesRef.push({
        'title': story.title,
        'description': story.description,
        'text': story.text,
        'image_url': story.image_url,
        'show_image': story.show_image,
        'date_created': -date,
        'delta': story.delta
      })
        .then(storyObject => {
          console.log(storyObject)
          console.log(storyObject.key)
          let storycardRef = db.object(storycardsUrl+storyObject.key);
          storycardRef.set({
            'title': story.title,
            'description': story.description,
            'image_url': storycard_image,
            'date_created': -date,
          })
          .then(x => {
            resolve(storyObject.key);
          })
          .catch(err => reject(err));

        })
        .catch(err => reject(err));
    });  

    // if featured make featured
    // if featured in a collection do that
    // if in a collection not featured do that

  }

  addToCollection(story: Story, collection: Collection): Promise<any> {
    let ref = this.af.object(this.storiesUrl+story.$key+'/'+this.collectionsUrl+collection.$key);
    let cardRef = this.af.object(this.storycardsUrl+story.$key+'/'+this.collectionsUrl+collection.$key);
    let collectionRef = this.af.object(this.collectionsUrl+collection.$key+'/'+this.storiesUrl+story.$key);
    let promisesReturned = 0;
    let promisesNeeded = 3;
    return new Promise(function(resolve, reject){
      ref.set(collection.title)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('added');
          }
        })
        .catch(err => reject(err));

      cardRef.set(collection.title)
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
    let ref = this.af.object(this.storiesUrl+story.$key+'/'+this.featuredCollectionsUrl+collection.$key);
    let cardRef = this.af.object(this.storycardsUrl+story.$key+'/'+this.featuredCollectionsUrl+collection.$key);
    let collectionRef = this.af.object(this.collectionsUrl+collection.$key+'/'+this.featuredStoriesUrl+story.$key);
    let promisesReturned = 0;
    let promisesNeeded = 3;
    return new Promise(function(resolve, reject){
      ref.set(collection.title)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('added');
          }
        })
        .catch(err => reject(err));

      cardRef.set(collection.title)
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
    let storyRef = this.af.object(this.storiesUrl+story.$key);
    let cardRef = this.af.object(this.storycardsUrl+story.$key);

    let promisesReturned = 0;
    let promisesNeeded = 2;
    return new Promise(function(resolve, reject) {
      storyRef.update({
        'title': story.title,
        'description': story.description,
        'show_image': story.show_image,
        'text': story.text,
        'delta': story.delta
      })
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('updated');
          }
        })
        .catch(err => reject(err));

      cardRef.update({
        'title': story.title,
        'description': story.description,
      })
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('updated');
          }
        })
        .catch(err => reject(err));
    });
  }

  updateStory(story: Story): Promise<any> {
    // TODO update everything make this where you update the card maybe?
    return this.updateStoryProperties(story);
  }

  updateStoryImages(story: Story, storyUrl: string, cardUrl: string): Promise<any> {
    let storyRef = this.af.object(this.storiesUrl+story.$key);
    let cardRef = this.af.object(this.storycardsUrl+story.$key);
    
    let promisesReturned = 0;
    let promisesNeeded = 2;

    return new Promise(function(resolve, reject){
      storyRef.update({
        'image_url': storyUrl
      })
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) resolve('imags updated');
        })
        .catch(err => reject(err));

      cardRef.update({
        'image_url': cardUrl
      })
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) resolve('images updated'); 
        })
        .catch(err => reject(err));
    });
  }

  updateImagesAndDeleteOldImages(story: Story, storyUrl: string, cardUrl: string, oldStoryUrl: string, oldCardUrl: string): Promise<any> {
    let here = this;
    return new Promise(function(resolve, reject){
      here.updateStoryImages(story, storyUrl, cardUrl)
      .then(x => {
        here.deleteImages(oldStoryUrl, oldCardUrl)
          .then(x => resolve(x))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
    });
  }

  featureStory(story: Story) {
    let storyRef = this.af.object(this.storiesUrl+story.$key+'/'+this.featuredUrl);
    let cardRef = this.af.object(this.storycardsUrl+story.$key+'/'+this.featuredUrl);
    let featuredStoriesRef = this.af.object(this.featuredUrl+this.storiesUrl+story.$key);
    let date = new Date().getTime();

    let promisesReturned = 0;
    let promisesNeeded = 3;
    return new Promise(function(resolve, reject) {
      storyRef.set(true)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('featured story'+ story.$key);
          }
        })
        .catch(err => reject(err));

      cardRef.set(true)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('featured story'+ story.$key);
          }
        })
        .catch(err => reject(err));

      featuredStoriesRef.set(-date)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('featured story'+ story.$key);
          }
        })
        .catch(err => reject(err));

    });
  }

  removeStoryFromFeaturedList(story: Story): Promise<any> {
    let featuredStories = this.af.list(this.featuredUrl+this.storiesUrl);
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
    let storyRef = this.af.object(this.storiesUrl+story.$key+'/'+this.featuredUrl);
    let cardRef = this.af.object(this.storycardsUrl+story.$key+'/'+this.featuredUrl);
    let featuredStoriesRef = this.af.object(this.featuredUrl+this.storiesUrl+story.$key);

    let promisesReturned = 0;
    let promisesNeeded = 3;
    return new Promise(function(resolve, reject) {
      storyRef.set(false)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('featured story '+story.$key + 'unfeatured');
          }
        })
        .catch(err => reject(err));

      cardRef.set(false)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('featured story '+story.$key + 'unfeatured');
          }
        })
        .catch(err => reject(err));
      
      featuredStoriesRef.remove()
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('featured story '+story.$key + 'unfeatured');
          }
        })
        .catch(err => reject(err));
    });
  }

  removeAllStoriesFromCollection(collection: Collection): Observable<any> {
    return Observable.create(subscriber => {
      for (let storyKey of collection.stories) {
        this.af.list(this.storiesUrl+storyKey+'/'+this.collectionsUrl).remove(collection.$key)
          .then(_ => subscriber.next('removed collection '+collection.$key+' from story '+storyKey))
          .catch(err => subscriber.error(err));
      }
      for (let storyKey of collection.stories) {
        this.af.list(this.storycardsUrl+storyKey+'/'+this.collectionsUrl).remove(collection.$key)
          .then(_ => subscriber.next('removed collection '+collection.$key+' from storycard '+storyKey))
          .catch(err => subscriber.error(err));
      }
      for (let storyKey of collection.featuredStories) {
        this.af.list(this.storiesUrl+storyKey+'/'+this.featuredCollectionsUrl).remove(collection.$key)
          .then(_ => subscriber.next('removed collection '+collection.$key+' from featured story '+storyKey))
          .catch(err => subscriber.error(err));
      }
      for (let storyKey of collection.featuredStories) {
        this.af.list(this.storycardsUrl+storyKey+'/'+this.featuredCollectionsUrl).remove(collection.$key)
          .then(_ => subscriber.next('removed collection '+collection.$key+' from featured storycard '+storyKey))
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
    let storyRef = this.af.list(this.storiesUrl+storyKey+'/'+this.collectionsUrl);
    let cardRef = this.af.list(this.storycardsUrl+storyKey+'/'+this.collectionsUrl);
    let promise = this.collectionService.removeStoryFromCollection(storyKey, collectionKey);

    let promisesReturned = 0;
    let promisesNeeded = 3;
    return new Promise(function(resolve, reject) {
      promise
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('removed story '+storyKey+' from collection '+collectionKey);
          }
        })
        .catch(err => reject(err));

      storyRef.remove(collectionKey)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('removed story '+storyKey+' from collection '+collectionKey);
          }
        })
        .catch(err => reject(err));

      cardRef.remove(collectionKey)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('removed story '+storyKey+' from collection '+collectionKey);
          }
        })
        .catch(err => reject(err));
    });
  }

  /**
   * Removes the featured story from the collection and then removes the collection from the story
   * if deleting the story just use the collecition service (don't need to delete collection from story)
   */
  removeStoryFromFeaturedCollection(storyKey: string, collectionKey: string) {
    let storyRef = this.af.list(this.storiesUrl+storyKey+'/'+this.featuredCollectionsUrl);
    let cardRef = this.af.list(this.storycardsUrl+storyKey+'/'+this.featuredCollectionsUrl);
    let promise = this.collectionService.removeFeaturedStoryFromCollection(storyKey, collectionKey);

    let promisesReturned = 0;
    let promisesNeeded = 3;
    return new Promise(function(resolve, reject) {
      promise
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('removed story '+storyKey+' from collection '+collectionKey);
          }
        })
        .catch(err => reject(err));

      storyRef.remove(collectionKey)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('removed story '+storyKey+' from collection '+collectionKey);
          }
        })
        .catch(err => reject(err));

      cardRef.remove(collectionKey)
        .then(_ => {
          promisesReturned++;
          if (promisesReturned == promisesNeeded) {
            resolve('removed story '+storyKey+' from collection '+collectionKey);
          }
        })
        .catch(err => reject(err));
    });
  }

  deleteStoryCard(key): Promise<any> {
    let cardRef = this.af.object(this.storycardsUrl+key);
    return new Promise(function(resolve, reject) {
      cardRef.remove()
        .then(_ => resolve('storycard deleted'))
        .catch(err => reject(err));
    });
  }

  /**
   * Deletes a given story
   * returns an observable that sends a list of messages with the status of the deletion
   * i.e. deleted from featured, deleted from colleciton, deleted from featured collections
   * finally deleted then completion
   * passes errors when errors occur
   * TODO: DELETE IMAGES
   */
  deleteStory(story: Story): Observable<any> {
    let storyRef = this.af.object(this.storiesUrl+story.$key);
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

      this.deleteStoryCard(story.$key)
        .then(message => subscriber.next(message))
        .catch(err => subscriber.error(err));

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
    let storyObservable = this.af.object(this.storiesUrl+key);
    return Observable.create(observer => {
      storyObservable.subscribe(x => {
        observer.next(new Story(x));
      });
    });
  }

  /**
   * Gets a single storycard for the key passed in
   */
  getStoryCard(key: string): Observable<Story> {
    let storyObservable = this.af.object(this.storycardsUrl+key);
    return Observable.create(observer => {
      storyObservable.subscribe(x => {
        let storyCard = new StoryCard(x);
        observer.next(storyCard);
      });
    });
  }

  /**
   * Gets a single story for the key passed in
   */
  getStoryAsArray(key: string): Observable<Story[]> {
    let storyObservable = this.af.object(this.storiesUrl+key);
    return Observable.create(observer => {
      storyObservable.subscribe(x => {
        observer.next([new Story(x)]);
      });
    });
  }

  /**
   * Gets a single storycard for the key passed in
   */
  getStoryCardAsArray(key: string): Observable<Story[]> {
    let storyObservable = this.af.object(this.storycardsUrl+key);
    return Observable.create(observer => {
      storyObservable.subscribe(x => {
        let storyCard = new StoryCard(x);
        observer.next([storyCard]);
        console.log('? what')
        if (storyCard.image_url.includes("storage.cloud.google.com")) {
          let refUrl = "gs://" + storyCard.image_url.split("storage.cloud.google.com/").pop();
          firebase.storage().refFromURL(refUrl).getDownloadURL().then(url => {
            storyObservable.update({'image_url': url});
          })
          .catch(err => {
            
          })
        }
      });
    });
  }

  /**
   * Gets the first x featured story IDs
   * see global variable defaultNumFeaturedStories for number of IDs
   */
  getFeaturedStoryIDs(): FirebaseListObservable<string[]> {
    return this.af.list(this.featuredUrl+this.storiesUrl, {
      query: {
        orderByValue: true,
        // limitToFirst: this.defaultNumFeaturedStories
      }
    });
  }

  getXFeaturedStoryIDs(x: number): FirebaseListObservable<string[]> {
    return this.af.list(this.featuredUrl+this.storiesUrl, {
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

  getFeaturedStoryCards(): Observable<any[]> {
    let storyIDs = this.getFeaturedStoryIDs();
    return Observable.create(subscriber => {
      storyIDs.subscribe(ids => {
        let storycards = [];
        for (let id of ids) {
          storycards.push(this.getStoryCard(id['$key']));
        }
        subscriber.next(storycards);
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

  getXFeaturedStoryCards(x: number): Observable<any[]> {
    let storyIDs = this.getXFeaturedStoryIDs(x);
    return Observable.create(subscriber => {
      storyIDs.subscribe(ids => {
        let storycards = [];
        for (let id of ids) {
          storycards.push(this.getStoryCard(id['$key']));
        }
        subscriber.next(storycards);
      });
    });
  }

  getFirstFeaturedStories() {

  }

  getFirstFeaturedStoryCards() {

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
    return this.af.list(this.storiesUrl, {
      query: {
        orderByChild: 'date_created',
        limitToFirst: this.storiesLimit
      },
    });
  }

  /**
   * Gets the first x storycards sorted by date_created
   * numStorycards is optional number of stories to load
   * see numStorycards in global variables for default value
   * passing in undefined will load all stories (i think)
   * see function nextStoryCards() for loading aditionalStories
   */
  getStoryCards(numStorycards?: number): FirebaseListObservable<any[]> {
    if (numStorycards) { this.numStorycards = numStorycards }
    this.storycardsLimit = new BehaviorSubject(this.numStorycards);
    return this.af.list(this.storycardsUrl, {
      query: {
        orderByChild: 'date_created',
        limitToFirst: this.storycardsLimit
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

  /**
   * Gets the next x storycards for function getStorycards()
   * increment is the optional number of additional stories to load
   * see defaultIncrement in global variables for default value
   * passing in undefined will load all storycards (i think)
   */
  nextStorycards(increment?: number) {
    if (increment) { this.numStorycards += increment }
    else { this.numStorycards += this.defaultIncrement }
    if (this.storycardsLimit) { this.storycardsLimit.next(this.numStorycards) }
  }

  getStoryIDsForCollection(key: string): FirebaseListObservable<any[]> {
    return this.af.list(this.collectionsUrl+key+'/'+this.storiesUrl, {
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

   // Remove the subsriber?
  getStorycardsForCollection(key: string): Observable<any[]> {
    this.storycardsForCollectionLimit = new BehaviorSubject(this.numStorycardsForCollection);
    let storyIDs = this.getStoryIDsForCollection(key);
    return Observable.create(subscriber => {
      storyIDs.subscribe(ids => {
        let storycards = [];
        for (let id of ids) {
          storycards.push(this.getStoryCard(id['$key']));
        }
        subscriber.next(storycards);
      });
    });
  }

  nextStorycardsForCollection(increment?: number) {
    if (increment) { this.numStorycardsForCollection += increment }
    else { this.numStorycardsForCollection += this.defaultIncrement }
    if (this.storycardsForCollectionLimit) { this.storycardsForCollectionLimit.next(this.numStoriesForCollection) }
  }

    // Only two?
  getFeaturedStoryIDsForCollection(key: string): FirebaseListObservable<any[]> {
    return this.af.list(this.collectionsUrl+key+'/'+this.featuredStoriesUrl, {
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

  getFeaturedStoryCardsForCollection(key: string): Observable<any[]> {
    let featuredStoryIDs = this.getFeaturedStoryIDsForCollection(key);
    return Observable.create(subscriber => {
      featuredStoryIDs.subscribe(ids => {
        let storycards = [];
        for (let id of ids) {
          storycards.push(this.getStoryCard(id['$key']));
        }
        subscriber.next(storycards);
      });
    });
  }

  uploadImage(file: any, filename: string): Observable<any> {
    return Observable.create(subscriber => {
      this.af.list(this.imagesUrl+this.storiesUrl).push(filename)
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
          console.log('complete');
          subscriber.next(uploadTask.snapshot.downloadURL);
          subscriber.complete(uploadTask.snapshot.downloadURL);
        })
      })
      .catch(err => subscriber.error(err));
    })
  }

  uploadImageForCard(file: any, filename: string): Observable<any> {
    return Observable.create(subscriber => {
      this.af.list(this.imagesUrl+this.storycardsUrl).push(filename)
      .then(fileDBRef => {
        let key = fileDBRef.key;
        let uploadTask = firebase.storage().ref().child(this.imagesUrl+this.storycardsUrl+key).put(file);
        uploadTask.on('state_changed', function(snapshot) {
          console.log(snapshot);
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress.toFixed(0));
          subscriber.next(progress.toFixed(0));
        }, function(err) {
          console.log(err);
          subscriber.error(err);
        }, function() {
          console.log('complete');
          subscriber.next(uploadTask.snapshot.downloadURL);
          subscriber.complete(uploadTask.snapshot.downloadURL);
        })
      })
      .catch(err => subscriber.error(err));
    })
  }

  // delete image from firebase storage... wraps in a promise so we
  // dont have to import firebase promises everywhere ya feels?
  deleteImageFromUrl(url: string): Promise<any> {
    return new Promise(function(resolve, reject) {
      firebase.storage().refFromURL(url).delete()
      .then(x => resolve('image deleted'))
      .catch(err => reject(err))
    });
  }

  // delete both images from storage
  deleteImages(storyUrl: string, cardUrl: string): Promise<any> {
    let promisesReturned = 0;
    let promisesNeeded = 2;
    let here = this;

    return new Promise(function(resolve, reject){
      here.deleteImageFromUrl(storyUrl)
        .then(x => {
          promisesReturned++;
          if (promisesNeeded == promisesNeeded) resolve('images deleted');
        })
        .catch(err => {
          reject(err);
      });

      here.deleteImageFromUrl(cardUrl)
        .then(x => {
          promisesReturned++;
          if (promisesNeeded == promisesNeeded) resolve('images deleted');
        })
        .catch(err => {
          reject(err);
      })
    });
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

  getRelatedStoryCards(collection: Collection, storyKey: string) {
    return Observable.create(subscriber => {
      let relatedKeys = [];
      let storycards = [];
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
        storycards.push(this.getStoryCard(key));
      }

      subscriber.next(storycards);
    });
  }

}
