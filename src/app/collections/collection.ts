export class Collection {

    $key: string;
    date_created: number;

    //properties
    title: string;
    description: string;
    featured: boolean;

    featuredStories: string[];
    stories: string[];

    /**
     * takes optional json string (returned by firebase) to make collection
     * otherwise creates empty collection object
     */
    constructor(json?: string) {
        if (json) {
            this.parseJSON(json);
        } else {
            this.emptyCollection();
        }
    }

    /**
     * empty the collection object
     */
    emptyCollection() {
        this.$key = null;
        this.date_created = 0;

        this.title = "";
        this.description = "";
        this.featured = false;

        this.featuredStories = []
        this.stories = [];
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

        this.title = json['properties']['title'];
        this.description = json['properties']['description'];
        this.featured = json['properties']['featured'];

        this.featuredStories = this.getKeysFromJSONObject(json['featured_stories'])
        this.stories = this.getKeysFromJSONObject(json['stories']);
    }
}
