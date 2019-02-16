var Animus= {
  anim_ms: 3000,
  init: ( anim_ms ) => {
    Animus.anim_ms= anim_ms
  },
  anim_start: () => {
    Animus.start_time= new Date().getTime()
    Animus.end_time= Animus.start_time + Animus.anim_ms
  },
  frame_pass: () => {
    currently= new Date().getTime()
    if (currently >= Animus.end_time) {
      Deltas.current= Deltas.next()
      GameState.anim= false
    } else {
      progress= (
        Math.PI * 
        (currently - Animus.start_time) / 
        Animus.anim_ms);
      Deltas.update(progress)
    }
    Board.reposition_all()
  },
  random_reverse_1: ()=> {
    var dim= Math.floor(Math.random() * Deltas.d)
    Animus.lone_reverse(dim)
  },
  random_swap_2: ()=> {
    var dim_one= Math.floor(Math.random() * d)
    var dim_two= Math.floor(Math.random() * (d - 1))
    if (dim_two >= dim_one) {
      dim_two++
    }
    Animus.lone_swap(dim_one, dim_two)
  },
  lone_reverse: (dim)=> {
    if (gState.load || gState.anim)
      return
    gState.anim= true
    gState.anim_style= 'reverse'
    Deltas.prev= Deltas.current.slice()
    Deltas.next= []
    for(let i= 0; i < Deltas.d; i++) {
      
    }
    // Pick up Here
  }
}
