var Piece= {
	new: (team, rule, starting_square)=> {
		let p= {
			team: team,
			rule: rule,
			alive: true,
			current_square: starting_square,
			biography: [],
			reachable_squares: ()=> {

			},
			move_to: (destination)=> {

			},
			die_at: (death_square)=> {

			}
		}
		starting_square.occupant= p
		return p
	}
}
