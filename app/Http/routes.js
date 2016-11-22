'use strict'

const Route = use('Route')

Route.on('/').render('welcome')
Route.get('/messages', 'MessageController.main')//szűréshez route?
Route.get('/message/create', 'MessageController.create') //auth
Route.post('/message/create', 'MessageController.doCreate').middleware('auth') 
Route.get('/statement/create', 'MessageController.createStatement') //auth
Route.post('/statement/create', 'MessageController.doCreateStatement').middleware('auth')

Route.get('/message/:id', 'MessageController.show') //id //auth
Route.get('/statement/:id', 'MessageController.showStatement')
Route.get('/message/edit', 'MessageController.edit') //id //auth
Route.post('/message/:id/edit', 'MessageController.doEdit') //auth
Route.post('/message/:id/comment', 'MessageController.doComment') //auth
//statement comment?
Route.get('/register', 'UserController.register')
Route.post('/register', 'UserController.doRegister')

Route.get('/editProfile', 'UserController.edit') //id //auth
Route.post('/editProfile', 'UserController.doEdit')//id //auth

Route.post('/login', 'UserController.doLogin')
Route.get('/logout', 'UserController.doLogout')