import Engine from './Engine.js'

var engine: Engine

// The main entry point to the application.
window.onload = () => {
  engine = new Engine()
  engine.start()
}

window.onresize = () => {
  engine.resize()
}
