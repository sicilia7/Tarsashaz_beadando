'use strict'

const Lucid = use('Lucid')

class Statement extends Lucid {

    comments(){
        return this.hasMany('App/Model/Comment')
    }

}

module.exports = Statement
