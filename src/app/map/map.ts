export class Camp {

    $key: string;
    title: string;
    lng: number;
    lat: number;

    current: boolean;

    /**
     * takes optional json string (returned by firebase) to make camp
     * otherwise creates empty camp object
     */
    constructor(json?: string) {
        if (json) {
            this.parseJSON(json);
        } else {
            this.emptyStory();
        }
    }

    /**
     * empty the camp object
     */
    emptyStory() {
        this.$key = null;
        this.title = "";
        this.lng = null;
        this.lat = null;

        this.current = false;
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
        this.title = json['title'];
        this.lng = +json['lng'];
        this.lat = +json['lat'];
        this.current = json['current'];
    }

}