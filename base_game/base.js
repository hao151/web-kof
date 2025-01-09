//一秒刷新10次,所有对象都继承该对象

let object = [];
class game_object {
    constructor() {
        object.push(this);
        this.timedelta = 0; //时间间隔
        this.flag_start = false;
    }
    start() {  //初始执行

    }

    update() //每帧执行
    {

    }

    destroy()  //删除当前对象
    {
        for (let i in object) {  //在object数组中找到当前对象并删除
            if (object[i] == this) {
                object.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let frame = (timestamp) => {

    for (let obj of object) {   //object中的每个对象都启动60帧的刷新率
        if (obj.flag_start == true) {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
        else {
            obj.start();
            obj.flag_start = true;
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(frame); //递归刷新

}

requestAnimationFrame(frame); //启动

export {
    game_object
}
