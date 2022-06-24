class Player {
    constructor() {
        this.current_position = 47
        this.equipment = []
        this.progress = 0
    }

    getCurrentPosition() {
        return this.current_position
    }

    changePosition(position) {
        this.current_position = position
    }

    returnIfItemInEq(item_name) {
        return this.equipment.find(e => e.name == item_name)
    }

    take(item) {
        this.equipment.push(item)
    }

    drop(item) {
        this.equipment.splice(this.equipment.findIndex(element => element.id == item.id), 1)
    }

}

export default Player;