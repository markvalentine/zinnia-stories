export class Story {

    $key: string;
    date_created: number;

    title: string;
    description: string;
    text: string;
    featured: boolean;

    image_url: string;
    show_image: boolean;

    featuredCollections: string[];
    featuredCollectionsObject: any;
    collections: string[];
    collectionsObject: any;

    delta: any;

    lng: number;
    lat: number;
    place: string;

    //Maybe we have a array of ids and also the object so we can get the name as the value??

    /**
     * takes optional json string (returned by firebase) to make story
     * otherwise creates empty story object
     */
    constructor(json?: string) {
        if (json) {
            this.parseJSON(json);
        } else {
            this.emptyStory();
        }
    }

    /**
     * empty the story object
     */
    emptyStory() {
        this.$key = null;
        this.date_created = 0;

        this.title = "";
        this.description = "";
        this.text = "";
        this.featured = false;

        this.image_url = "";
        this.show_image = true;

        this.featuredCollections = [];
        this.featuredCollectionsObject = {};
        this.collections = [];
        this.collectionsObject = {};

        this.delta = null;

        this.lng = null;
        this.lat = null;
        this.place = ""
    }

    /**
     * take json object of { string: any } and convert to string[]
     * for converting keys objects to arrays for iteration
     */
    getKeysFromJSONObject(object: any): string[] {
        if (object) {
            return Object.keys(object);
        } else {
            return [];
        }
    }

    /**
     * parse the json object returned by firebase
     */
    parseJSON(json: string) {
        this.$key = json['$key'];
        this.date_created = json['date_created'];

        this.title = json['title'];
        this.description = json['description'];
        this.text = json['text'];
        this.featured = json['featured'];

        this.image_url = json['image_url'];
        this.show_image = json['show_image'];

        this.featuredCollectionsObject = json['featured_collections'];
        this.featuredCollections = this.getKeysFromJSONObject(json['featured_collections']);
        this.collectionsObject = json['collections'];
        this.collections = this.getKeysFromJSONObject(json['collections']);

        this.delta = json['delta'];

        this.lng = +json['lng'];
        this.lat = +json['lat'];
        this.place = json['place'];
    }

}

export class StoryCard {

    $key: string;
    date_created: number;

    title: string;
    description: string;
    featured: boolean;

    image_url: string;

    featuredCollections: string[];
    featuredCollectionsObject: any;
    collections: string[];
    collectionsObject: any;

    lng: number;
    lat: number;
    place: string;

    /**
     * takes optional json string (returned by firebase) to make story
     * otherwise creates empty story object
     */
    constructor(json?: string) {
        if (json) {
            this.parseJSON(json);
        } else {
            this.emptyStory();
        }
    }

    /**
     * empty the story object
     */
    emptyStory() {
        this.$key = null;
        this.date_created = 0;

        this.title = "";
        this.description = "";
        this.featured = false;

        this.image_url = "";

        this.featuredCollections = [];
        this.featuredCollectionsObject = {};
        this.collections = [];
        this.collectionsObject = {};

        this.lng = null;
        this.lat = null;
        this.place = "";
    }

    /**
     * take json object of { string: any } and convert to string[]
     * for converting keys objects to arrays for iteration
     */
    getKeysFromJSONObject(object: any): string[] {
        if (object) {
            return Object.keys(object);
        } else {
            return [];
        }
    }

    /**
     * parse the json object returned by firebase
     */
    parseJSON(json: string) {
        this.$key = json['$key'];
        this.date_created = json['date_created'];

        this.title = json['title'];
        this.description = json['description'];
        this.featured = json['featured'];

        this.image_url = json['image_url'];

        this.featuredCollectionsObject = json['featured_collections'];
        this.featuredCollections = this.getKeysFromJSONObject(json['featured_collections']);
        this.collectionsObject = json['collections'];
        this.collections = this.getKeysFromJSONObject(json['collections']);

        this.lng = +json['lng'];
        this.lat = +json['lat'];
        this.place = json['place'];
    }

}