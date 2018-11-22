var Animus= {
    random_swap_2: function() {
      //console.debug('Anima run A');
      dim_one= Math.floor( Math.random() * d );
      dim_two= Math.floor( Math.random() * ( d - 1 ) );
      if ( dim_two >= dim_one ) {
        dim_two++;
      }
      //console.debug('Anima run B');
      TCUtil.lone_swap( dim_one, dim_two );
      //console.debug('Anima run C');
    },
    swap_anim_ms: 3000
  };
  
  var Deltas= {
    zeroes: function() {
      zs= [];
      for ( i = 0; i < Deltas.d; i++ ) {
        zs.push( new THREE.Vector3( 0, 0, 0 ) );
      }
      return zs;
    },
    add: function( u, v ) {
      sum= [];
      for ( i = 0; i < Deltas.d; i++ ) {
        sum.push( u[i].clone().add( v[i] ) );
      }
      return sum;
    },
    add_common: function( u, v ) {
      sum= [];
      for ( i = 0; i < Deltas.d; i++ ) {
        sum.push( u[i].clone().add( v ) );
      }
      return sum;
    },
    subtract: function( u, v ) {
      difference= [];
      for ( i = 0; i < Deltas.d; i++ ) {
        difference.push( u[i].clone().sub( v[i] ) );
      }
      return difference;
    },
    subtract_common: function( u, v ) {
      difference= [];
      for ( i = 0; i < Deltas.d; i++ ) {
        difference.push( u[i].clone().sub( v ) );
      }
      return difference
    },
    cross: function( u, v ) {
      product= [];
      for ( i = 0; i < Deltas.d; i++ ) {
        product.push( u[i].clone().cross( v[i] ) );
      }
      return product;
    },
    cross_common: function( u, v ) {
      product= [];
      for ( i = 0; i < Deltas.d; i++ ) {
        product.push( u[i].clone().cross( v ) );
      }
      return product;
    },
    scale: function( v, a ) {
      scaled= [];
      for ( i = 0; i < Deltas.d; i++ ) {
        scaled.push( v[i].clone().multiplyScalar( a ) );
      }
      return scaled;
    },
    update: function( progress ) {
      if ( progress < ( Math.PI / 2 ) ) {
        use_old= Math.cos( progress );
        use_new= 0.0;
      } else {
        use_old= 0.0;
        use_new= - Math.cos( progress );
      }
      use_perp= Math.sin( progress );
      Deltas.current= 
        Deltas.add(
          Deltas.add(
            Deltas.scale( Deltas.prev, use_old ),
            Deltas.scale( Deltas.perp, use_perp )
          ),
          Deltas.scale( Deltas.next, use_new )
        );
    },
    calc_swap_axis: function( x, y ) {
      swap_axis= new THREE.Vector3( 0, 0, 0 );
      for ( i = 0; i < Deltas.d; i++ ) {
        if ( i == x || i == y ) {
          swap_axis.add( Deltas.current[i].clone().multiplyScalar( 0.1 ) );
        } else {
          swap_axis.add( Deltas.current[i] );
        }
      }
      if ( swap_axis.lengthSq == 0.0 ) {
        swap_axis= new THREE.Vector3( 0.0, 0.0, 0.0 );
      }
      swap_axis.normalize();
      if (Math.random() >= 0.5) {
        swap_axis.multiplyScalar(-1);
      }
      return swap_axis;
    },
    calc_swap_center: function() {
      Deltas.swap_center= [];
      for ( i = 0; i < Deltas.d; i++ ) {
        Deltas.swap_center.push( Deltas.prev[i].clone().add( Deltas.next[i] ).multiplyScalar( 0.5 ) );
      }
    }
  };
  
  var TCUtil = {};
  
  TCUtil.HeatUp= function( target ) {
    if ( target.black ) {
      target.mesh.material= blackSquareHotMaterial;
    } else {
      target.mesh.material= whiteSquareHotMaterial;
    }
  };
  
  TCUtil.CoolDown= function( target ) {
    if ( target.black ) {
      target.mesh.material= blackSquareMaterial;
    } else {
      target.mesh.material= whiteSquareMaterial;
    }
  };
  
  TCUtil.loneRook= function() {
    loader.load(
      'Rook.gltf',
      function ( gltf ) {
  //console.log( gltf );
          rook = gltf.scene.children[0];
        rook.scale.set( 0.5, 0.5, 0.5 );
        rook.position.set( 0, 0.5, 0 );
        rook.updateMatrix();
        scene.add( rook );
  //console.log( rook );
  //console.log( rook.material );
      },
      function ( xhr ) {
  //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      function ( error ) {
        console.log( 'An error happened while trying to load a Rook.');
      }
    );
  };
  
  TCUtil.initBoard= function( ) {
    n= Deltas.n;
    d= Deltas.d;
    var squareEdge = 1.0;
    var gap = 0.1;
    var boardLift = new THREE.Vector3( 0, 0.5, 0 );
    boardGroup = new THREE.Group();
  
    whiteSquareMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff } );
    blackSquareMaterial = new THREE.MeshStandardMaterial( { color: 0x444444 } );
    whiteSquareHotMaterial = new THREE.MeshStandardMaterial( { color: 0xccccff } );
    blackSquareHotMaterial = new THREE.MeshStandardMaterial( { color: 0x000044 } );
  
    var squareGeometry = new THREE.BoxBufferGeometry(squareEdge, squareEdge, squareEdge);
    boardGroup = new THREE.Group();
    Deltas.current= [];
    Deltas.current.push( new THREE.Vector3( squareEdge * ( 1 + gap ), 0, 0 ) );
    Deltas.current.push( new THREE.Vector3( 0, 0, -squareEdge * ( 1 + gap ) ) );
    for ( i = 2; i < d; i++ ) {
      Deltas.current.push( Deltas.current[i-2].clone().multiplyScalar( n + 1 ).add( boardLift ) );
    }
  
  
    squaresArray= [];
    TCUtil.currentCoord= [];
    for ( i = 0; i < d; i++ ) {
      TCUtil.currentCoord.push(0);
    }
    squaresCount = Math.pow( n, d );
    TCUtil.reducer = function( total, next ) { return( total + next ) };
    TCUtil.positioner = function( total, next, index ) {
        return( total.add( next.clone().multiplyScalar( TCUtil.currentCoord[index] ) ) );
    };
    for ( s = 0; s < squaresCount; s++ ) {
        var mys = {};
        mys.black = TCUtil.currentCoord.reduce(TCUtil.reducer) % 2 == 0;
        if ( mys.black )
        {
            mys.mesh = new THREE.Mesh( squareGeometry, blackSquareMaterial );
        } else {
            mys.mesh = new THREE.Mesh( squareGeometry, whiteSquareMaterial );
        }
        mys.mesh.square = mys;
        mys.coord = TCUtil.currentCoord.slice(0);
        mys.occupant = null;
        mys.ghost = null;
  
      cvect= Deltas.current.reduce( TCUtil.positioner, new THREE.Vector3( 0, 0, 0 ) );
        mys.mesh.position.set( cvect.x, cvect.y, cvect.z );
  
        mys.mesh.matrixAutoUpdate = false;
        mys.mesh.updateMatrix();
        boardGroup.add( mys.mesh );
  
        squaresArray.push( mys );
  
        TCUtil.currentCoord[0]++;
        for ( j = 0; j < d - 1; j++ ) {
            if ( TCUtil.currentCoord[j] == n ) {
                TCUtil.currentCoord[j] = 0;
                TCUtil.currentCoord[j+1]++
            } else {
                break;
            }
        }
    }
    //console.log( squaresArray );
  
    scene.add( boardGroup );
  };
  
  TCUtil.lone_swap= function( x, y ) {
    //console.debug('Anima run D');
    if ( gState.load || gState.anim ) { return };
    if ( x == y ) { return };
    gState.anim= true;
    gState.anim_style= 'swap';
    //console.debug('Anima run E');
    Deltas.prev= Deltas.current.slice();
    Deltas.next= [];
    for ( i = 0; i < Deltas.d; i++ ) {
      if ( i == x ) {
        Deltas.next.push( Deltas.current[y] );
      } else if ( i == y ) {
        Deltas.next.push( Deltas.current[x] );
      } else {
        Deltas.next.push( Deltas.current[ i ] );
      }
    }
  
    Deltas.calc_swap_center();
    //console.debug('Anima run F');
  
    Deltas.prev= Deltas.subtract( Deltas.prev, Deltas.swap_center );
    Deltas.next= Deltas.subtract( Deltas.next, Deltas.swap_center );
  
    swap_axis= Deltas.calc_swap_axis( x, y );
  
    Deltas.perp= [];
  
    for ( i = 0; i < Deltas.d ; i++ ) {
      if ( i != x && i != y ) {
        Deltas.perp.push( Deltas.prev[i] );
      } else {
        Deltas.perp.push( Deltas.prev[i].clone().cross( swap_axis ) );
        Deltas.perp[i].normalize();
        Deltas.perp[i].multiplyScalar( Deltas.prev[i].length() );
      }
    }
    //console.debug('Anima run G');
    
    //console.debug(Deltas.prev);
    //console.debug(Deltas.perp);
    //console.debug(Deltas.next);
  
    Animus.anim_start= new Date().getTime();
    Animus.anim_end= Animus.anim_start + Animus.swap_anim_ms;
    //console.debug('Anima run H');
  };
  
  TCUtil.reposition_all= function() {
    //console.debug('Anima run N');
    squaresArray.forEach(square => {
      //console.debug('reposition_one: ' + i);
      //console.debug('Anima run O');
      TCUtil.currentCoord= square.coord;
      //console.debug('Anima run P');
      cvect= Deltas.add( Deltas.swap_center, Deltas.current ).reduce( TCUtil.positioner, new THREE.Vector3( 0, 0, 0 ) );
      //console.debug('Anima run Q');
      square.mesh.position.set( cvect.x, cvect.y, cvect.z );
      //console.debug('Anima run R');
      square.mesh.updateMatrix();
      //console.debug('Anima run S');
    });
    //console.debug('Anima run T');
  };
  