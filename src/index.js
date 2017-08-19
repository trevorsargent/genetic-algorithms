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

  p.setup = function () {
    p.createCanvas(cW, cH)
  }

  p.draw = function () {
    p.background(background)
  }

  p.mousePressed = function () {}
}

// See https://github.com/processing/p5.js/wiki/Instantiation-Cases
new p5(sketch) // 2nd param can be a canvas html element
