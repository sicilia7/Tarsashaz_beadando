'use strict'

//const Category = use('App/Model/Category')
//const Recipe = use('App/Model/Recipe')
//const Validator = use('Validator')

class MessageController {

    * main (req, res) {
        yield res.sendView('main')
    }

    * create (req, res) {
        yield res.sendView('messageCreate')
    }

    * doCreate (req, res) {

    } 

    * createStatement (req, res) {
        yield res.sendView('statementCreate')
    }

    * doCreateStatement (req, res) {

    } 

    * show (req, res) {
        yield res.sendView('message')
    }

    * comment (req, res){

    }

    * doComment (req, res){
        
    }

    * edit (req, res) {
        yield res.sendView('messageEdit')
    }

    * doEdit (req, res) {

    }

}

module.exports = MessageController
