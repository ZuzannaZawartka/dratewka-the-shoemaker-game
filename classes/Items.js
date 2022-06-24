import Item from "./Item.js";
class Items {
    constructor(items, action, location) {

        this.map = [];
        this.itemAction = []
        this.itemsLocations = []
        this.generateItems(items)
        this.generateItemsActions(action)
        this.generateItemsLocation(location)
    }


    generateItems(items) {
        items.forEach(e => {
            let { id, long_name, flag, name } = e
            this.map.push(new Item(id, long_name, flag, name));
        })
    }

    generateItemsActions(action) {

        action.forEach(e => {
            this.itemAction.push(e)
        })
    }

    //generated in variables in main game
    generateItemsLocation(location) {

        location.forEach(e => {
            this.itemsLocations.push(e)
        })
    }

    checkAction(item_name, current_position) {
        let tab = []
        let zm = this.itemAction.find(e => ((e.locationID == current_position) && (e.usedItemID == this.map.find(e2 => e2.name == item_name).id)))
        if (!zm) return
        this.itemAction.splice(this.itemAction.findIndex(element => element.usedItemID == zm.usedItemID), 1)
        //return item to get to eq
        tab = [this.map.find(e => e.id == zm.givenItemID), zm, zm.text]
        return tab
    }

    ItemInThisPlace(current_position) {
        //check if this place have any item
        let arrayOfItemsInCurrentPosition = undefined
        //czy jest jakikoolwiek element w danym miejscu
        let firstItemInCurrentPosition = this.itemsLocations.find(e => e.location == current_position)
        //if not undefinded add to variables
        if (firstItemInCurrentPosition) {
            let itemsInCurrentLocation = this.itemsLocations.filter(item => item.location == current_position)
            arrayOfItemsInCurrentPosition = []
            itemsInCurrentLocation.forEach(itemInCurrentPos => {
                arrayOfItemsInCurrentPosition.push(this.map.find(item => item.id == itemInCurrentPos.id_item))
            })
        }
        return arrayOfItemsInCurrentPosition
    }

    howManyFlagOneInCurrPos(current_position) {
        let items = this.ItemInThisPlace(current_position)
        if (items) {
            return items.filter(item => item.flag == 1).length
        }
        return 0
    }



}

export default Items;



