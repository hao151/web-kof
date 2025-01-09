import { gamemap } from "./background.js";
//import { player } from "./player.js";
import { kyo } from "./kyo.js";

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.game_map = new gamemap(this);
        this.players = [
            new kyo(this, {
                id: 0,
                x: 0,
                y: 0,
                width: 150,
                height: 200,
                color: 'blue',
            }),

            new kyo(this, {
                id: 1,
                x: 500,
                y: 0,
                width: 150,
                height: 200,
                color: 'red',
            })
        ]

    }

}

export {
    KOF
}