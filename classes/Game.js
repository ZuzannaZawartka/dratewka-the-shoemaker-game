import itemsLocation from "../files/itemsLocations.json" assert {type: "json"}
import itemsActions from "../files/itemsActions.json" assert {type: "json"}
import locations from "../files/locations.json" assert {type: "json"}
import items from "../files/items.json" assert {type: "json"}
import com from "../files/commands.json" assert {type: "json"}
import Map from "./Map.js"
import Player from "./Player.js"
import View from "./View.js"
import Commands from "./Commands.js"
import Items from "./Items.js"
class Game {
    constructor(locations, com, items, itemsLocation, itemsActions) {

        this.map = null
        this.player = null
        this.view = null
        this.commands = null
        this.command = null
        this.items = null
        this.further_story = false
        this.directions = {
            n: "North",
            s: "South",
            w: "West",
            e: "East",
        }

        this.inputElement = document.getElementById("TypeText")

        this.startGame(locations, com, items, itemsLocation, itemsActions)

    }

    startGame(locations, com, items, itemsLocation, itemsActions) {
        this.map = new Map(locations)
        this.player = new Player()
        this.view = new View()
        this.commands = new Commands(com)
        this.items = new Items(items, itemsActions, itemsLocation)
        this.keyListener()
        this.update()
        this.view.stratGame()
    }

    keyListener() {
        this.view.inputFocus()
        this.getDataFromInput()
    }

    getDataFromInput() {
        document.getElementById("TypeText").addEventListener("keypress", (e) => {
            if (e.key == "Enter") {
                let [command, command_args] = this.inputElement.value.toUpperCase().split(" ")
                command = command.toLowerCase()
                let found_command = this.commands.map.find(element => element.name == command || element.name[0] == command)
                if (found_command) {
                    if (found_command.type == 0) return this.walkCommand(found_command, command_args)
                    if (found_command.type == 1) {
                        if (found_command.name == "take") return this.takeCommand(command_args)
                        if (found_command.name == "drop") return this.dropCommand(command_args)
                        if (found_command.name == "use") return this.useCommand(command_args)
                        if (found_command.name == "k") return this.tepCommand(command_args)
                    } else if (found_command.type == 2) {
                        if (found_command.name == "vocabulary")
                            return this.view.showTextCommandTypeTwo(`
                            "NORTH or N, SOUTH or S"
                            "WEST or W, EAST or E"
                            "TAKE (object) or T (object)"
                            "DROP (object) or D (object)"
                            "USE (object) or U (object)"
                            "GOSSIPS or G, VOCABULARY or V"
                            "Press any key"`)
                        if (found_command.name == "gossip")
                            return this.view.showTextCommandTypeTwo(`
                                "The  woodcutter lost  his home key..."
                               "The butcher likes fruit... The cooper"
                               "is greedy... Dratewka plans to make a"
                               "poisoned  bait for the dragon...  The"
                               "tavern owner is buying food  from the"
                               "pickers... Making a rag from a bag..."
                               "Press any key"`)
                    }
                } else {
                    this.view.showText("Try another word or V for vocabulary")
                }
            }
        })
    }

    getCurrentObject() {
        return this.map.getCurrentLocation(this.player.getCurrentPosition())
    }

    RemoveItemFromWorld(item) {
        this.items.itemsLocations.splice(this.items.itemsLocations.findIndex(element => element.id_item == item.id), 1)
    }

    AddItemToWorld(item) {
        //check if in this location item doesnt exist
        if (!(this.items.itemsLocations.find(e => e.id_item == item.id))) {
            this.items.itemsLocations.push({ location: `${this.player.getCurrentPosition()}`, id_item: `${item.id}` })
        }
    }

    update() {
        this.view.refresh(this.getCurrentObject(), this.items.ItemInThisPlace(this.player.getCurrentPosition()), this.player)
    }

    checkProgress(milestone) {
        if (milestone) this.player.progress += 1
        let itemAfterMilestone = this.items.itemAction.find(e => (e.usedItemID == "0"))
        if (this.player.progress >= 6) {
            setTimeout(function () {
                console.log("PROGRESS")
                this.items.itemsLocations = this.items.itemsLocations.filter(item => item.location != itemAfterMilestone.locationID)// itemAfterMilestone.locationID zamiast 43
                this.player.take(this.items.map.find(item => item.id == 37))
                this.further_story = true
                this.update()
            }.bind(this), 2000)
        }
    }

