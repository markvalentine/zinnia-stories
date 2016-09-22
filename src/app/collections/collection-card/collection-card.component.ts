import { Component, Input, OnInit } from '@angular/core';
import { Collection } from '../collection';

@Component({
  selector: 'app-collection-card',
  templateUrl: './collection-card.component.html',
  styleUrls: ['./collection-card.component.css']
})
export class CollectionCardComponent implements OnInit {
  @Input()
  collectionString: string;

  collection: Collection

  constructor() { }

  ngOnInit() {
    this.collection = new Collection(this.collectionString);
  }

}
