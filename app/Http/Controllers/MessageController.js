'use strict'

const Statement = use('App/Model/Statement')
const Message = use('App/Model/Message')
const Comment = use('App/Model/Comment')
const Validator = use('Validator')

class MessageController {

    * main (req, res) {
        const messages = yield Message.all()
        const statements = yield Statement.all()

        yield res.sendView('main', {
            messages: messages.toJSON(),
            statements: statements.toJSON()
        })
    }

    * filter (req, res){
        const filter = yield Message.find(req.param('filter'))
        const AllMessages = yield Message.all()
        const AllStatements = yield Statement.all()

        if(filter == "own"){
            const messages = []
            allmessages.forEach(function(element) {
                if(element.user_id == currentUser.id){
                    messages.push(element)
                }
            }, this);
            yield res.sendView('main', {
            messages: messages.toJSON()
            })
        }else if(filter == "statements"){
            yield res.sendView('main', {
            statements: AllStatements.toJSON()
            })
        }else if(filter == "commented"){
            const messages = []
            allmessages.forEach(function(message) {
                message.comments.forEach(function(element) {
                    if(element.user_id == currentUser.id){
                        messages.push(message)
                    }
                }, this);
            }, this);
            yield res.sendView('main', {
            messages: messages.toJSON()
            })
        }else{
            res.redirect('/messages')
        }
    }

    * create (req, res) {
        const isLoggedIn = yield req.auth.check()

        if (!isLoggedIn) {
            yield res.redirect('/')
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

        res.redirect(`/message/${message.id}`)
    } 

    * createStatement (req, res) {
        const isLoggedIn = yield req.auth.check()

        if (!isLoggedIn || req.currentUser.id !== 1) {
            yield res.redirect('./')
            return
        }

        yield res.sendView('/statementCreate')
    }

    * doCreateStatement (req, res) {
        const statementData = req.all()

        const rules = {
            'title': 'required',
            'text': 'required',
            'inputDate': 'required'//Timestamp?
        }

        const validation = yield Validator.validateAll(statementData, rules)
        if(validation.fails()){
            yield req.withAll().andWith({ errors: validation.messages() }).flash()

            res.redirect('../statement/create')
            return
        }

        const statement = new Statement()
        statement.title = statementData.title
        statement.text = statementData.text
        statement.deadline = statementData.inputDate
        statement.user_id = 1 
        if( statementData.picture == "" ) 
        {
            statement.picture = "nopicture.jpg"
        }else{
            statement.picture = statementData.picture
        }

        yield statement.save()

        res.redirect(`/statement/${statement.id}`)

    } 

    * show (req, res) {
        const message = yield Message.find(req.param('id'))
        var comments = yield message.comments()
        yield message.related('user').load()

        console.log(Object.prototype.toString.call( comments ))

        yield res.sendView('message', {
            message: message.toJSON(),
            comments: comments
        })
    }

    * showStatement (req, res) {
        const statement = yield Statement.find(req.param('id'))

        yield res.sendView('statement', {
            statement: statement.toJSON()
        })
    }

    * doComment (req, res){
        const commentData = req.all()
        const id = req.param('id')
        const rules = {
            'text': 'required'
        }

        const validation = yield Validator.validateAll(commentData, rules)
        if(validation.fails()){
            yield req.withAll().andWith({ errors: validation.messages() }).flash()

            res.redirect('./')
            return
        }

        const comment = new Comment()
        comment.text = commentData.text
        comment.user_id = req.currentUser.id
        comment.msg_id = id

        yield comment.save()

        res.redirect('./')

    }

    * edit (req, res) {
        const id = req.param('id')
        const message = yield Message.find(id)
        if(req.currentUser.id !== 1){
            res.redirect(`/message/${message.id}`)
        }

        yield res.sendView('messageEdit', {
            message: message.toJSON()
        })
    }

    * doEdit (req, res) {
        const newData = req.all()
        const id = req.param('id')
        const message = yield Message.find(id)

        message.status = newData.status
        if(message.text.length > 1){
            message.text = message.text + "\n\n Frissítés: \n" + newData.text
        }
        yield message.save()

        res.redirect(`/message/${message.id}`)
    }

}

module.exports = MessageController
