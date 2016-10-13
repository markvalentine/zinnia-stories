import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { Subscription } from 'rxjs/Subscription';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-all-collections',
  templateUrl: './all-collections.component.html',
  styleUrls: ['./all-collections.component.css']
})
export class AllCollectionsComponent implements OnInit, OnDestroy {

  collections: FirebaseListObservable<any[]>;

  constructor(
    private collectionService: CollectionService
  ) {
    this.collections = this.collectionService.getCollections();
  }

  ngOnInit() {
  }

  ngOnDestroy(){

  }

}
