class View {
    constructor() {
        this.input = document.getElementById('TypeText');
        this.placeForText = document.getElementById("InputLabel");
        this.inputText = "Whats now?";
    }

    refresh(object, item, player) {

        let img = document.createElement("img");
        img.src = `./files/img/${object.image}`;
        let src = document.getElementById("img");
        src.innerHTML = ""
        img.style.backgroundColor = object.background_color
        src.appendChild(img);

        document.getElementById("north").style.display = "none";
        document.getElementById("south").style.display = "none";
        document.getElementById("west").style.display = "none";
        document.getElementById("east").style.display = "none";

        document.getElementById("title").innerHTML = object.description;
        let string = ""
        if (object.direction.includes("n")) {
            string += " NORTH"
            document.getElementById("north").style.display = "block";
        }
        if (object.direction.includes("s")) {
            string += " SOUTH";
            document.getElementById("south").style.display = "block";
        }
        if (object.direction.includes("w")) {
            string += " WEST"
            document.getElementById("west").style.display = "block";
        }
        if (object.direction.includes("e")) {
            string += " EAST"
            document.getElementById("east").style.display = "block";
        }
        document.getElementById("direction").innerHTML = `You can go ${string}`

        let string2 = "You can see "
        if (item != null) {
            item.forEach(e => {
                string2 += " " + e.long_name
            })
        } else {
            string2 += " nothing"
        }
        document.getElementById("see").innerHTML = string2

        let string3 = "You are carrying "
        if (player.equipment.length > 0) {
            player.equipment.forEach(element => {
                string3 += " " + element.long_name
            });
        } else {
            string3 += " nothing"
        }
        document.getElementById("carrying").innerHTML = string3
    }

    inputFocus() {
        this.input.focus()
        this.input.addEventListener("blur", function (e) {
            this.focus()
        })
    }

    showTextCommandTypeTwo(text) {
        document.getElementById("info").innerText = text
        let zm = document.querySelectorAll(".text")
        zm.forEach(e => {
            e.classList.add("hidden")
        })
        this.input.disabled = true;
        this.input.value = null
        this.placeForText.innerHTML = ""
        let _this = this
        setTimeout(function () {
            window.addEventListener("keypress", function () {
                let zm = document.querySelectorAll(".hidden")
                zm.forEach(e => {
                    e.classList.remove("hidden")
                })
                _this.renewInput()
                document.getElementById("info").innerText = "";
            }, { once: true });
        }.bind(this), 10);

    }

    showText(text) {
        let delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        let textsToShow = text.split("(timeout)");
        (async () => {
            for (let index = 0; index < textsToShow.length; index++) {
                this.input.disabled = true;
                this.input.value = null
                console.log(textsToShow[index])
                this.placeForText.innerText = textsToShow[index];
                await delay(1000);
                this.renewInput()
            }
        }).bind(this)();
    }

    stratGame() {
        window.addEventListener("keypress", function () {
            document.getElementById("intro").style.backgroundImage = "url(files/startImg/opis_A.jpg)"
            window.addEventListener("keypress", function () {
                document.getElementById("intro").style.backgroundImage = "url(files/startImg/opis_B.jpg)"
                window.addEventListener("keypress", function () {
                    document.getElementById("intro").style.display = "none"
                    this.renewInput()
                    document.getElementById("iframeAudio").remove()
                }.bind(this), { once: true })
            }.bind(this), { once: true })
        }.bind(this), { once: true })
    }

    renewInput() {
        this.placeForText.innerText = this.inputText;
        this.input.disabled = false;
        this.inputFocus()
    }
}

export default View;