'use strict'

const Statement = use('App/Model/Statement')
const Message = use('App/Model/Message')
const Comment = use('App/Model/Comment')
const Validator = use('Validator')

class MessageController {

    * main (req, res) { //TODO: szűrés: kell-e külön? Kell-e route? 
        const messages = yield Message.all()
        const statements = yield Statement.all()

        yield res.sendView('main', {
            messages: messages.toJSON(),
            statements: statements.toJSON()
        })
    }

    * create (req, res) {
        const isLoggedIn = yield req.auth.check()

        if (!isLoggedIn) {
            yield res.sendView('welcome')
            return
        }

        yield res.sendView('messageCreate')
    }

    * doCreate (req, res) {
        const messageData = req.all()

        const rules = {
            'title': 'required',
            'text': 'required',
        }

        const validation = yield Validator.validateAll(messageData, rules)
        if(validation.fails()){
            yield req.withAll().andWith({ errors: validation.messages() }).flash()

            res.redirect('message/create')
            return
        }

        const message = new Message()
        message.title = messageData.title
        message.text = messageData.text
        message.user_id = req.currentUser.id 
        if( messageData.picture == "" ) 
        {
            message.picture = "nopicture.jpg"
        }else{
            message.picture = messageData.picture
        }

        yield message.save()

        res.redirect('/message/${message.id}')
    } 

    * createStatement (req, res) {
        const isLoggedIn = yield req.auth.check()

        if (!isLoggedIn || req.currentUser.id !== 1) {
            yield res.sendView('welcome')
            return
        }

        yield res.sendView('statementCreate')
    }

    * doCreateStatement (req, res) {
        const statementData = req.all()

        const rules = {
            'title': 'required',
            'text': 'required',
            'deadline': 'required'//Timestamp?
        }

        const validation = yield Validator.validateAll(statementData, rules)
        if(validation.fails()){
            yield req.withAll().andWith({ errors: validation.messages() }).flash()

            res.redirect('statement/create')
            return
        }

        const statement = new Statement()
        statement.title = statementData.title
        statement.text = statementData.text
        statement.deadline = statementData.deadline
        statement.user_id = 1 
        if( statementData.picture == "" ) 
        {
            statement.picture = "nopicture.jpg"
        }else{
            statement.picture = statementData.picture
        }

        yield statement.save()

        res.redirect('/statement/${statement.id}')

    } 

    * show (req, res) {
        const message = yield Message.find(req.param('id'))
        const comments = yield message.comments()

        yield res.sendView('message', {
            message: message.toJSON(),
            comments: comments.toJSON()
        })
    }

    * showStatement (req, res) {
        const statement = yield Statement.find(req.param('id'))
        const comments = yield statement.comments()

        yield res.sendView('statement', {//TODO: statement view
            statement: statement.toJSON(),
            comments: comments.toJSON()
        })
    }

    * doComment (req, res){
        //TODO
    }

    * edit (req, res) {
        const id = req.param('id')
        const message = yield Message.find(id)
        if(req.currentUser.id !== 1){
            res.redirect('/message/${message.id}')
        }

        yield res.sendView('messageEdit', {
            message: message.toJSON()
        })
    }

    * doEdit (req, res) {
        //TODO
    }

}

module.exports = MessageController
