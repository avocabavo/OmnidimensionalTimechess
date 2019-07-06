var Animus= {
	anim_ms: 5000,
	init: () => {},
	anim_start: ()=> {
		Deltas.calc_thetas()
		Animus.start_time= new Date().getTime()
		Animus.end_time= Animus.start_time + Animus.anim_ms
	},
	frame_pass: ()=> {
		currently= new Date().getTime()
		if (currently >= Animus.end_time) {
			Deltas.current= Deltas.next
			Deltas.calc_anchor()
			GameState.anim= false
		} else {
			var progress= (
				Math.PI * 
				(currently - Animus.start_time) / 
				Animus.anim_ms)
			// console.log("progress: " + progress)
			Deltas.update(progress)
			Deltas.calc_anchor()
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
		if (GameState.load || GameState.anim)
			return
		GameState.anim= true
		GameState.anim_style= 'reverse'
		Deltas.prev= Deltas.current.slice()
		Deltas.next= []
		let calculatingV = new THREE.Vector3(0.0, 0.0, 0.0)
		for (let i= 0; i < Deltas.d; i++) {
			if (i == dim) {
				let reversedV= Deltas.current[i].clone()
				reversedV.multiplyScalar(-1)
				Deltas.next.push(reversedV)
			} else {
				Deltas.next.push(Deltas.current[i].clone())
				calculatingV.add(Deltas.current[i])
			}
		}
		Deltas.perp= []
		for (let i= 0; i < Deltas.d; i++) {
			if (i == dim) {
				calculatingV.cross(Deltas.current[i])
				if (calculatingV.lengthSq() == 0.0) {
					calculatingV = new THREE.Vector3(0.0, 1.0, 0.0)
				}
				if (Math.random() < 0.5) {
					calculatingV.multiplyScalar(-1)
				}
				calculatingV.normalize()
				calculatingV.multiplyScalar(Deltas.current[i].length())
				calculatingV.multiplyScalar(1.5)
				Deltas.perp.push(calculatingV)
			} else {
				Deltas.perp.push(Deltas.current[i])
			}
		}
		console.log("prev", Deltas.prev)
		console.log("perp", Deltas.perp)
		console.log("next", Deltas.next)
		Animus.anim_start()
	},
	lone_swap: (dim_one, dim_two)=> {
		if (GameState.load || GameState.anim)
			return
		GameState.anim= true
		GameState.anim_style= 'swap'
		Deltas.prev= Deltas.current.slice()
		Deltas.next= []
		let nonSwapV= new THREE.Vector3(0.0, 0.0, 0.0)
		for (let i= 0; i < Deltas.d; i++) {
			if (i == dim_one) {
				Deltas.next.push(Deltas.current[dim_two].clone())
			} else if (i == dim_two) {
				Deltas.next.push(Deltas.current[dim_one].clone())
			} else {
				Deltas.next.push(Deltas.current[i].clone())
				nonSwapV.add(Deltas.current[i])
			}
		}
		let swapCenter= new THREE.Vector3(0.0, 0.0, 0.0)
		swapCenter.add(Deltas.current[dim_one])
		swapCenter.add(Deltas.current[dim_two])
		swapCenter.multiplyScalar(0.5)
		console.log("swap center", swapCenter)
		Deltas.perp= []
		for (let i= 0; i < Deltas.d; i++) {
			if (i == dim_one || i == dim_two) {
				// let tempV= Deltas.current[i].clone()
				// tempV.sub(swapCenter)
				// let tempL= tempV.length()
				// tempV.cross(nonSwapV)
				// if (tempV.lengthSq() == 0) {
				// 	if (i == dim_one) {
				// 		Deltas.perp.push(new THREE.Vector3(0.0, 1.0, 0.0))
				// 	} else {
				// 		Deltas.perp.push(new THREE.Vector3(0.0, -1.0, 0.0))
				// 	}
				// } else {
				// 	tempV.normalize()
				// 	tempV.multiplyScalar(tempL)
				// 	tempV.add(swapCenter)
				// 	Deltas.perp.push(tempV)
				// }
				let tempV= Deltas.current[i].clone()
				tempV.sub(swapCenter)
				let tempL= tempV.length()
				tempV= new THREE.Vector3(0.0, 1.0, 0.0)
				tempV.multiplyScalar(tempL)
				if (i == dim_one)
					tempV.multiplyScalar(-1)
				tempV.add(swapCenter)
				tempV.multiplyScalar(1.5)
				Deltas.perp.push(tempV)
			} else {
				tempV = Deltas.current[i].clone()
				// tempV.multiplyScalar(2.0)
				Deltas.perp.push(tempV)
			}
		}
		console.log("prev", Deltas.prev)
		console.log("perp", Deltas.perp)
		console.log("next", Deltas.next)
		Animus.anim_start()
	}
}
