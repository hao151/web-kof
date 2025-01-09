import { game_object } from "/base_game/base.js";

class player extends game_object {   //人物用矩形代替
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.width = info.width;
        this.height = info.height;
        this.x = info.x;              //坐标
        this.y = info.y;
        this.color = info.color;
        this.vx = 0;
        this.vy = 0;
        this.speedx = 400;  //水平速度
        this.speedy = 1000; //跳起的初始速度
        this.ctx = this.root.game_map.ctx;

        this.gravity = 50;

        this.direction = 1;

        this.status = 3; //0:不动，1：移动，3：跳跃， 4：攻击， 5：被打， 6：倒地
        this.pressed_keys = this.root.game_map.control.pressed_keys;  //set存的

        this.animations = new Map();
        this.frame_current_cnt = 0;
        this.hp = 100;

        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`)
    }

    start() {

    }
    update() {
        this.control();
        this.move();
        this.update_direction();
        this.attack();
        this.render();

    }
    render() {
        let status = this.status;
        let obj = this.animations.get(status);
        if (obj && obj.is_load) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();
            }


        }

        if (this.status === 4 || this.status === 5 || this.status === 6) {
            if (this.status == 6 && this.id == 1) {
                if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 7)) {
                    this.frame_current_cnt--;
                }
            }

            else if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
                if (this.id == 0 && this.status == 6) this.frame_current_cnt--;
                else this.status = 0;
            }

        }
        this.frame_current_cnt++;

    }


    move() {
        this.vy += this.gravity;
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > this.ctx.canvas.height - this.height) {
            this.y = this.ctx.canvas.height - this.height;
            this.vy = 0;
            if (this.status == 3)
                this.status = 0;
        }

        if (this.x >= this.ctx.canvas.width - this.width) {
            this.x = this.ctx.canvas.width - this.width;
            this.vx = 0;
        }
        else if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }


    }

    control() {
        let l, r, attack, jump;
        if (this.id == 0) {
            l = this.pressed_keys.has('a');
            attack = this.pressed_keys.has('j');  //攻击
            r = this.pressed_keys.has('d');
            jump = this.pressed_keys.has('k');  //跳跃
        }
        else {
            jump = this.pressed_keys.has('2');
            l = this.pressed_keys.has('ArrowLeft');
            r = this.pressed_keys.has('ArrowRight');
            attack = this.pressed_keys.has('1');
        }
        if (this.status === 0 || this.status === 1 || this.status === 2) {
            if (attack) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
            else if (jump) {
                if (r) {
                    this.vx = this.speedx;
                }
                else if (l) {
                    this.vx = -this.speedx;
                }
                else this.vx = 0;

                this.vy = -this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            }
            else if (r) {
                this.vx = this.speedx;
                this.status = 1;
                if (this.direction == -1) this.status = 2;
            }
            else if (l) {
                this.vx = -this.speedx;
                this.status = 2;
                if (this.direction == -1) this.status = 1;
            }
            else {
                this.status = 0;
                this.vx = 0;
            }

        }
    }

    update_direction() {
        if (this.status == 6) return;
        let x0 = this.root.players[0].x;
        let x1 = this.root.players[1].x;

        if (x0 > x1 && this.id == 0) {
            this.direction = -1;
        }
        if (x0 < x1 && this.id == 1) {
            this.direction = -1;
        }
        if (x0 < x1 && this.id == 0) {
            this.direction = 1;
        }
        if (x0 > x1 && this.id == 1) {
            this.direction = 1;
        }

    }

    attack() {
        if (this.status === 4 && this.frame_current_cnt === 18) {

            let matrix_me, matrix_you;
            let me = this, you = this.root.players[1 - this.id];

            if (me.direction > 0) {
                matrix_me = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };
            }
            else {
                matrix_me = {
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120 - 100 + 100,
                    y2: me.y + 40 + 20,
                };
            }

            matrix_you = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height
            };


            if (this.is_collision(matrix_me, matrix_you)) {
                you.is_attack();
            }
        }



    }

    is_attack() {
        if (this.status === 6) return;
        this.status = 5;
        this.hp = Math.max(0, this.hp - 10);
        this.frame_current_cnt = 0;
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 500)

        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
        }


    }

    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

}

export {
    player
}