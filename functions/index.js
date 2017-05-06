var functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const LOCAL_TMP_FOLDER = '/tmp/';

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_WIDTH = 800;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.testingFunction = functions.https.onRequest((request, response) => {
 response.send("This should only deploy on the test site?");
});

exports.logImageUpload = functions.storage.object().onChange(event => {
    const object = event.data; // The Storage object.

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    console.log("object: ", object);
    console.log(fileBucket, filePath, contentType, resourceState, metageneration);

});

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
exports.generateThumbnail = functions.storage.object().onChange(event => {
  const filePath = event.data.name;
  const filePathSplit = filePath.split('/');
  const fileName = filePathSplit.pop();
  const fileDir = filePathSplit.join('/') + (filePathSplit.length > 0 ? '/' : '');
  const thumbFilePath = `${fileDir}${THUMB_PREFIX}${fileName}`;
  const tempLocalDir = `${LOCAL_TMP_FOLDER}${fileDir}`;
  const tempLocalFile = `${tempLocalDir}${fileName}`;
  const tempLocalThumbFile = `${LOCAL_TMP_FOLDER}${thumbFilePath}`;

  // Exit if this is triggered on a file that is not an image.
  if (!event.data.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return;
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    console.log('Already a Thumbnail.');
    return;
  }

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    const bucket = gcs.bucket(event.data.bucket);
    return bucket.file(filePath).download({
      destination: tempLocalFile
    }).then(() => {
      console.log('The file has been downloaded to', tempLocalFile);
      // Generate a thumbnail using ImageMagick.
      
      return spawn('convert', [tempLocalFile, tempLocalThumbFile]).then(() => {
          return spawn('mogrify', ['-path', tempLocalDir, '-filter', 'Triangle', '-define', 'filter:support=2.0', '-thumbnail', '800', '-unsharp', '0.25x0.25+8+0.065', '-dither', 'None', '-posterize', '136', '-quality', '82', '-define', 'jpeg:fancy-upsampling=off', '-define', 'png:compression-filter=5', '-define', 'png:compression-level=9', '-define', 'png:compression-strategy=1', '-define', 'png:exclude-chunk=all', '-interlace', 'none', '-colorspace', 'sRGB', '-strip', tempLocalThumbFile]).then(() => {
            console.log('Thumbnail created at', tempLocalThumbFile);
            // Uploading the Thumbnail.
            return bucket.upload(tempLocalThumbFile, {
            destination: thumbFilePath
            }).then(() => {
            console.log('Thumbnail uploaded to Storage at', thumbFilePath);
            });
          });
      });
    });
  });
});