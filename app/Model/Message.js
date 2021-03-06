'use strict'

const Lucid = use('Lucid')

class Message extends Lucid {

    comments() {
        return this.hasMany('App/Model/Comment')
    }

    user() {
        return this.belongsTo('App/Model/User')
    }

}

module.exports = Message
