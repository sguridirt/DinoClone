class ResourceLoader {
  constructor() {
    this.resourceCache = {}
    this.readyCallbacks = []
  }

  load(urlOrArray) {
    if (urlOrArray instanceof Array) {
      urlOrArray.forEach(function (url) {
        this._load(url)
      })
    } else {
      this._load(urlOrArray)
    }
  }

  _load(url) {
    let that = this

    if (this.resourceCache[url]) {
      return this.resourceCache[url]
    } else {
      let img = new Image()
      img.onload = function () {
        that.resourceCache[url] = img

        if (that.isReady()) {
          that.readyCallbacks.forEach(function (func) {
            func()
          })
        }
      }
      this.resourceCache[url] = false
      img.src = url
    }
  }

  get(url) {
    return this.resourceCache[url]
  }

  isReady() {
    let ready = true
    for (var k in this.resourceCache) {
      if (this.resourceCache.hasOwnProperty(k) && !this.resourceCache[k]) {
        ready = false
      }
    }
    return ready
  }

  onReady(func) {
    this.readyCallbacks.push(func)
  }
}

export { ResourceLoader }
