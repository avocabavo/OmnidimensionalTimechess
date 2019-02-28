var Board= {
  init: (d, n)=> {
    Board.d= d
    Board.n= n
    const squareEdge= 1.0
    const gap= 0.1
    const boardLift= new THREE.Vector3(0.0, 0.5, 0.0)
    Deltas.init(d, squareEdge, gap, boardLift, n)
    
    whiteSquareMaterial= new THREE.MeshStandardMaterial({color: 0xffffff})
    blackSquareMaterial= new THREE.MeshStandardMaterial({color: 0x444444})
    whiteSquareHotMaterial= new THREE.MeshStandardMaterial({color: 0xccccff})
    blackSquareHotMaterial= new THREE.MeshStandardMaterial({color: 0x000044})
    squareGeometry= new THREE.BoxBufferGeometry(squareEdge, squareEdge, squareEdge)

    Board.boardGroup= new THREE.Group()
    Board.squaresArray= []
    Board.currentCoord= []
    for (let i = 0; i < d; i++) {
      Board.currentCoord.push(0)
    }
    squaresCount= Math.pow(n, d)
    for (let s= 0; s < squaresCount; s++) {
      var mys= {}
      mys.black= Board.currentCoord.reduce(Board.reducer) % 2 == 0
      if (mys.black)
      {
        mys.mesh= new THREE.Mesh(squareGeometry, blackSquareMaterial)
      } else {
        mys.mesh= new THREE.Mesh(squareGeometry, whiteSquareMaterial)
      }
      mys.mesh.square= mys
      mys.coord= Board.currentCoord.slice(0)
      mys.occupant= null
      mys.ghost= null
      cvect= Deltas.current.reduce(
        Board.positioner,
        new THREE.Vector3(0.0, 0.0, 0.0))
      mys.mesh.position.set(cvect.x, cvect.y, cvect.z)
      mys.mesh.matrixAutoUpdate= false
      mys.mesh.updateMatrix()
      Board.boardGroup.add(mys.mesh)
      Board.squaresArray.push(mys)

      Board.currentCoord[0]++
      for (let j=0; j<(d-1); j++) {
        if (Board.currentCoord[j] == n) {
          Board.currentCoord[j]= 0
          Board.currentCoord[j+1]++
        } else {
          break
        }
      }
    }
  },
  reducer: (total, next)=> { return (total + next) },
  positioner: (total, next, index)=> {
    tempV = next.clone()
    tempV.multiplyScalar(Board.currentCoord[index])
    tempV.add(total)
    return tempV
  },
  reposition_all: ()=> {
    Board.squaresArray.forEach(square=> {
      Board.currentCoord= square.coord
      cvect= Deltas.para_calc_c(
        Deltas.current,
        Deltas.anchor,
        v3add
        ).reduce(
          Board.positioner, new THREE.Vector3(0.0, 0.0, 0.0))
      square.mesh.position.set(cvect.x, cvect.y, cvect.z)
      square.mesh.updateMatrix()
    })
  }
}
