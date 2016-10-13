import { Component, Input, OnInit } from '@angular/core';
import { Collection } from '../collection';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.css']
})
export class CollectionCardComponent implements OnInit {
  @Input()
  collectionString: string;

  collection: Collection

  constructor(
    private router: Router
    ) { }

  ngOnInit() {
    this.collection = new Collection(this.collectionString);
  }

  goToDetail(key: string) {
    let link = ['/collections', key];
    this.router.navigate(link);
  }

}
