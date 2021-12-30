
function set_objects(){

    game.objects = {}

    for(var iy = 0; iy<game.blocks_num_vertical; iy++){
        for(var ix = 0; ix<game.blocks_num_horizontal; ix++){

            var rect_width  =  screen.canvas.width                             /game.blocks_num_horizontal
            var rect_height = (screen.canvas.height*game.blocks_vertical_scale)/game.blocks_num_vertical

            var block_index = get_block_index(ix, iy)
            register_object(block_index,{
                class: "block",
                type: "rectangle_xyse",
                sx: ix*rect_width,
                sy: iy*rect_height,
                ex: (ix+1)*rect_width,
                ey: (iy+1)*rect_height,
                fill_style: "#808080",
                margin_pixel_horizontal: game.blocks_margin_horizontal_scale*screen.canvas.height,
                margin_pixel_vertical: undefined,
                ball_collision: "external",
                breakout_callback: function(self_index, ball_index){
                    remove_object(self_index)
                },
                z: 1,
            })

        }
    }

    register_object("main_paddle", {
        class: "paddle",
        type: "rectangle_xywh",
        x: game.paddle_x_horizontal_scale * screen.canvas.width,
        y: game.paddle_y_vertical_scale   * screen.canvas.height,
        width : game.paddle_width_horizontal_scale * screen.canvas.width,
        height: game.paddle_height_vertical_scale  * screen.canvas.height,
        fill_style: "#b0a0a0",
        margin_pixel_horizontal: undefined,
        margin_pixel_vertical: undefined,
        ball_collision: "external",
        breakout_callback: undefined,
        z: 1,
    })

    register_object("main_ball", {
        class: "ball",
        parent_index : "main_paddle",
        type: "circle",
        x : 0.0,
        y : 0.0,
        r_horizontal : game.ball_width_horizontal_scale * screen.canvas.width,
        r_vertical    : undefined,
        fill_style: "#a03030",
        ball_collision: undefined,
        breakout_callback: undefined,
        z: 1,
    })
    
    register_object("background", {
        class: "background",
        type: "rectangle_xyse",
        sx: 0,
        sy: 0,
        ex: screen.canvas.width,
        ey: screen.canvas.height,
        fill_style: "#f0f0f0",
        margin_pixel_horizontal: undefined,
        margin_pixel_vertical: undefined,
        ball_collision: "internal",
        breakout_callback: function(self_index, ball_index){
            var ball_object = game.objects[ball_index]
            var paddle_object = game.objects[ball_object.parent_index]
            if(ball_object.y >= paddle_object.y){
                set_ball(ball_index, ball_object.parent_index)
                draw()
            }
        },
        z: 0,
    })
}

