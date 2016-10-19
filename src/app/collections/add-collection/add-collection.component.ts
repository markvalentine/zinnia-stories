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

  uploaded: string;

  constructor(
    private adminService: AdminService,
    private collectionService: CollectionService,
  ) {
    this.collection = new Collection();
    this.isAuth = this.adminService.isAuth();
    this.isAdding = false;

    this.uploaded = "No upload in progress";
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

  changeListener(event) {
    let file = event.target.files[0];
    let progress = 0;
    let downloadURL = '';
    this.uploaded = progress+ '%';
    this.collectionService.uploadImage(file).subscribe(
      m => {
        console.log(m, progress);
        if (progress == 100) {
          downloadURL = m;
          this.uploaded = "finished uploading: " + downloadURL;
          this.collection.image_url = downloadURL;
        } else {
          progress = m;
          this.uploaded = progress+"%";
        }
      },
      err => this.uploaded = err+'',
      () => {
        // this.uploaded = 'upload complete';
      }
    )
    
  }

}
