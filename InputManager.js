class InputManager {
  constructor() {
    this._keysDown = []

    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
  }

  _onKeyDown = (event) => {
    this._keysDown[event.key] = true
  }

  _onKeyUp = (event) => {
    console.log(this._keysDown)
    this._keysDown[event.key] = false
  }

  isKeyDown = (key) => {
    console.log(this._keysDown)
    return !!this._keysDown[key]
  }
}

export { InputManager }
