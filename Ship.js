function  move(alive, map, remaining_move){
  p_coords = prompt_polar_input();
  dest = calc_destination(location, p_coords, map);
  map_response = map.check_destination_square(dest);

  switch(map_response.squaretype){
    case "empty":
      //map.updateLocation(dest);
      //above may be unnecessary as map could update location in the previous check_destination_square call
      break;
    case "celestial":
      alive = false;
      break;
    case "wormhole":
      //new_dest = calc_destination(map_response.wormhole_location, )
      //not gonna worry about this right now, not of great importance

      //map.updateLocation(dest);
      //above may be unnecessary as map could update location in the previous check_destination_square call
      break;

  return alive;
}

//assumes a method in map something like
//get_location(){
//  return {x: x, y: y}
//}


function calc_destination(location, p_coords, map){
    x = location.x += p_coords.dist*(Math.cos((p_coords.angle*Math.PI)/180);
    y = location.y += p_coords.dist*(Math.sin((p_coords.angle*Math.PI)/180);
    return {x: x, y: y};
}

function prompt_polar_input(){
  angle = prompt("Degrees of turn for next move: ");
  angle = eval(angle);
  dist = prompt("Number of spaces to move: ");
  dist = eval(dist);
  return {angle: angle, dist: dist};
}
