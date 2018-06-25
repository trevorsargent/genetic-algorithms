// STYLE

// css reset
import 'reset-css/reset.css'

// main style file
// import './style.css'
import p5 from 'p5'

const sketch = (p) => {
	const background = 255
	const cW = p.windowWidth
	const cH = p.windowHeight
	const vectorScale = cW / 100
	const fitnessThreshhold = .5
	const populationSize = 100
	const strandLength = 150
	const mutationRate = .0005

	let obstacles = []

	const START = p.createVector(30, cH / 2)
	const END = p.createVector(cW - 60, cH / 2)

	const calcMaxFitness = (pop) => {
		let max = 0
		pop.forEach(el => {
			if (el.fitness > max) {
				max = el.fitness
			}
		})
		return max
	}

	const isInsideObstacle = (vector, obstacle) => {
		if (vector.x > obstacle.x - obstacle.w / 2 &&
			vector.x < obstacle.x + obstacle.w / 2 &&
			vector.y > obstacle.y - obstacle.h / 2 &&
			vector.y < obstacle.y + obstacle.h / 2) {
			// console.log(true)
			return true;
		}
		return false;
	}

	const encountersObstacle = (el) => {
		let currentPos = START.copy()
		for (var i = 0; i < el.dna.length; i++) {
			currentPos.add(vectorFromAngle(el.dna[i]).mult(vectorScale))
			obstacles.forEach(o => {

				if (isInsideObstacle(currentPos, o)) {
					return true;
				}

			})
		}
		return false
	}

	const calcMinFitness = (pop) => {
		let min = 1
		pop.forEach(el => {
			if (el.fitness < min) {
				min = el.fitness
			}
		})
		return min
	}

	const generateRandomElement = (length) => {
		let data = []

		for (var i = 0; i < length; i++) {
			data.push(randomDnaValue())
		}

		let el = {
			fitness: 0,
			dna: data
		}
		return calcFitness(el)
	}

	const generatePopulation = (generateElement, popSize, dnaLength) => {
		let pop = []
		for (var i = 0; i < popSize; i++) {
			pop.push(generateElement(dnaLength))
		}
		return pop
	}

	const vectorFromAngle = (angle) => {
		return p.createVector(p.cos(angle), p.sin(angle))
	}

	const randomDnaValue = () => {
		return p.random(-p.PI, p.PI)
	}

	const calcFitness = (el) => {

		// add up the end location of the line
		let lineEnd = el.dna.reduce((sum, e) => {
			return sum.add(vectorFromAngle(e).mult(vectorScale))
		}, p.createVector(START.x, START.y))

		let totalTurn = el.dna.reduce((sum, e) => {
			return sum + p.abs(e)
		}, 0)

		const dist = lineEnd.dist(END)
		const goalDist = START.dist(END)
		const distScore = (goalDist - dist) / goalDist * 10
		// dock element ffor every obstacle it hits
		// return total score
		let fitness = p.pow(2, distScore) / totalTurn
		// if (encountersObstacle(el)) {
		// 	fitness *= 2;
		// }
		// fitness *= numObstaclesEncountered(el)
		el.fitness = fitness
		return el
	}

	const selectFromPopulation = (pop) => {
		const max = calcMaxFitness(pop)
		while (true) {
			const r = p.random(max * fitnessThreshhold, max)
			const index = p.floor(p.random(pop.length))
			const candidate = pop[index]
			if (candidate.fitness > r) {
				return candidate
			}
		}
	}

	const mutate = (el) => {
		for (var i = 0; i < el.dna.length; i++) {
			if (p.random(1) < mutationRate) {
				el.dna[i] = randomDnaValue()
			}
		}
		return el
	}

	const crossover = (parentA, parentB) => {
		let child = {
			dna: []
		}

		for (var i = 0; i < parentA.dna.length; i++) {
			// child.dna[i] = p.random(1) >= .5 ? parentA.dna[i] : parentB.dna[i]
			child.dna[i] = i < parentA.dna.length / 2 ? parentA.dna[i] : parentB.dna[i]
		}
		return child
	}

	const produceNextGeneration = (pop) => {
		let newPop = []
		for (var i = 0; i < pop.length; i++) {
			const parentA = selectFromPopulation(pop)
			const parentB = selectFromPopulation(pop)
			const child = calcFitness(mutate(crossover(parentA, parentB)))
			newPop.push(child)
		}
		return newPop
	}

	let population = generatePopulation(generateRandomElement, populationSize, strandLength)




	p.setup = function () {
		p.createCanvas(cW, cH)
		p.fill(255)
	}

	p.keyReleased = () => {
		// p.noLoop()
	}

	p.draw = function () {
		population = produceNextGeneration(population)

		const minFit = calcMinFitness(population)
		const maxFit = calcMaxFitness(population)
		// draw everything
		p.background(background)
		p.stroke(0)

		// draw anchors
		p.ellipse(START.x, START.y, 20, 20)
		p.ellipse(END.x, END.y, 20, 20)

		// draw obstacles
		obstacles.map(o => {
			p.rect(o.x, o.y, o.w, o.h)
		})

		// change frame for drawing population

		// draw population
		p.translate(START.x, START.y)
		population.map(el => {
			// if (el.fitness > .97) {
			// 	p.noLoop()
			// }
			p.push()
			p.fill(0)
			p.stroke(p.map(el.fitness, maxFit, 0, 0, 255))
			el.dna.map(d => {
				// vector from angle d
				const v = vectorFromAngle(d).mult(vectorScale)
				// line from 00 to vector xy
				p.line(0, 0, v.x, v.y)
				// translate to vector xy
				p.translate(v.x, v.y)
			})
			p.pop();
		})

	}

	// p.mouseReleased = () => {
	// 	const ww = 30
	// 	const hh = p.random(50, 100)
	// 	obstacles.push({
	// 		x: p.mouseX - ww / 2,
	// 		y: p.mouseY - hh / 2,
	// 		w: 30,
	// 		h: hh
	// 	})
	// 	return false
	// }
}

// See https://github.com/processing/p5.js/wiki/Instantiation-Cases
new p5(sketch) // 2nd param can be a canvas html element
