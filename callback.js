




function get_block_index(ix, iy){
    return "block("+ix.toString()+","+iy.toString()+")"
}

function register_object(index, obj){
    game.objects[index] = obj
}

function move_paddle_callback(event){
    move_paddle(event.x, "main_paddle")
    draw()
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