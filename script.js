
var game = {}
var screen = {}

function init(){

    screen.width_aspect = 8
    screen.height_aspect = 10
    screen.margin_pixel = 80.0
    screen.loop_second = 0.01

    screen.canvas = document.getElementById("canvas_src")
    set_canvas_size()
    set_game()

    screen.canvas.start_width  = screen.canvas.width
    screen.canvas.start_height = screen.canvas.height

    screen.resize_scale = 1.0

    main()
}

function get_block_index(ix, iy){
    return "block("+ix.toString()+","+iy.toString()+")"
}

function register_object(index, obj){
    game.objects[index] = obj
}

function set_game(){
    game.blocks_num_vertical   = 12
    game.blocks_num_horizontal = 8
    game.blocks_vertical_scale = 0.4
    game.blocks_margin_horizontal_scale = 0.003

    game.paddle_x_horizontal_scale = 0.5
    game.paddle_y_vertical_scale   = 0.95
    game.paddle_width_horizontal_scale = 0.15
    game.paddle_height_vertical_scale  = 0.02
    game.ball_width_horizontal_scale = 0.015

    game.ball_start_velocity_horizontal_scale_per_second = 1.0
    game.ball_start_angle = Math.PI*0.25

    game.ball_released = false

    set_objects()

    game.index_list = []
    for (var index in game.objects){
        game.index_list.push(index)
    }
    game.index_list.sort(function(index_a, index_b){
        return game.objects[index_a].z > game.objects[index_b].z
    })
    
}

function set_objects(){

    game.objects = {}

    for(var iy = 0; iy<game.blocks_num_vertical; iy++){
        for(var ix = 0; ix<game.blocks_num_horizontal; ix++){

            var rect_width  =  screen.canvas.width                             /game.blocks_num_horizontal
            var rect_height = (screen.canvas.height*game.blocks_vertical_scale)/game.blocks_num_vertical

            var block_index = get_block_index(ix, iy)
            register_object(block_index,{
                type: "rectangle_xyse",
                sx: ix*rect_width,
                sy: iy*rect_height,
                ex: (ix+1)*rect_width,
                ey: (iy+1)*rect_height,
                fill_style: "#808080",
                margin_pixel_horizontal: game.blocks_margin_horizontal_scale*screen.canvas.height,
                margin_pixel_vertical: undefined,
                ball_collision: "external",
                z: 1,
            })

        }
    }

    register_object("main_paddle", {
        type: "rectangle_xywh",
        x: game.paddle_x_horizontal_scale * screen.canvas.width,
        y: game.paddle_y_vertical_scale   * screen.canvas.height,
        width : game.paddle_width_horizontal_scale * screen.canvas.width,
        height: game.paddle_height_vertical_scale  * screen.canvas.height,
        fill_style: "#b0a0a0",
        margin_pixel_horizontal: undefined,
        margin_pixel_vertical: undefined,
        ball_collision: "external",
        z: 1,
    })

    register_object("main_ball", {
        type: "ball",
        type: "circle",
        x : game.paddle_x_horizontal_scale * screen.canvas.width,
        y : (game.paddle_y_vertical_scale-game.paddle_height_vertical_scale*0.5) * screen.canvas.height - game.ball_width_horizontal_scale * screen.canvas.width,
        r_horiozontal : game.ball_width_horizontal_scale * screen.canvas.width,
        r_vertical    : undefined,
        fill_style: "#a03030",
        ball_collision: undefined,
        z: 1,
    })
    
    register_object("background", {
        type: "rectangle_xyse",
        sx: 0,
        sy: 0,
        ex: screen.canvas.width,
        ey: screen.canvas.height,
        fill_style: "#f0f0f0",
        margin_pixel_horizontal: undefined,
        margin_pixel_vertical: undefined,
        ball_collision: "internal",
        z: 0,
    })
}



function set_canvas_size(){
    // canvas に関する設定 (HTMLの内容に反映される)
    screen.canvas.width =
        Math.min(window.innerWidth, window.innerHeight/screen.height_aspect*screen.width_aspect) - screen.margin_pixel*2
    screen.canvas.height =
        Math.min(window.innerHeight, window.innerWidth/screen.width_aspect*screen.height_aspect) - screen.margin_pixel*2
    if(screen.canvas.width < 0.0 || screen.canvas.height < 0.0){
        screen.canvas.width = 0.0
        screen.canvas.height = 0.0
    }
    screen.canvas.style.left = (window.innerWidth-screen.canvas.width)*0.5
    screen.canvas.style.top = (window.innerHeight-screen.canvas.height)*0.5
    screen.canvas.style.position = "fixed"

}

