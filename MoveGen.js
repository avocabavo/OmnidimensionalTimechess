var MoveGen = {};

MoveGen.move_gen_1= function( x ) {
  var a = [0, 0, 0, 0];
  var moves = [];
  for(var i = 0; i <= 3; i++) {
    a = [0, 0, 0, 0];
    a[i] = x;
    moves.push(a);
    a = [0, 0, 0, 0];
    a[i] = -x;
    moves.push(a);
  }
  return moves;
}

MoveGen.move_gen_2= function( x, y ) {
  var a = [0, 0, 0, 0];
  var moves = [];
  for(var i = 0; i <= 2; i++) {
    for(var j = (i+1); j <= 3; j++) {
      a = [0, 0, 0, 0];
      a[i] = x;
      a[j] = y;
      moves.push(a);
      a = [0, 0, 0, 0];
      a[i] = x;
      a[j] = -y;
      moves.push(a);
      a = [0, 0, 0, 0];
      a[i] = -x;
      a[j] = y;
      moves.push(a);
      a = [0, 0, 0, 0];
      a[i] = -x;
      a[j] = -y;
      moves.push(a);
      if ( x != y ) {
        a = [0, 0, 0, 0];
        a[i] = y;
        a[j] = x;
        moves.push(a);
        a = [0, 0, 0, 0];
        a[i] = y;
        a[j] = -x;
        moves.push(a);
        a = [0, 0, 0, 0];
        a[i] = -y;
        a[j] = x;
        moves.push(a);
        a = [0, 0, 0, 0];
        a[i] = -y;
        a[j] = -x;
        moves.push(a);
      }
    }
  }
  return moves;
}

rook_moves = {
  rule: 'ride',
  moves: MoveGen.move_gen_1( 1 )
};

bishop_moves = {
  rule: 'ride',
  moves: MoveGen.move_gen_2( 1, 1 )
};

knight_moves = {
  rule: 'leap',
  moves: MoveGen.move_gen_2( 1, 2 )
};

MoveGen.move_gen_king = function() {
  var moves = [];
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      for (var k = -1; k <= 1; k++) {
        for (var l = -1; l <= 1; l++) {
          if ((i != 0) || (j != 0) || (k != 0) || (l != 0)) {
            moves.push([i, j, k, l]);
          }
        }
      }
    }
  }
  return moves;
}
var king_moves = {
  rule: 'leap',
  moves: MoveGen.move_gen_king()
};

var champion_moves = {
  rule: 'leap',
  moves: MoveGen.move_gen_1( 1 ).concat( MoveGen.move_gen_1( 2 ) ).concat( MoveGen.move_gen_2( 2, 2 ) )
};

var wizard_moves = {
  rule: 'leap',
  moves: MoveGen.move_gen_2( 1, 1 ).concat( MoveGen.move_gen_2( 1, 3 ) )
};

queen_moves = [
  rook_moves,
  bishop_moves
];

chancellor_moves = [
  rook_moves,
  knight_moves
];

archbishop_moves = [
  bishop_moves,
  knight_moves
];
