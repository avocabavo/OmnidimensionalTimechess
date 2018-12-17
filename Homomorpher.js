var Homomorpher= {
  random_reverse_1: () => {
    x= Math.floor( Math.random() * Board.d );
    if ( GameState.load || GameState.anim ) { return };
    GameState.anim= true;
    GameState.anim_style= 'reverse';
    Deltas.prev= Deltas.current.slice();
    Deltas.next= []
    Deltas.perp= [];
    for ( i=0; i<Board.d; i++ ){
      if ( i == x ) {
        Deltas.next.push(
            Deltas.current[i].clone().multiplyScalar(-1));
        Deltas.perp.push(
          new THREE.Vector3(
            0.0,
            Deltas.current[i].length(),
            0.0 ));
      } else {
        Deltas.next.push( Deltas.current[i].slice() );
        Deltas.perp.push( Deltas.current[i].slice() );
      }
    }
    Animus.anim_start();
  },
  random_swap_2: () => {
    x= Math.floor( Math.random() * Board.d );
    y= Math.floor( Math.random() * ( Board.d - 1 ) );
    if ( y >= x ) {
      y++;
    }
    GameState.anim= true;
    GameState.anim_style= 'swap';
    Deltas.prev= Deltas.current.slice();
    Deltas.next= [];
    for ( i=0; i<Board.d; i++ ) {
      if ( i == x ) {
        Deltas.next.push( Deltas.current[y] );
      } else if ( i == y ) {
        Deltas.next.push( Deltas.current[x] );
      } else {
        Deltas.next.push( Deltas.current[i] );
      }
    }
    Deltas.calc_swap_center();
    swap_axis= new THREE.Vector3( 0.0, 0.0, 0.0 );
    for ( i=0; i<Board.d; i++ ) {
      if (( i != x ) && ( i != y )) {
        swap_axis.add( Deltas.current[i] );
      }
    }
    swap_axis.normalize();
    Deltas.perp= [];
    for ( i=0; i<Board.d; i++ ) {
      if (( i != x ) && ( i != y )) {
        Deltas.perp.push( Detlas.current[i] );
      } else {
        Detlas.perp.push(
          Deltas.current[i].clone().sub(
            Deltas.swap_center[i] ).cross(
              swap_axis)).add(
                Deltas.swap_center[i]);
      }
    }
    Animus.anim_start();
  }
};