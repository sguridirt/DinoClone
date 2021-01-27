import { Vector2D } from './vector.js'
import { ResourceLoader } from './ResourceLoader.js'
import { InputManager } from './InputManager.js'

let canvas
let context
let resourceLoader
let inputManager

class Player {
  constructor() {
    this.w = 60
    this.h = 70
    this.pos = new Vector2D(20, canvas.height - this.h)
    this.vel = new Vector2D(0, 0)

    this.jumping = false
  }

  jump(dt) {
    if (this.jumping) return

    this.vel.y = -16
    this.jumping = true
  }

  update(dt) {
    this.vel.y += 1 //gravity

    this.pos.y += this.vel.y

    if (this.pos.y >= canvas.height - this.h) {
      this.jumping = false
      this.pos.y = canvas.height - this.h
      this.vel.y = 0
    }
  }

  draw(context) {
    context.drawImage(
      resourceLoader.get('./assets/sprite.png'),
      1339,
      5,
      84,
      98,
      this.pos.x,
      this.pos.y,
      this.w,
      this.h
    )
  }
}

class Obstacle {
  constructor(x, y) {
    this.w = 40
    this.h = 60
    this.pos = new Vector2D(x, y - this.h - 4)
  }

  update() {
    this.pos.x -= 5
  }

  draw() {
    context.fillStyle = 'grey'
    context.fillRect(this.pos.x, this.pos.y, this.w, this.h)
  }
}

function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(x2 > x1 + w1 || x1 > x2 + w2 || y2 > y1 + h1 || y1 > y2 + h2)
}

let player
let obstacles = []
let gameState = {
  current: 0,
  getReady: 1,
  game: 2,
  gameOver: 3,
}

inputManager = new InputManager()

resourceLoader = new ResourceLoader()
resourceLoader.load('./assets/sprite.png')
resourceLoader.onReady(setup)

function setup() {
  canvas = document.getElementById('game-canvas')
  context = canvas.getContext('2d')

  canvas.width = 800
  canvas.height = 200

  player = new Player()
  obstacles.push(new Obstacle(canvas.width + 200, canvas.height, 40, 60))

  gameLoop()
}

function update(deltaTime) {
  // check for jump
  if (inputManager.isKeyDown('ArrowUp')) {
    player.jump(deltaTime)
  }

  player.update(deltaTime)

  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i]
    obstacle.update(deltaTime)
    // the value below needs to be a multiple of the speed
    if (obstacle.pos.x === 250) {
      obstacles.push(new Obstacle(canvas.width, canvas.height))
    }
    if (obstacle.pos.x + obstacle.w <= 0) {
      obstacles.splice(i, 1)
    }

    if (
      rectIntersect(
        player.pos.x,
        player.pos.y,
        player.w,
        player.h,
        obstacle.pos.x,
        obstacle.pos.y,
        obstacle.w,
        obstacle.h
      )
    ) {
      console.log('Collide!')
    }
  }
}

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i]
    obstacle.draw()
  }

  player.draw(context)
}

var lastTime
function gameLoop() {
  var now = Date.now()
  var deltaTime = (now - lastTime) / 1000.0

  update(deltaTime)
  render()

  lastTime = now
  requestAnimationFrame(gameLoop)
}
