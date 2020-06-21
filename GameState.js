var GameState= {
	load: true,
	anim: false,
	calc: false,
	turn: 0,
	offer: false,
	lysis: false,
	move_list: [],
	undo: () => {
		if (move_list.length < 1)
			return
		oops = move_list.pop()
		oops.undo()
	}
}
