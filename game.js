import { Vector2D } from './vector.js'
import { ResourceLoader } from './ResourceLoader.js'
import { InputManager } from './InputManager.js'
import { Sprite } from './Sprite.js'
import { getRandomInt } from './utils.js'

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

    this.animation = [
      { sX: 1678, sY: 2 },
      { sX: 1854, sY: 2 },
      { sX: 1942, sY: 2 },
    ]
    this.index = 0
    this.frame = null
  }

  jump() {
    if (this.jumping) return

    this.vel.y = -15
    this.jumping = true
  }

  update() {
    // animate sprite
    this.index += 0.25
    this.frame = this.animation[Math.floor(this.index) % this.animation.length]

    if (this.jumping) {
      this.frame = this.animation[0]
    }

    // update speed

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
      this.frame.sX,
      this.frame.sY,
      88,
      94,
      this.pos.x,
      this.pos.y,
      this.w,
      this.h
    )
  }
}

class Obstacle {
  TYPES = {
    SMALL_CACTUS: {
      w: 40,
      h: 55,
      sprite: {
        sX: 448,
        sY: 2,
        w: 32,
        h: 72,
      },
    },
    BIG_CACTUS: {
      w: 50,
      h: 65,
      sprite: {
        sX: 652,
        sY: 2,
        w: 50,
        h: 102,
      },
    },
  }

  constructor(x, y, type) {
    this.type = this.TYPES[type]
    this.w = this.type.w
    this.h = this.type.h
    this.pos = new Vector2D(x, y - this.h)
    this.followingObstacleCreated = false
    this.gap = getRandomInt(300, 600)
  }

  update() {
    this.pos.x -= 10
  }

  draw() {
    context.drawImage(
      resourceLoader.get('./assets/sprite.png'),
      this.type.sprite.sX,
      this.type.sprite.sY,
      this.type.sprite.w,
      this.type.sprite.h,
      this.pos.x,
      this.pos.y,
      this.type.w,
      this.type.h
    )
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

function spawnObstacle() {
  // console.log(obstacles)
  let type = getRandomInt(0, 2, true)
  let obstacle

  if (type === 1) {
    obstacle = new Obstacle(canvas.width, canvas.height, 'SMALL_CACTUS')
  } else {
    obstacle = new Obstacle(canvas.width, canvas.height, 'BIG_CACTUS')
  }

  obstacles.push(obstacle)
}

function setup() {
  canvas = document.getElementById('game-canvas')
  context = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = 200

  player = new Player()
  spawnObstacle()

  gameLoop()
}

function update() {
  if (inputManager.isKeyDown('ArrowUp')) {
    player.jump()
  }

  player.update()

  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i]
    obstacle.update()
    // the value below needs to be a multiple of the speed
    if (
      obstacle.pos.x + obstacle.w + obstacle.gap < canvas.width &&
      !obstacle.followingObstacleCreated
    ) {
      spawnObstacle()
      obstacle.followingObstacleCreated = true
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

function gameLoop() {
  update()
  render()

  requestAnimationFrame(gameLoop)
}
