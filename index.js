const express = require('express')
const app = express()
const connection = require('./databases/database')
const User = require('./databases/Users')
const Post = require('./databases/Posts')
const Categoria = require('./databases/Categoria')
const session = require('express-session')
const bcrypt = require('bcryptjs')

function authUser (req, res, next) {
    if(req.session.auth != undefined) {
        next()
    } else {
        res.redirect('/login')
    }
    
}


// VIEW ENGINE
app.set('view engine', 'ejs')

//SESSION   
app.use(session({
    secret: "mecontrata",
    cookie: {
        maxAge: 600000
    }
}))

// URL ENCODED
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

// DATABASE 
connection.authenticate()
        .then(()=> {
            console.log('conexao feita com sucesso')
        }).catch((msgErro)=> {
            console.log('error')
    })

// ROTA HOME ('/')
app.get('/', authUser, (req, res) => {
        res.render('index')
})

// LOGIN E AUTENTICACAO

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/auth', (req, res) => {
    email = req.body.login
    senha = req.body.senha


    User.findOne({ where: {email: email}}).then(user =>{
        if(user != undefined){
            var correct = bcrypt.compareSync(senha, user.senha)
            if (correct) {
                req.session.auth = 1
                res.redirect('/')
            } else {
                res.redirect('/login')
            }

        } else {
            res.redirect('/login')
        }
    })
})

app.get('/logout', (req, res) => {
    req.session.auth = undefined
    res.redirect('/login')
})

// GERENCIAR / MANIPULAR POSTS
app.get('/novopost', authUser,(req, res)=> {
    res.render('novoPost')
})

app.post('/novoPost', (req, res) => {

    var titulo = req.body.titulo    
    var post_sinopse = req.body.postsinopse
    var post_txt = req.body.posttxt

    Post.create({
        titulo: titulo,
        sinopse : post_sinopse,
        texto: post_txt
    }).then(() => {
        res.redirect('/novopost')
    })

    
})

app.get('/controlepost', authUser, (req, res) => {
    const achou = Post.findAll({ raw : true}).then(achou =>{
        console.log(achou)
        res.render('controlePost', {
            posts: achou
        })
    })
    
    
})

app.get('/editpost/:id', authUser, (req, res) => {
    id = req.params.id
    const post = Post.findOne({where: {postid: id}}).then(post =>{
    res.render('editPost', { 
            post: post
        })
    })
})

app.post('/attpost', authUser, (req, res) => {
    Post.update({
        titulo: req.body.titulo,
        sinopse: req.body.postsinopse,
        texto: req.body.posttxt
    },{
        where: {
            postid: req.body.id
        }
    }).then(() => {res.redirect('/controlepost')})
})

// GERENCIAR / MANIPULAR CATEGORIAS
app.get('/novacategoria', authUser, (req, res)=> {
    res.render('novaCategoria')
})

app.post('/novacategoria', (req, res) => {
    titulocategoria = req.body.titulocategoria
    idcategoria = req.body.idcategoria

    Categoria.create({
        titulocategoria: titulocategoria,
        idcategoria: idcategoria
    }).then(() => {
        res.redirect('/novacategoria')
    })


})

app.get('/controlecategoria', authUser, (req, res) => {
        Categoria.findAll({raw: true}).then(categorias =>{
            res.render('controleCategoria', {
                categorias: categorias
            })
        })
    
})

app.get('/dropcategoria/:id', authUser, (req, res) => {
    Categoria.destroy({
        where: {
            idcategoria : req.params.id
        }
    }).then(() => {
        res.redirect('/controlecategoria')
    })
})

// GERENCIAR / MANIPULAR USUARIOS
app.get('/novousuario', authUser, (req, res)=> {
    res.render('novoUsuario')
})

app.post('/novousuario', (req, res) => {
    email = req.body.email
    senha = req.body.senha
    senha2 = req.body.senha2
    nome = req.body.nome

    salt = bcrypt.genSaltSync(10)
    hash = bcrypt.hashSync(senha, salt)


    User.create({
        email: email,
        nome: nome,
        senha: hash,
        
    }).then(()=>{
        if(req.body.out == undefined){
        res.redirect('/novousuario')
        } else {
            res.redirect('/login')
        }
    })
})

app.get('/controleusuario', authUser, (req, res) => {
    User.findAll().then(users => {
        res.render('controleUsuario',{
            users: users
        })
    })
    
})

app.get('/dropuser/:id', (req, res) => {
    User.destroy({
        where: {
            id : req.params.id
        }
    }).then(() => {
        res.redirect('/controleusuario')
    })
})

app.get('/cadastro', (req, res) => {
    res.render('cadastro')
})





// RODANDO O SERVIDOR NA PORTA SELECIONADA
app.listen(8080, () => {
    console.log('app rodando na porta 8080')
})