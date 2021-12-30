
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

    set_objects()

    game.index_list = []
    game.objects_class_table = {}

    for (var index in game.objects){
        game.index_list.push(index)

        var object = game.objects[index]
        if(game.objects_class_table[object.class] == undefined) game.objects_class_table[object.class] = []
        game.objects_class_table[object.class].push(index)

        if(object.type == "circle"){
            game.objects[index].get_r = function(){
                if(this.r_horizontal != undefined){
                    return this.r_horizontal * screen.resize_scale
                }
                if(this.r_vertical != undefined){
                    return this.r_vertical * screen.resize_scale
                }
                return 0.0
            }
        }
    }

    game.index_list.sort(function(index_a, index_b){
        return game.objects[index_a].z > game.objects[index_b].z
    })

    game.objects_class_table["ball"].forEach(index => {
        set_ball(index, game.objects[index].parent_index)
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