// STYLE

// css reset
import 'reset-css/reset.css'

// main style file
import './style.css'

function component() {
  var element = document.createElement('h1')

  var days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  let string = "It's "
  string += days[new Date().getDay()]
  string += " – Get. Shit. Done!"

  element.innerHTML = string

  return element
}

document.body.appendChild(component())
