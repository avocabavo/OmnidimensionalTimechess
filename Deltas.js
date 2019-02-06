var v3add= ( u, v ) => { return u.add(v); };
var v3scale= ( u, a ) => { return u.multiplyScalar(a); };

var Deltas= {
  init: ( d, squareEdge, gap, boardLift, n ) => {
    Deltas.d= d;
    Deltas.current= [];
    Deltas.current.push(new THREE.Vector3(squareEdge*(1+gap), 0.0, 0.0));
    Deltas.current.push(new THREE.Vector3(0.0, 0.0, -squareEdge*(1+gap)));
    for (var i=2; i<d; i++) {
      Deltas.current.push(Deltas.current[i-2].clone().multiplyScalar( n+1 ).add( boardLift ) );
    }
    Deltas.ever_center = new THREE.Vector3( 0.0, 0.0, 0.0 );
    for (var i=1; i<d; i++ ) {
      Deltas.ever_center.add( Deltas.current[i].clone().multiplyScalar( (n-1) / 2 ) );
    }
  },
  zeroes: () => {
    var zs= [];
    for (var i=0; i<Deltas.d; i++ ) {
      zs.push( new THREE.Vector3( 0.0, 0.0, 0.0 ) );
    }
    return zs;
  },
  para_calc: ( u, v, oper ) => {
    var result= [];
    for (var i=0; i<Deltas.d; i++ ) {
      result.push( oper( u[i].clone(), v[i] ) );
    }
    return result;
  },
  para_calc_c: ( u, a, oper ) => {
    var result= [];
    for (var i=0; i<Deltas.d; i++ ) {
      result.push( oper( u[i].clone(), a ) );
    }
    return result;
  },
  update: ( progress ) => {
    if ( progress < ( Math.PI / 2 ) ) {
      use_prev= Math.cos( progress );
      use_next= 0.0;
    } else {
      use_prev= 0.0;
      use_next= - Math.cos( progress );
    }
    use_perp= Math.sin( progress );
    Deltas.calc_current( use_prev, use_perp, use_prev );
  },
  calc_current: ( use_prev, use_perp, use_next ) => {
    Deltas.current= 
      Deltas.para_calc(
        Deltas.para_calc(
          Deltas.para_calc_c(
            Deltas.prev.clone(), use_prev, v3scale),
          Deltas.para_calc_c(
            Deltas.perp.clone(), use_perp, v3scale),
          v3add),
        Deltas.para_calc_c(
          Deltas.next.clone(), use_next, v3scale),
        v3add);
    Deltas.anchor = Deltas.ever_center.clone();
    for ( i=1; i<d; i++ ) {
      Deltas.anchor.add( Deltas.current.clone().multiplyScalar( -(n-1) / 2 ) );
    }
  },
  calc_swap_center: () => {
    Deltas.swap_center= 
      Deltas.para_calc_c(
        Deltas.para_calc(
          Deltas.prev,
          Deltas.next,
          v3add),
        0.5,
        v3scale);
  }
};
