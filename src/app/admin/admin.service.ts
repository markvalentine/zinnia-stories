import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription'

@Injectable()
export class AdminService implements OnDestroy {

  authSubscription: Subscription;

  constructor(private af: AngularFire) {}

  /**
   * unsubscribe from the authentication
   */
  ngOnDestroy() {
    if ( this.authSubscription ) {
      console.log('now we unsubscribe');
      this.authSubscription.unsubscribe();
    }
  }

  /**
   * returns an observable with the auth status of the user
   */
  isAuth(): Observable<boolean> {
    return Observable.create(observer => {
      this.authSubscription = this.af.auth.subscribe(auth => {
        if (auth) {
          observer.next(true);
        } else {
          observer.next(false);
        }
      });
    });
    
  }
}