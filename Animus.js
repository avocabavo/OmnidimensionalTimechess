var Animus= {
  init: ( anim_ms ) => {
    Animus.anim_ms= anim_ms;
  },
  anim_start: () => {
    Animus.start_time= new Date().getTime();
    Animus.end_time= Animus.start_time + Animus.anim_ms;
  },
  frame_pass: () => {
    currently= new Date().getTime();
    if ( currently >= Animus.end_time ) {
      Deltas.current= Deltas.next();
      GameState.anim= false;
    } else {
      progress= (
        Math.PI * 
        ( currently - Animus.start_time ) / 
        Animus.anim_ms);
      Deltas.update( progress );
    }
    Board.reposition_all();
  }
};
