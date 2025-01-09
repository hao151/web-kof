import { game_object } from "/base_game/base.js";
import { control } from "./control/base.js";
import { GIF } from "./utils/gifs.js";

class gamemap extends game_object {
    constructor(root) {
        super();

        this.root = root;
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');  //canvas聚焦
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();

        this.control = new control(this.$canvas);
        this.frame_current_cnt = 0;
        this.frame_rate = 5;

        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div></div></div>
    </div>`))
        this.time_left = 60000;
        this.$time = this.root.$kof.find(`.kof-head-timer`)
    }

    start() {

    }

    update() {
        if (!this.game_over()) {
            this.time_left -= this.timedelta;
            this.time_left = Math.max(0, this.time_left);
            this.$time.text(parseInt(this.time_left / 1000));
        }

        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.$canvas.width(), this.$canvas.height());


    }
    game_over() {
        return (this.root.players[0].status === 6 || this.root.players[1].status === 6);
    }
}

export {
    gamemap
}