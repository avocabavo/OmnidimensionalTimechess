var Animus= {
	anim_ms: 3000,
	init: () => {},
	anim_start: ()=> {
		Animus.start_time= new Date().getTime()
		Animus.end_time= Animus.start_time + Animus.anim_ms
	},
	frame_pass: ()=> {
		currently= new Date().getTime()
		if (currently >= Animus.end_time) {
			Deltas.current= Deltas.next
			GameState.anim= false
		} else {
			var progress= (
				Math.PI * 
				(currently - Animus.start_time) / 
				Animus.anim_ms)
			// console.log("progress: " + progress)
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
		if (GameState.load || GameState.anim)
			return
		GameState.anim= true
		GameState.anim_style= 'reverse'
		Deltas.prev= Deltas.current.slice()
		Deltas.next= []
		let calculatingV = new THREE.Vector3(0.0, 0.0, 0.0)
		for(let i= 0; i < Deltas.d; i++) {
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
				Deltas.perp.push(calculatingV)
			} else {
				Deltas.perp.push(Deltas.current[i])
			}
		}
		for (let i= 0; i < Deltas.d; i++) {
			Deltas.perp[i].multiplyScalar(1.08)
		}
		Deltas.calc_thetas()
		
		Animus.anim_start()
	},
	lone_swap: (dim_one, dim_two)=> {

		Animus.anim_start()
	}
}