function draw(){
    ctx = screen.canvas.getContext("2d")

    for (var i = 0; i<game.index_list.length; i++) {
        var index = game.index_list[i]
        
        var rect, rect_sx, rect_sy, rect_ex, rect_ey, rect_width, rect_height
        switch(game.objects[index].type){
            case "rectangle_xywh":{
                rect = game.objects[index]
                rect_width  = rect.width  * screen.resize_scale
                rect_height = rect.height * screen.resize_scale
                rect_sx = rect.x * screen.resize_scale - rect_width *0.5
                rect_sy = rect.y * screen.resize_scale - rect_height*0.5

                /* [[fallthrough]] */
            }
            case "rectangle_xyse":{
                if(game.objects[index].type == "rectangle_xyse"){
                    rect = game.objects[index]
                    rect_sx = rect.sx * screen.resize_scale
                    rect_sy = rect.sy * screen.resize_scale
                    rect_ex = rect.ex * screen.resize_scale
                    rect_ey = rect.ey * screen.resize_scale
                    rect_width  = rect_ex-rect_sx
                    rect_height = rect_ey-rect_sy
                }
                var rect_margin_pixel = 0.0
                if(rect.margin_pixel_horizontal != undefined){
                    rect_margin_pixel = rect.margin_pixel_horizontal * screen.resize_scale
                }
                if(rect.margin_pixel_vertical != undefined){
                    rect_margin_pixel = rect.margin_pixel_vertical * screen.resize_scale
                }

                if(rect_width <= rect_margin_pixel*2 || rect_height <= rect_margin_pixel*2) break

                ctx.fillStyle = rect.fill_style
                ctx.beginPath()
                ctx.rect(
                    rect_sx + rect_margin_pixel,
                    rect_sy + rect_margin_pixel, 
                    rect_width - rect_margin_pixel*2,
                    rect_height- rect_margin_pixel*2,
                )
                ctx.fill()
                break
            }
            case "circle":{
                var circle = game.objects[index]
                ctx.fillStyle = circle.fill_style      
                var circle_x = circle.x * screen.resize_scale
                var circle_y = circle.y * screen.resize_scale
                var circle_r = 0.0
                if(circle.r_horiozontal != undefined){
                    circle_r = circle.r_horiozontal * screen.resize_scale
                }
                if(circle.r_vertical != undefined){
                    circle_r = circle.r_vertical * screen.resize_scale
                }

                ctx.beginPath()
                ctx.arc(
                    circle_x,
                    circle_y,
                    circle_r,
                    0.0, Math.PI*2.0
                )
                ctx.fill()
                break
            }
            default:{
                break
            }
        }
    }

}

function move_paddle(event_x_pixel, paddle_index){
    var canvas_x_pixel = event_x_pixel - (window.innerWidth-screen.canvas.width)*0.5
    var paddle_width_pixel_harf = game.paddle_width_horizontal_scale*screen.canvas.width*0.5

    if(canvas_x_pixel < paddle_width_pixel_harf){
        canvas_x_pixel = paddle_width_pixel_harf
    }
    if(canvas_x_pixel > screen.canvas.width - paddle_width_pixel_harf){
        canvas_x_pixel = screen.canvas.width - paddle_width_pixel_harf
    }

    game.objects[paddle_index].x = canvas_x_pixel/screen.resize_scale

    if(game.ball_released == false && paddle_index == "main_paddle"){
        game.objects["main_ball"].x = game.objects[paddle_index].x
    }
}

function move_paddle_callback(event){
    move_paddle(event.x, "main_paddle")
    draw()
}

function move_ball(ball_index){

    var ball_next_x = 0.0
    var ball_next_y = 0.0
    var ball_next_angle = game.objects[ball_index].angle
    var max_collision_dist = 100.0

    var angle_list = [ 0.0, Math.PI*0.5, Math.PI*1.5, Math.PI*1.0]

    collision_loop:
    for(var collision_dist = 1.0; collision_dist <= max_collision_dist; collision_dist++){

        for(var j = 0; j < angle_list.length; j++){

            var angle = ball_next_angle + angle_list[j]
            var velocity = game.objects[ball_index].velocity*collision_dist
            var ball_x = game.objects[ball_index].x + Math.cos(angle)*velocity
            var ball_y = game.objects[ball_index].y - Math.sin(angle)*velocity
            var accepted = true

            for (var i = 0; i<game.index_list.length; i++) {
                
                var obj_index = game.index_list[i]
                var object = game.objects[obj_index]
                if(object.ball_collision == undefined) continue

                var is_internal = false

                switch(object.type){
                    case "rectangle_xywh":{
                        is_internal = (
                            ball_x > object.x - object.width *0.5 &&
                            ball_x < object.x + object.width *0.5 &&
                            ball_y > object.y - object.height*0.5 &&
                            ball_y < object.y + object.height*0.5
                        )
                        break
                    }
                    case "rectangle_xyse":{
                        is_internal = (
                            ball_x > object.sx && 
                            ball_x < object.ex && 
                            ball_y > object.sy && 
                            ball_y < object.ey 
                        )
                        break
                    }
                    case "circle":{
                        var circle_r = object.r_horiozontal == undefined ? object.r_vertical: object.r_horiozontal
                        is_internal = (
                            ball_x > object.x - circle_r &&
                            ball_x < object.x + circle_r &&
                            ball_y > object.y - circle_r &&
                            ball_y < object.y + circle_r
                        )
                        break
                    }
                }
        
                if((is_internal == true  && object.ball_collision == "external") ||
                (is_internal == false && object.ball_collision == "internal") ){
                    accepted = false
                    break
                }
            }

            if(accepted == true){
                ball_next_angle = angle
                ball_next_x = ball_x
                ball_next_y = ball_y
                break collision_loop
            }
        }

        if(collision_dist == max_collision_dist){
            return
        }
    }

    game.objects[ball_index].x = ball_next_x
    game.objects[ball_index].y = ball_next_y
    game.objects[ball_index].angle = ball_next_angle

}

function loop_callback(){
    if(game.ball_released == false) return
    move_ball("main_ball")

    draw()
}

function ball_release_callback(event){
    if(game.ball_released == true) return
    game.ball_released = true
    game.objects["main_ball"].angle = game.ball_start_angle
    game.objects["main_ball"].velocity = game.ball_start_velocity_horizontal_scale_per_second * screen.loop_second * screen.canvas.width
}

function main(){

    window.addEventListener("resize", function(event){
        set_canvas_size()
        screen.resize_scale = screen.canvas.width/screen.canvas.start_width
        draw()
    })
    window.addEventListener("mousemove", move_paddle_callback)
    window.addEventListener("mouseout" , move_paddle_callback)
    window.addEventListener("touchmove", move_paddle_callback)

    window.addEventListener("mousedown", ball_release_callback)

    setInterval(loop_callback, screen.loop_second*1000)

    draw()
}