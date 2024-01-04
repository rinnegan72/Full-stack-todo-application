'use strict'

class Title {
  get rules () {
    return {
      'title': 'required|max:255'
       }
  }
}

module.exports = Title
