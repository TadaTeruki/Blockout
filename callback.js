
function get_block_index(ix, iy){
    return "block("+ix.toString()+","+iy.toString()+")"
}

function register_object(index, obj){
    game.objects[index] = obj
}

function remove_object(index){
    delete game.objects[index]
    var list_i = game.index_list.indexOf(index);
    if (list_i !== -1) {
        game.index_list.splice(list_i, 1);
    }
}

function move_paddle_callback(event){
    move_paddle(event.x, "main_paddle")
    draw()
}

function loop_callback(){
    game.objects_class_table["ball"].forEach(index => {
        if(game.objects[index].ball_released == false) return
        move_ball(index)
    })
    draw()
}

function ball_release_callback(event){
    //var ball_index = "main_ball"
    game.objects_class_table["ball"].forEach(index => {
        if(game.objects[index].ball_released == true) return
        game.objects[index].ball_released = true
        game.objects[index].angle = game.objects[index].ball_start_angle
        game.objects[index].velocity =
            game.objects[index].ball_start_velocity_horizontal_scale_per_second * screen.loop_second * screen.canvas.width /screen.resize_scale
    })
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