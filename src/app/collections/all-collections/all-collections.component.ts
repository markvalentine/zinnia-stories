import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-all-collections',
  templateUrl: './all-collections.component.html',
  styleUrls: ['./all-collections.component.css']
})
export class AllCollectionsComponent implements OnInit, OnDestroy {

  collections: FirebaseListObservable<any[]>;

  constructor(
    public router: Router,
    public collectionService: CollectionService
  ) {
    this.collections = this.collectionService.getCollections();
  }

  ngOnInit() {
  }

  ngOnDestroy(){

  }

  goToDetail(key: string) {
    let link = ['/collections', key];
    this.router.navigate(link);
  }

}