    walkCommand(command, command_args) {
        //checking if current location on map allow us to get to direction and if we dont have any others command args 
        console.log(this.map.getCurrentLocation(this.player.getCurrentPosition()))
        if (this.map.getCurrentLocation(this.player.getCurrentPosition()).direction.includes(command.alias) && !command_args) {
            if (this.player.getCurrentPosition() == 42 && command.alias == "w" && !this.further_story) {
                //if we dont have all milestones we cant get to 43 location
                // this.view.showText("You can't go that way...")
                // setTimeout(function () {
                //     this.view.showText(` The dragon sleeps in a cave!`)
                // }.bind(this), 1000)
                this.view.showText(`You can't go that way... (timeout) The dragon sleeps in a cave!`)
            } else {
                //changing position of player
                this.player.changePosition(this.player.getCurrentPosition() + parseInt(command.value))
                this.update()
                this.view.showText(`You are going ${command.name}`)
            }
        } else {
            this.view.showText("You can't go that way")
        }
    }

    takeCommand(command_args) {
        //take_it is array of item in current place
        let itemsToTake = this.items.ItemInThisPlace(this.player.getCurrentPosition())
        if (itemsToTake)
            //if writed item is the same as item in current location
            return itemsToTake.forEach(item => {
                if (command_args == item.name) {
                    //checking if our player have sth in eq
                    if (this.player.equipment.length < 1) {
                        //check if we could take it (flag 0 - no // flag 1- yes)
                        if (item.flag != 0) {
                            this.player.take(item)
                            this.RemoveItemFromWorld(item)
                            this.view.showText(`You are taking ${item.name}`)
                            this.update()
                        } else {
                            this.view.showText(" You can't carry it")
                        }
                    } else {
                        this.view.showText("You are carrying something")
                    }
                } else {
                    this.view.showText("There isn't anything like that here")
                }
            })
        this.view.showText("There isn't anything like that here")
    }

    dropCommand(command_args) {
        let itemInEquipment = this.player.returnIfItemInEq(command_args)
        if (itemInEquipment) {
            //counting how many item with flag 1 is in current location
            if (this.items.howManyFlagOneInCurrPos(this.player.getCurrentPosition()) < 3) {
                this.view.showText(`You are about to drop ${itemInEquipment.name}`)
                this.player.drop(itemInEquipment)
                this.AddItemToWorld(itemInEquipment)
                this.update()
            } else {
                this.view.showText("You can't store any more here")
            }
        } else {
            if (this.player.equipment.length > 0) {
                this.view.showText("You are not carrying it")
            } else {
                this.view.showText("You are not carrying anything")
            }
        }
    }

    useCommand(command_args) {
        if (this.player.returnIfItemInEq(command_args)) {
            try {
                let [item, progress, text] = this.items.checkAction(command_args, this.player.getCurrentPosition())
                if (item) {
                    if (this.player.getCurrentPosition() == 43 && this.items.map.find(item => item.name == command_args).id == 37) {
                        this.view.showText("The dragon noticed your gift... (timeout) The dragon ate your sheep and died!")
                        setTimeout(function () {
                            this.map.map.find(item => item.image == "43.gif").image = "dragon.gif"
                            this.update()
                        }.bind(this), 1000)
                    }
                    if (item.flag != 0) {
                        this.player.take(item)
                    } else {
                        this.AddItemToWorld(item)
                    }
                    this.player.drop(this.player.returnIfItemInEq(command_args))
                    this.view.showText(text)
                    this.update()
                    if (!this.further_story) return this.checkProgress(progress.milestone);
                }
            } catch (e) {
                if (this.items.map.find(item => item.name == command_args).id == 36 && this.player.getCurrentPosition() == 41) {
                    this.endGameLoad()
                } else {
                    this.view.showText("Nothing happened")
                }
            }
        } else {
            this.view.showText("You aren't carrying anything like that")
        }
    }

    tepCommand(command_args) {
        console.log(this.map.getCurrentLocation(this.player.getCurrentPosition()))
        this.player.changePosition(command_args)
        this.update()
    }

    endGameLoad() {
        console.log("KONIEC GRY")
        document.getElementById("intro").style.display = "block"
    }
}

let game = new Game(locations, com, items, itemsLocation, itemsActions)

