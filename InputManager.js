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
    this._keysDown[event.key] = false
  }

  isKeyDown = (key) => {
    return !!this._keysDown[key]
  }
}

export { InputManager }
