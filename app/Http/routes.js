'use strict'

const Route = use('Route')

Route.on('/').render('welcome')
Route.get('/messages', 'MessageController.main')
Route.post('/messages/filter', 'MessageController.filter')
Route.get('/message/create', 'MessageController.create').middleware('auth')
Route.post('/message/create', 'MessageController.doCreate').middleware('auth') 
Route.get('/statement/create', 'MessageController.createStatement') //auth
Route.post('/statement/create', 'MessageController.doCreateStatement').middleware('auth')

Route.get('/message/:id', 'MessageController.show') //auth
Route.get('/statement/:id', 'MessageController.showStatement')
Route.get('/message/:id/edit', 'MessageController.edit') //auth
Route.post('/message/:id/edit', 'MessageController.doEdit') //auth
Route.post('/message/:id/comment', 'MessageController.doComment') //auth

Route.get('/register', 'UserController.register')
Route.post('/register', 'UserController.doRegister')

Route.get('/editProfile', 'UserController.edit') //auth
Route.post('/editProfile', 'UserController.doEdit')//auth

Route.post('/login', 'UserController.doLogin')
Route.get('/logout', 'UserController.doLogout')

Route.group('ajax', function () {
    Route.post('/register', 'UserController.ajaxReg')
    Route.post('/message/:id/comment', 'MessageController.ajaxComment')
    //Route.get('/logout', 'UserController.ajaxLogout')
}).prefix('/ajax')