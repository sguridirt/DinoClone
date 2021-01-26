class Vector2D {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  distance(vector) {
    return Math.sqrt(
      Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2)
    )
  }

  add(vector) {
    this.x += vector.x
    this.y += vector.y
  }

  multiply(constant) {
    this.x *= constant
    this.y *= constant
  }

  normalize() {
    let mag = this.magnitude()
    let x = this.x / mag
    let y = this.y / mag
    return new Vector2D(x, y)
  }

  dot(vector) {
    let u = this.normalize()
    let v = vector.normalize()

    return Math.acos(u * v)
  }
}

export { Vector2D }
