var functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const LOCAL_TMP_FOLDER = '/tmp/';

// Max height and width to resize
const CARD_MAX_WIDTH = 800;
const STORY_MAX_WIDTH = 2048;
const COLLECTION_MAX_WIDTH = 2048;

/**
 * When an image is uploaded in the Storage bucket we resize it according to its type
 */
exports.resizeImages = functions.storage.object().onChange(event => {
  const object = event.data;
  const filePath = event.data.name;
  const filePathSplit = filePath.split('/');
  const fileName = filePathSplit.pop();
  const filePathSplitCopy = filePathSplit;
  const fileDir = filePathSplit.join('/') + (filePathSplit.length > 0 ? '/' : '');
  const fileType = filePathSplitCopy.pop();
  const tempLocalDir = `${LOCAL_TMP_FOLDER}${fileDir}`;
  const tempLocalFile = `${tempLocalDir}${fileName}`;

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }

  if ( object.metadata['resized'] ) {
    console.log('this object was already resized');
    return;
  }

  if ( fileType == 'stories' ) {
    console.log('quitting');
    return;
  }

  let maxWidth;
  switch (fileType) {
    case 'stories':
      maxWidth = STORY_MAX_WIDTH;
      break;
    case 'storycards':
      maxWidth = CARD_MAX_WIDTH;
      break;
    case 'collections':
      maxWidth = COLLECTION_MAX_WIDTH;
      break;
    default: 
      maxWidth = STORY_MAX_WIDTH;
  }

  // Exit if file exists but is not new and is only being triggered
  // because of a metadata change.
  if (event.datametageneration > 1) {
    console.log('This is a metadata change event.');
    return;
  }

  // Exit if this is triggered on a file that is not an image.
  if (!event.data.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return;
  }

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    const bucket = gcs.bucket(event.data.bucket);
    return bucket.file(filePath).download({
      destination: tempLocalFile
    }).then(() => {
      // Generate a thumbnail using ImageMagick.
      return spawn('mogrify', ['-path', tempLocalDir, '-filter', 'Triangle', '-define', 'filter:support=2.0', '-thumbnail',  maxWidth, '-unsharp', '0.25x0.25+8+0.065', '-dither', 'None', '-posterize', '136', '-quality', '82', '-define', 'jpeg:fancy-upsampling=off', '-define', 'png:compression-filter=5', '-define', 'png:compression-level=9', '-define', 'png:compression-strategy=1', '-define', 'png:exclude-chunk=all', '-interlace', 'none', '-colorspace', 'sRGB', '-strip', tempLocalFile]).then(() => {
        // Uploading the Thumbnail.
        return bucket.upload(tempLocalFile, {
          metadata: {
            'kind': object.kind,
            'resourceState': object.resourceState,
            'id': object.id,
            'selfLink': object.selfLink,
            'name': object.name,
            'generation': object.generation,
            'metageneration': object.metageneration,
            'contentType': object.contentType,
            'timeCreated': object.timeCreated,
            'updated': object.updated,
            'storageClass': object.storageClass,
            'mediaLink': object.mediaLink,
            'contentDisposition': object.contentDisposition,
            'metadata': {
              'firebaseStorageDownloadTokens': object.metadata['firebaseStorageDownloadTokens'],
              'resized': 'true'
            }
          },
          destination: filePath
        }).then(() => {
          console.log('Thumbnail uploaded to Storage at', filePath);
        });
      });
    });
  });
});