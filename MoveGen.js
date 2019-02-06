var MoveGen = {
  pieces: [],
  king_options: [-1, 0, 1]
}

// MoveGen.move_gen_1= function( x ) {
//   var a = [0, 0, 0, 0];
//   var moves = [];
//   for(var i = 0; i <= 3; i++) {
//     a = [0, 0, 0, 0];
//     a[i] = x;
//     moves.push(a);
//     a = [0, 0, 0, 0];
//     a[i] = -x;
//     moves.push(a);
//   }
//   return moves;
// }

MoveGen.ponder= (so_far, remaining)=> {
  if(remaining.length == 0) {
    return [so_far]
  }
  var results= []
  for(var i= 0; i < remaining.length; i++) {
    if(i > 0 && remaining[i] == remaining[i-1]) {
      continue
    }
    var new_so_far= so_far.slice(0)
    new_so_far.push(remaining[i])
    var new_remaining_left= remaining.slice(0, i)
    var new_remaining_right= remaining.slice(i+1, remaining.length)
    var new_remaining= new_remaining_left.concat(new_remaining_right)
    results= results.concat(MoveGen.ponder(new_so_far, new_remaining))
  }
  return results
}

MoveGen.flip_out= (step_list)=> {
  if(step_list.length == 0) {
    return [step_list]
  }
  var full_step_list= []
  var the_rest= MoveGen.flip_out(step_list.slice(1))
  the_rest.forEach((a_rest)=> {
    full_step_list.push([step_list[0]].concat(a_rest))
    full_step_list.push([-step_list[0]].concat(a_rest))
  })
  return full_step_list
}

MoveGen.wild_unit= ( step_list )=> {
  var originals= []
  step_list.forEach((i)=> {
    if(i != 0) {
      originals.push(i)
    }
  })
  var step_lists= MoveGen.flip_out(originals)
  var results= []
  step_lists.forEach((sl)=> {
    while(sl.length < Board.d) {
      sl.push(0)
    }
    sl.sort()
    sl.reverse()
    results= results.concat(MoveGen.ponder([], sl))
  })
  return results
}

MoveGen.fill_king= (so_far)=> {
  if(so_far.length >= Board.d) {
    return [so_far]
  }
  var results= []
  MoveGen.king_options.forEach((n)=> {
    var one_longer= so_far.slice(0)
    one_longer.push(n)
    results= results.concat(MoveGen.fill_king(one_longer))
  })
  return results
}

MoveGen.move_gen_king= ()=> {
  var spam_moves= MoveGen.fill_king([])
  var all_zeroes
  for(var i= 0; i < spam_moves.length; i++) {
    all_zeroes= true
    for(var j= 0; j < Board.d; j++) {
      if(spam_moves[i][j] != 0) {
        all_zeroes= false
        break
      }
    }
    if(all_zeroes) {
      spam_moves.splice(i, 1)
      return spam_moves
    }
  }
  return spam_moves
}

// MoveGen.move_gen_2= function( x, y ) {
//   var a = [0, 0, 0, 0];
//   var moves = [];
//   for(var i = 0; i <= 2; i++) {
//     for(var j = (i+1); j <= 3; j++) {
//       a = [0, 0, 0, 0];
//       a[i] = x;
//       a[j] = y;
//       moves.push(a);
//       a = [0, 0, 0, 0];
//       a[i] = x;
//       a[j] = -y;
//       moves.push(a);
//       a = [0, 0, 0, 0];
//       a[i] = -x;
//       a[j] = y;
//       moves.push(a);
//       a = [0, 0, 0, 0];
//       a[i] = -x;
//       a[j] = -y;
//       moves.push(a);
//       if ( x != y ) {
//         a = [0, 0, 0, 0];
//         a[i] = y;
//         a[j] = x;
//         moves.push(a);
//         a = [0, 0, 0, 0];
//         a[i] = y;
//         a[j] = -x;
//         moves.push(a);
//         a = [0, 0, 0, 0];
//         a[i] = -y;
//         a[j] = x;
//         moves.push(a);
//         a = [0, 0, 0, 0];
//         a[i] = -y;
//         a[j] = -x;
//         moves.push(a);
//       }
//     }
//   }
//   return moves;
// }

MoveGen.include_piece= (moves, piece)=> {
  switch(piece) {
    case 'rook':
      MoveGen.pieces['rook']= [{
        rule: 'ride',
        moves: MoveGen.wild_unit([1])
      }]
      break
    case 'bishop':
      MoveGen.pieces['bishop']= [{
        rule: 'ride',
        moves: MoveGen.wild_unit([1, 1])
      }]
      break
    case 'knight':
      MoveGen.pieces['knight']= [{
        rule: 'leap',
        moves: MoveGen.wild_unit([1, 2])
      }]
      break
    case 'king':
      MoveGen.pieces['king']= [{
        rule: 'leap',
        moves: MoveGen.move_gen_king()
      }]
      break
    case 'queen':
      MoveGen.pieces['queen']= [{
        rule: 'ride',
        moves: MoveGen.wild_unit([1]).concat(MoveGen.wild_unit([1, 1]))
      }]
      break
    case 'archbishop':
      MoveGen.pieces['archbishop']= [
        {
          rule: 'ride',
          moves: MoveGen.wild_unit([1, 1])
        },
        {
          rule: 'leap',
          moves: MoveGen.wild_unit([1, 2])
        }
      ]
      break
    case 'chancellor':
      MoveGen.pieces['chancellor']= [
        {
          rule: 'ride',
          moves: MoveGen.wild_unit([1])
        },
        {
          rule: 'leap',
          moves: MoveGen.wild_unit([1, 2])
        }
      ]
      break
  }
}

// MoveGen.move_gen_king = function() {
//   var moves = [];
//   for (var i = -1; i <= 1; i++) {
//     for (var j = -1; j <= 1; j++) {
//       for (var k = -1; k <= 1; k++) {
//         for (var l = -1; l <= 1; l++) {
//           if ((i != 0) || (j != 0) || (k != 0) || (l != 0)) {
//             moves.push([i, j, k, l]);
//           }
//         }
//       }
//     }
//   }
//   return moves;
// }
// var king_moves = {
//   rule: 'leap',
//   moves: MoveGen.move_gen_king()
// };

// var champion_moves = {
//   rule: 'leap',
//   moves: MoveGen.move_gen_1( 1 ).concat( MoveGen.move_gen_1( 2 ) ).concat( MoveGen.move_gen_2( 2, 2 ) )
// };

// var wizard_moves = {
//   rule: 'leap',
//   moves: MoveGen.move_gen_2( 1, 1 ).concat( MoveGen.move_gen_2( 1, 3 ) )
// };

// queen_moves = [
//   rook_moves,
//   bishop_moves
// ];

// chancellor_moves = [
//   rook_moves,
//   knight_moves
// ];

// archbishop_moves = [
//   bishop_moves,
//   knight_moves
// ];
