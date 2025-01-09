import { player } from "./player.js";
import { GIF } from "./utils/gifs.js";

class kyo extends player {   //继承自player，控制是跟随的player，但有自己的动作了
    constructor(root, info) {
        super(root, info);
        this.init_animations();

    }
    init_animations() {
        let outer = this;
        let offsets = [0, -22, -22, -100, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            if (this.id == 0)
                gif.load(`/static/images/player/kyo/${i}.gif`);
            else {
                gif.load(`/static/images/player/mai/${i}.gif`);
                offsets = [17, 33, 0, -170, -22, 0, -40];
            }
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,  // 总图片数
                frame_rate: 5,  // 每5帧过度一次
                offset_y: offsets[i],  // y方向偏移量
                is_load: false,  // 是否加载
                scale: 2,  // 放大多少倍
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.is_load = true;
            }
        }
        if (this.status === 3) this.frame_rate = 4;
    }
}

export {
    kyo
}