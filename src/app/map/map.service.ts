import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from "angularfire2/database";
import { Camp } from './map';

@Injectable()
export class MapService {

  campsUrl = "camps/"

  constructor(private db: AngularFireDatabase) { }

  addCamp(camp: Camp): Promise<any> {
    let db = this.db
    let campsUrl = this.campsUrl;
    return new Promise(function(resolve, reject) {
      db.list(campsUrl).push({
        'title': camp.title,
        'lat': camp.lat,
        'lng': camp.lng
      })
      .then(campObject => {
        resolve(campObject);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  removeCamp(key: String): Promise<any> {
    let db = this.db
    let campUrl = this.campsUrl + key;
    return new Promise(function(resolve, reject) {
      db.object(campUrl).remove()
      .then(x => {
        resolve("deleted");
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  getCamps(): FirebaseListObservable<Camp[]> {
    return this.db.list(this.campsUrl);
  }



}
