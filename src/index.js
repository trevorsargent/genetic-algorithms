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
  const vectorScale = 10
  const fitnessThreshhold = .5
  const populationSize = 100
  const strandLength = 100
  const mutationRate = .01

  const calcMaxFitness = (pop) => {
    let max = 0
    pop.forEach(el => {
      const fit = calcFitness(el)
      if (fit > max) {
        max = fit
      }
    })
    return max
  }

  const generateRandomElement = (length) => {
    let data = []

    for (var i = 0; i < length; i++) {
      data.push(randomDnaValue())
    }
    return data
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
    return p.random(-p.PI * .9, p.PI * .9)
  }

  const calcFitness = (el) => {

    // add up the end location of the line
    let lineEnd = el.reduce((sum, e) => {
      return sum.add(vectorFromAngle(e).mult(vectorScale))
    }, START.copy())

    const dist = lineEnd.dist(END)
    const goalDist = START.dist(END)
    const distScore = (goalDist - dist) / goalDist
    // dock element ffor every obstacle it hits
    // return total score
    const fitness = distScore
    return fitness
  }

  const selectFromPopulation = (pop) => {
    const max = calcMaxFitness(pop)
    while (true) {
      const r = p.random(max * fitnessThreshhold, 1)
      const index = p.floor(p.random(pop.length))
      const candidate = pop[index]
      if (calcFitness(candidate) > r) {
        return candidate
      }
    }
  }

  const mutate = (el) => {
    for (var i = 0; i < el.length; i++) {
      if (p.random(1) < mutationRate) {
        el[i] = randomDnaValue()
      }
    }
    return el
  }

  const crossover = (parentA, parentB) => {
    let child = []

    for (var i = 0; i < parentA.length; i++) {
      // child[i] = p.random(1) >= .5 ? parentA[i] : parentB[i]
      child[i] = i < parentA.lenght / 2 ? parentA[i] : parentB[i]
    }
    return child
  }

  const produceNextGeneration = (pop) => {
    let newPop = []
    for (var i = 0; i < pop.length; i++) {
      const parentA = selectFromPopulation(pop)
      const parentB = selectFromPopulation(pop)
      const child = mutate(crossover(parentA, parentB))
      newPop.push(child)
    }
    return newPop
  }

  let population = generatePopulation(generateRandomElement, populationSize, strandLength)

  const START = p.createVector(30, cH / 2)
  const END = p.createVector(cW - 30, cH / 2)

  let obstacles = []

  p.setup = function () {
    p.createCanvas(cW, cH)
    p.fill(255)
  }

  p.draw = function () {
    population = produceNextGeneration(population)

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
    p.push()
    p.translate(START.x, START.y)

    // draw population
    population.map(el => {
      p.push()
      p.fill(0)
      el.map(d => {
        // vector from angle d
        const v = vectorFromAngle(d).mult(vectorScale)
        // line from 00 to vector xy
        p.line(0, 0, v.x, v.y)
        // translate to vector xy
        p.translate(v.x, v.y)
      })
      p.pop()
    })
    p.pop()
  }

  p.mouseReleased = () => {
    const ww = 30
    const hh = p.random(50, 100)
    obstacles.push({
      x: p.mouseX - ww / 2,
      y: p.mouseY - hh / 2,
      w: 30,
      h: hh
    })
    return false
  }
}

// See https://github.com/processing/p5.js/wiki/Instantiation-Cases
new p5(sketch) // 2nd param can be a canvas html element
