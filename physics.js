
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
