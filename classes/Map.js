
import Location from "./Location.js";
class Map {
    constructor(locations) {
        this.map = [];
        this.generateMap(locations)
    }

    generateMap(locations) {
        locations.forEach(element => {
            let { description, image, background_color, direction, posx, posy } = element;
            this.map.push(new Location(description, image, background_color, direction, posx, posy))
        });
    }

    getCurrentLocation(player_position) {
        return this.map.find(element => element.posx + element.posy == player_position);
    }
}

export default Map;
