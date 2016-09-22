import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Story } from './story';

@Injectable()
export class StoryService {
  // Base URLS for firebase
  storiesUrl = 'stories/';
  featuredUrl = 'featured/';

  // Default numbers for loading stories
  defaultNumStories = 20;
  defaultIncrement = 10;
  defaultNumFeaturedStories = 2;

  // Number of Stories loaded and BehaviorSubject for updating query
  numStories = this.defaultNumStories;
  storiesLimit: BehaviorSubject<number>;

  constructor(private af: AngularFire) { }

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
      .then(_ => resolve('added'))
      .catch(err => reject(err));
    });  

    // if featured make featured
    // if featured in a collection do that
    // if in a collection not featured do that

  }

  addStoryToCollection() {

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

  /**
   * maybe
   */
  unfeatureStory() {
    
  }

  featureStoryInCollection() {

  }

  /**
   * Deletes a story given a reference to the story and its key
   * reference should be the same given by function getStory()
   * checks to see if the story is featured and deletes it from there as well
   * 
   * will need to be updated to check if it is in a collection/featured in collection
   * 
   * returns a promise that resolves when all delete actions are finished
   * could be changed to an observable that returns messages with the progress of deletion
   * and then completes when the object is fully removed from the db
   */
  deleteStory(key: string): Promise<any> {
    let featuredStories = this.af.database.list(this.featuredUrl+this.storiesUrl);
    let story = this.af.database.object(this.storiesUrl+key);
    return new Promise(function(resolve, reject) {
      //change so it waits here too
      story.remove();
      featuredStories.remove(key)
        .then(_ => resolve('deleted'))
        .catch(err => reject(err));
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

}
