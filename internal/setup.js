
var game = {}
var screen = {}

function init(){

    // ブロック崩しの画面の縦横比 ( screen.width_aspect:screen.height_aspect )
    screen.width_aspect = 4
    screen.height_aspect = 5

    // 1回のメインループにかける処理
    screen.loop_second = 0.01

    // ブロック崩しの画面の(画面全体に対する)余白
    screen.margin_pixel_scale = 0.1

    // 画面の大きさの変化 (1.0 固定) 
    screen.resize_scale = 1.0

    screen.canvas = document.getElementById("canvas_src")
    set_canvas_size()
    set_game()

    screen.canvas.start_width  = screen.canvas.width
    screen.canvas.start_height = screen.canvas.height

    main()
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

    game.ball_num = 1

    game.index_list = []
    game.objects_class_table = {}

    set_objects()

    game.objects_class_table["ball"].forEach(index => {
        set_ball(index)
    })

    signal_game_initialized()
    
}

function set_canvas_size(){
    // canvas に関する設定 (HTMLの内容に反映される)
    
    screen.canvas.width =
        Math.min(window.innerWidth, window.innerHeight/screen.height_aspect*screen.width_aspect) * (1.0-screen.margin_pixel_scale*2)
    screen.canvas.height =
        Math.min(window.innerHeight, window.innerWidth/screen.width_aspect*screen.height_aspect) * (1.0-screen.margin_pixel_scale*2)
    if(screen.canvas.width < 0.0 || screen.canvas.height < 0.0){
        screen.canvas.width = 0.0
        screen.canvas.height = 0.0
    }
    screen.canvas.style.left = (window.innerWidth-screen.canvas.width)*0.5
    screen.canvas.style.top = (window.innerHeight-screen.canvas.height)*0.5
    screen.canvas.style.position = "fixed"

}

function set_ball(ball_index, angle){

    if(angle == undefined) angle = Math.PI*0.25

    var parent_index = game.objects[ball_index].parent_index
    game.objects[ball_index].x = game.objects[parent_index].x
    game.objects[ball_index].y = game.objects[parent_index].y - game.objects[parent_index].height
    game.objects[ball_index].ball_start_velocity_horizontal_scale_per_second = 1.0
    game.objects[ball_index].ball_start_angle = angle
    game.objects[ball_index].ball_released = false

}