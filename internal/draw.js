
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
                var circle_r = circle.get_r()

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