import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../admin/admin.service';
import { StoryService } from '../story.service';
import { Story } from '../story';

@Component({
  selector: 'app-add-story',
  templateUrl: './add-story.component.html',
  styleUrls: ['./add-story.component.css']
})
export class AddStoryComponent implements OnInit {
  
  story: Story;
  storyPreview: Story;
  isAuth: any;
  isAdding: boolean;
  editorLoaded: boolean;

  uploaded: string;
  imageUploaded = false;
  margin = "0";
  imageUrl = "";
  quill: any;
  readOnlyQuill: any;

  stringToEmbed = "";

  constructor(
    private router: Router,
    private adminService: AdminService,
    private storyService: StoryService
  ) {
    this.story = new Story();
    this.storyPreview = new Story();
    this.isAuth = this.adminService.isAuth();
    this.isAdding = false;
    this.editorLoaded = false;

    this.uploaded = "no upload in progress";
  }

  ngOnInit() {
    let timeout = setTimeout(() => {
      this.loadEditor();
      clearTimeout(timeout);
    }, 750);
  }

  loadEditor() {
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
        },
        placeholder: "Compose your magnum opus here..."
      });
    }
  }

  previewStory() {
    this.getDelta();
    this.getText();
    this.storyPreview = this.story;
    var tempCont = document.getElementById('delta');
    (new Quill(tempCont, {readOnly: true})).setContents(this.story.delta);
    tempCont.getElementsByClassName("ql-editor")[0].setAttribute("style", "padding: 0;");
    this.fixSoundCloud();
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
  }

  getDelta() {
    var delta = this.quill.getContents();
    this.story.delta = delta;
  }

  getText() {
    var text = this.quill.getText();
    this.story.text = text;
  }

  resetForm() {
    this.story = new Story();
    this.quill.setContents([]);
    this.isAdding = false;
  }

  embedHtml() {
    var range = this.quill.getSelection();
    if (range) {   
      this.quill.clipboard.dangerouslyPasteHTML(range.index, this.stringToEmbed);
      this.stringToEmbed = "";
      this.fixSoundCloud();
    }
  }

  fixSoundCloud() {
    for (let index = 0; index < document.getElementsByClassName("ql-video").length; index++) {
        let src: string = document.getElementsByClassName("ql-video")[index]['src'];
        let type:string = document.getElementsByClassName("ql-video")[index]['type'];
        if (type != "button" && src.includes("soundcloud")) {
          document.getElementsByClassName("ql-video")[index].setAttribute("style", "height: auto");
        }
      }
  }

  // only does title, description, text for now
  addStory() {
    this.isAdding = true;
    var delta = this.quill.getContents();
    this.story.delta = delta;
    this.getText();
    this.storyService.addStory(this.story, this.story.image_url)
      .then(key => {
        this.resetForm()
        let link = ['/stories/'+key];
        this.router.navigate(link);
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
    this.imageUploaded = false;
    this.margin = "20px 0";

    console.log(file.type.match(/image.*/));

    // var reader = new FileReader();
    //     reader.onload = function (readerEvent) {
    //         var image = new Image();
    //         image.onload = function (imageEvent) {

    //             // Resize the image
    //             var canvas = document.createElement('canvas'),
    //                 max_size = 544,// TODO : pull max size from a site config
    //                 width = image.width,
    //                 height = image.height;
    //             if (width > height) {
    //                 if (width > max_size) {
    //                     height *= max_size / width;
    //                     width = max_size;
    //                 }
    //             } else {
    //                 if (height > max_size) {
    //                     width *= max_size / height;
    //                     height = max_size;
    //                 }
    //             }
    //             canvas.width = width;
    //             canvas.height = height;
    //             canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    //             var dataUrl = canvas.toDataURL('image/jpeg');
    //             var resizedImage = dataURLToBlob(dataUrl);
    //             $.event.trigger({
    //                 type: "imageResized",
    //                 blob: resizedImage,
    //                 url: dataUrl
    //             });
    //         }
    //         image.src = readerEvent.target.result;
    //     }
    //     reader.readAsDataURL(file);


    // this.storyService.uploadImage(file).subscribe(
    //   m => {
    //     console.log(m, progress);
    //     if (progress == 100) {
    //       downloadURL = m;
    //       this.uploaded = "finished uploading: " + downloadURL;
    //       this.story.image_url = downloadURL;
    //       this.imageUrl = downloadURL;
    //       this.imageUploaded = true;
    //       this.margin = "0";
    //     } else {
    //       progress = m;
    //       this.uploaded = progress+"%";
    //     }
    //   },
    //   err => this.uploaded = err+'',
    //   () => {
    //     // this.uploaded = 'upload complete';
    //   }
    // );

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
          here.story.image_url = downloadURL;
          here.imageUrl = downloadURL;
          here.imageUploaded = true;
          here.margin = "0";
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
