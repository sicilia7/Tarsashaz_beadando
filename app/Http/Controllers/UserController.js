'use strict'

const Validator = use('Validator')
const User = use('App/Model/User')
const Hash = use('Hash')

class UserController {

    * register (req, res) {
        const isLoggedIn = yield req.auth.check()

        if(isLoggedIn){
            res.redirect('/')
            return
        }
        yield res.sendView('register')
    }

    * doRegister (req, res) {
        const userData = req.all()

        const rules = {
            'email': 'required|email',
            'name': 'required',
            'password': 'required|min:6',
            'password_again': 'required|same:password'
        }

        const validation = yield Validator.validateAll(userData, rules)

        if (validation.fails()) {
            yield req.withOut('password', 'password_again').andWith({ errors: validation.messages() }).flash()

            res.redirect('/register')
            return
        }

        const user = new User
        user.name = userData.name
        user.email = userData.email
        user.password = yield Hash.make(userData.password)

        yield user.save()
        yield req.auth.login(user)

        res.redirect('./')
    }

    * edit(req, res){
        const isLoggedIn = yield req.auth.check()

        if(!isLoggedIn){
            res.redirect('../')
            return
        }

        const id = req.currentUser.id;
        const user = yield User.find(id);

        yield res.sendView('profile', {
            user: user.toJSON()
        })
    }

    * doEdit(req, res){
        const userData = req.all()

        const rules = {
            'email': 'required|email',
            'name': 'required',
        }
        const validation = yield Validator.validateAll(userData, rules)

        if (validation.fails()) {
            yield req.withOut('password', 'password_again').andWith({ errors: validation.messages() }).flash()

            res.redirect('./editProfile')
            return
        }

        const user = yield User.find(req.currentUser.id)
        user.name = userData.name
        user.email = userData.email
        if(userData.password !== ""){
            const passwordRules = {
                'password': 'required|min:6',
                'password_again': 'same:password'
            }
            const passwordValidation = yield Validator.validateAll(userData, passwordRules)
            if(passwordValidation.fails()){
                yield req.withOut('password', 'password_again').andWith({ errors: passwordValidation.messages() }).flash()
                res.redirect('./editProfile')
                return
            }
            user.password = yield Hash.make(userData.password)
        }
        yield user.save()
        res.redirect('./editProfile')

    }

     * doLogin (req, res) {
        const email = req.input('email')
        const password = req.input('password')

        try {
            yield req.auth.attempt(email, password)
        } catch (ex) {
            yield req.with({ error: 'Hibás belépési adatok.' }).flash()
        }
        res.redirect('/')
    }

    * doLogout (req, res) {
        yield req.auth.logout()
        res.redirect('/')
    }
}

module.exports = UserController
