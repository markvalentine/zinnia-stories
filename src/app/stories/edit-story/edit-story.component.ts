import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FirebaseListObservable } from 'angularfire2/database';
import { AdminService } from '../../admin/admin.service';
import { StoryService } from '../story.service';
import { Story } from '../story';
import { CollectionService } from '../../collections/collection.service';
import { Collection } from '../../collections/collection';

@Component({
  selector: 'app-edit-story',
  templateUrl: './edit-story.component.html',
  styleUrls: ['./edit-story.component.css']
})
export class EditStoryComponent implements OnInit {

  key: string;
  isAuth: any;
  story: Observable<Story[]>;
  storyObject: Story;

  collections: FirebaseListObservable<any[]>

  editorLoaded: boolean;

  imageUploaded = false;
  margin = "0";
  imageUrl = "";
  thumbnailUrl = "";

  uploaded: string;
  quill: any;
  readOnlyQuill: any;

  stringToEmbed = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storyService: StoryService,
    private collectionService: CollectionService,
    private adminService: AdminService
  ) { }

  /**
   * On Init: 
   * get key from params, get authentication from service, get story from service
   */
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.key = params['key'];
      this.isAuth = this.adminService.isAuth();
      this.story = this.storyService.getStoryAsArray(this.key);

      this.collections = this.collectionService.getCollections();
    });
    
    this.story.subscribe(x => {
      let timeout = setTimeout(() => {
        this.storyObject = x[0];
        this.imageUrl = this.storyObject.image_url;
        this.loadEditor(x[0]);
        clearTimeout(timeout);
      }, 500);
    });

    
  }

  loadEditor(storyObject: Story) {
    if (!this.editorLoaded) {
      this.editorLoaded = true;

      // var FontAttributor = Quill.import('attributors/class/font');
      // FontAttributor.whitelist = [
      //   'cormorant-garamond', 'milkshake'
      // ];
      // Quill.register(FontAttributor, true);

      // var toolbarOptions = [['bold', 'italic', 'underline', 'strike'], ['link', 'image']];
      var toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
        // [{ 'font': ['cormorant-garamond', 'serif', 'sans serif', 'monospace', 'milkshake'] }]                                         // remove formatting button
      ];

      this.quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        }
      });
      this.quill.setContents(storyObject.delta);
    }
  }

  featureStory(story: Story) {
    this.storyService.featureStory(story)
      .then(_ => this.goBack())
      .catch(err => console.log(err));
  }

  unfeatureStory(story: Story) {
    this.storyService.unfeatureStory(story)
      .then(_ => this.goBack())
      .catch(err => console.log(err));
  }

  /**
   * FOR NOW ONLY PROPERTIES
   * update story and wait for completion to navigate away
   */
  updateStory(story: Story) {
    var delta = this.quill.getContents();
    story.delta = delta;

    var text = this.quill.getText();
    story.text = text;

    console.log(story);

    this.storyService.updateStory(story)
      .then(_ => this.goBack())
      .catch(err => console.log(err));
  }

  embedHtml() {
    var range = this.quill.getSelection();
    if (range) {   
      this.quill.clipboard.dangerouslyPasteHTML(range.index, this.stringToEmbed);
      this.stringToEmbed = "";
      
      for (let index = 0; index < document.getElementsByClassName("ql-video").length; index++) {
        let src: string = document.getElementsByClassName("ql-video")[index]['src'];
        let type:string = document.getElementsByClassName("ql-video")[index]['type'];
        if (type != "button" && src.includes("soundcloud")) {
          document.getElementsByClassName("ql-video")[index].setAttribute("style", "height: auto");
        }
      }
    }
  }

  /**
   * deletes story and navigates to story list upon completion
   */
  deleteStory(story: Story) {
    let subscription = this.storyService.deleteStory(story).subscribe(
      message => console.log(message),
      err => console.log(err),
      () => {
        console.log('complete?');
        subscription.unsubscribe();
        let link = ['/stories'];
        this.router.navigate(link);
      }
    );
  }

  addToCollection(story: Story, collectionObject: any) {
    let collection = new Collection(collectionObject);
    this.storyService.addToCollection(story, collection)
      .then(x => console.log(x))
      .catch(err => console.log(err));
  }

  removeFromCollection(story: Story, collectionObject: any) {
    let collection = new Collection(collectionObject);
    this.storyService.removeStoryFromCollection(story.$key, collection.$key)
      .then(x => console.log(x))
      .catch(err => console.log(err));
  }

  featureInCollection(story: Story, collectionObject: any) {
    let collection = new Collection(collectionObject);
    this.storyService.removeStoryFromCollection(story.$key, collection.$key)
      .then(x => {
        this.storyService.featureInCollection(story, collection)
          .then(x => console.log(x))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  unfeatureInCollection(story: Story, collectionObject: any) {
    let collection = new Collection(collectionObject);
    this.storyService.removeStoryFromFeaturedCollection(story.$key, collection.$key)
      .then(x => {
        this.storyService.addToCollection(story, collection)
          .then(x => console.log(x))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  /**
   * redirects back to story
   */
  goBack(): void {
    let link = ['/stories', this.key];
    this.router.navigate(link);
  }

  changeListener(event) {
    let currentImage = this.storyObject.image_url;
    let currentThumbnail = this.storyService.getImageThumbnail(currentImage);

    let file = event.target.files[0];
    let progress = 0;
    let downloadURL = '';
    this.imageUploaded = false;
    this.margin = "20px 0";

    console.log(file.type.match(/image.*/));

    var here = this;

    this.resizeImage(2048, file)
    .then(function (resizedImage) {
      console.log("upload resized image")
      console.log(resizedImage);

      here.storyService.uploadImage(resizedImage, file.name).subscribe(
      m => {
        console.log(m, progress);
        if (progress == 100) {
          downloadURL = m;
          here.uploaded = "finished uploading: " + downloadURL;
          // here.story.image_url = downloadURL;
          
          here.thumbnailUrl = here.storyService.getImageThumbnail(downloadURL);
          
          here.storyService.updateStoryImages(here.storyObject, here.imageUrl, here.thumbnailUrl, currentImage, currentThumbnail).then(x => {
            here.imageUrl = downloadURL;
            here.imageUploaded = true;
            here.margin = "0";
          })


        } else {
          progress = m;
          here.uploaded = progress+"%";
        }
      },
      // err => this.uploaded = err+'',
      err => console.log(err),
      () => {
        // this.uploaded = 'upload complete';
      }
    );

    }).catch(function (err) {
      console.error(err);
    });
    
  }

  resizeImage(maxSize: number, file: File) {
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');
    
    const dataURItoBlob = (dataURI: string) => {
    var BASE64_MARKER = ';base64,';
    if (dataURI.indexOf(BASE64_MARKER) == -1) {
          var parts = dataURI.split(',');
          var contentType = parts[0].split(':')[1];
          var raw = parts[1];

          return new Blob([raw], {type: contentType});
    }

    var parts = dataURI.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], {type: contentType});
    };

    const resize = () => {

    let width = image.width;
    let height = image.height;

    if (width > height) {
        if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
        }
    } else {
        if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
        }
    }

    console.log("width and height: ", width, height);

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    let dataUrl = canvas.toDataURL('image/jpeg');
    // return canvas.toDataURL('image/jpeg');
    return dataURItoBlob(dataUrl);
  };

  return new Promise((ok, no) => {
      if (!file.type.match(/image.*/)) {
        no(new Error("Not an image"));
        return;
      }

      reader.onload = (readerEvent: any) => {
        image.onload = () => ok(resize());
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    })    
  };

}
