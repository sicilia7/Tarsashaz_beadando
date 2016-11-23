'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  messages () {
    return this.hasMany('App/Model/Message')
  }

  comments () {
    return this.hasMany('App/Model/Comment')
  }

}

module.exports = User
