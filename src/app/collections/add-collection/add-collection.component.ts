import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin/admin.service';
import { CollectionService } from '../collection.service';
import { Collection } from '../collection';

@Component({
  selector: 'app-add-collection',
  templateUrl: './add-collection.component.html',
  styleUrls: ['./add-collection.component.css']
})
export class AddCollectionComponent implements OnInit {

  collection: Collection;
  isAuth: any;
  isAdding: boolean;

  constructor(
    public adminService: AdminService,
    public collectionService: CollectionService,
  ) {
    this.collection = new Collection();
    this.isAuth = this.adminService.isAuth();
    this.isAdding = false;
  }

  ngOnInit() {
  }

  resetForm() {
    this.collection = new Collection();
    this.isAdding = false;
  }

  // only does title, description, text for now
  addCollection() {
    this.isAdding = true;
    
    this.collectionService.addCollection(this.collection)
    .then(_ => {
      this.resetForm()
    })
    .catch(err => {
      console.log(err);
      this.isAdding = false;
    });
  }

}
