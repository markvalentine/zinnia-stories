import { Injectable } from '@angular/core';
import { Jsonp, URLSearchParams } from '@angular/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class InstagramService {

  client_id = '4ead757ef25d4a3fb66f22ac73a368df';
  client_secret = '4b3ba6cacd484699ae3a94ef27e84b3b';
  userid = 'ramblinstories';

  token = '3629662834.4ead757.48ef4cb3eee649db891c788361aed2cc';

  constructor(
    private jsonp: Jsonp,
    private http: Http
  ) { }

  get() {
    let url = 'https://api.instagram.com/v1/users/self/media/recent';
    let options = new RequestOptions()
    // return this.http.get(url, {'access_token': this.token, 'count': '10'})
  }

  getInsta() {
    let url = 'https://api.instagram.com/v1/users/self/media/recent';
    // {access_token: token, count: 10};
    let params = new URLSearchParams();
    params.set('access_token', this.token); // the user's search value
    // params.set('count', '20');
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    return this.jsonp
               .get(url, { search: params })
               .map(response => <string[]> response.json());
  }

}