'use strict'

const Statement = use('App/Model/Statement')
const Message = use('App/Model/Message')
const Comment = use('App/Model/Comment')
const User = use('App/Model/User')
const Validator = use('Validator')

class MessageController {

    * main (req, res) {
        const messages = yield Message.all()
        const statements = yield Statement.all()
        const allUsers = yield User.all()
        var users = []
        var activeStatements = []
        var oldStatements = []
        var date = new Date()
        statements.forEach(function(statement){
            if(new Date(statement.deadline) > date){
                activeStatements.push(statement)
            }else{
                oldStatements.push(statement)
            }
        }, this)

        for(let user of allUsers){
            users[user.id] = user.name
        }

        yield res.sendView('main', {
            messages: messages.toJSON(),
            activeStatements: activeStatements,
            oldStatements: oldStatements,
            users: users
        })
    }

    * filter (req, res){
        const filter = yield Message.find(req.param('filter'))
        const AllMessages = yield Message.all()
        const AllStatements = yield Statement.all()
        const AllComments = yield Comment.all()
        const AllUsers = yield User.all()
        const data = req.all()
        var users = []
        for(let user of AllUsers){
            users[user.id] = user.name
        }

        if(data.filter == "own"){
            const messages = []
            AllMessages.forEach(function(element) {
                if(element.user_id == req.currentUser.id){
                    messages.push(element)
                }
            }, this);
            yield res.sendView('main', {
            messages: messages,
            users: users
            })
        }else if(data.filter == "statement"){
            var activeStatements = []
            var oldStatements = []
            var date = new Date()
            AllStatements.forEach(function(statement){
                if(new Date(statement.deadline) > date){
                    activeStatements.push(statement)
                }else{
                    oldStatements.push(statement)
                }
            }, this)
            yield res.sendView('main', {
            activeStatements: activeStatements,
            oldStatements: oldStatements,
            users: users
            })
        }else if(data.filter == "commented"){
            const messages = []
            AllMessages.forEach(function(message) {
                AllComments.forEach(function(element) {
                    if(element.user_id == req.currentUser.id 
                    && element.msg_id == message.id){
                        if(messages.indexOf(message) < 0){
                            messages.push(message)
                        }
                    }
                }, this);
            }, this);
            yield res.sendView('main', {
            messages: messages,
            users: users
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
        message.picture = messageData.inputPicture

        yield message.save()

        res.redirect(`/message/${message.id}`)
    } 

    * createStatement (req, res) {
        const isLoggedIn = yield req.auth.check()

        if (!isLoggedIn || req.currentUser.id !== 1) {
            yield res.redirect('./')
            return
        }

        yield res.sendView('statementCreate')
    }

    * doCreateStatement (req, res) {
        const statementData = req.all()

        const rules = {
            'title': 'required',
            'text': 'required',
            'inputDate': 'required'
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
        statement.picture = statementData.inputPicture

        yield statement.save()

        res.redirect(`/statement/${statement.id}`)

    } 

    * show (req, res) {
        const message = yield Message.find(req.param('id'))
        var comments = []
        var users = []
        const AllComment = yield Comment.all()
        for(let comment of AllComment){
            const uid = comment.user_id
            if(comment.msg_id == message.id){
                const usr = yield User.find(uid);
                users[uid] = usr.name
                comments.push(comment)
            }
        }
        yield message.related('user').load()

        yield res.sendView('message', {
            message: message.toJSON(),
            users: users,
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

    * ajaxComment(req, res){
        const text = req.input('text')
        console.log(text)
        const id = req.param('id')
        console.log(id)
        const rules = {
            'text': 'required'
        }

        if(/\S/.test(text)){

        const comment = new Comment()
        comment.text = text
        comment.user_id = req.currentUser.id
        comment.msg_id = id

        yield comment.save()

        const usr = yield User.find(comment.user_id);
        res.ok({success: true, createdAt: comment.created_at, text: comment.text, username: usr.name});

        }else{
            res.ok({ success: false, error: "Üres komment nem küldhető!" })
            return
        }
    }

    * ajaxCreate(req,res){
        const messageData = req.all()

        const rules = {
            'title': 'required',
            'text': 'required',
        }

        const validation = yield Validator.validateAll(messageData, rules)
        if(validation.fails()){
            res.ok({ success: false, errors: validation.messages() })
            return
        }

        const message = new Message()
        message.title = messageData.title
        message.text = messageData.text
        message.user_id = req.currentUser.id 
        message.picture = messageData.picture

        yield message.save()
        res.ok({success: true, msg_id: message.id});
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

        if(newData.status == 'on'){
            message.status = 1
        }else{
            message.status = 0
        }
        if(newData.text.length > 1){
            message.text = message.text + "\n\n Frissítés: \n" + newData.text
        }
        yield message.save()

        res.redirect(`/message/${message.id}`)
    }

}

module.exports = MessageController
