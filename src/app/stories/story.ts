export class Story {

    $key: string;
    date_created: number;

    title: string;
    description: string;
    text: string;
    featured: boolean;

    featuredCollections: string[];
    featuredCollectionsObject: any;
    collections: string[];
    collectionsObject: any;

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

        this.featuredCollections = [];
        this.featuredCollectionsObject = {};
        this.collections = [];
        this.collectionsObject = {};
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

        this.featuredCollectionsObject = json['featured_collections'];
        this.featuredCollections = this.getKeysFromJSONObject(json['featured_collections']);
        this.collectionsObject = json['collections'];
        this.collections = this.getKeysFromJSONObject(json['collections']);
    }

}