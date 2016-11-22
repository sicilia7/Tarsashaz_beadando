'use strict'

const Lucid = use('Lucid')

class Comment extends Lucid {
    message() {
        return this.belongsTo('App/Model/Message')
    }

    use(){
        return this.belongsTo('App/Model/User')
    }

}

module.exports = Comment
