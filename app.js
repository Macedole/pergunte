const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const connection = require("./BD/BD");
const Pergunta =require("./BD/Pergunta");
const Resposta =require("./BD/Resposta");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.listen(5050, () => {
    console.log("Está no ar bb :)");
});
connection.authenticate().then(()=>{
    console.log("Conectado!");
}).catch((msgErro)=>{
    console.log(msgErro);
});
// rotas:
app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order:[
        ['id','DESC'] //ASC = Crescente || DESC = Decrescente
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        });
    }); //find ALL() -> select * all from perguntas; {raw: true} -> realizando uma pesquisa crua
});

app.get("/perguntar", (req, res) =>{
    res.render("perguntar");
});

app.post('/salvarDuvida', (req, res)=>{
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    if(titulo != "" || descricao != ""){
        Pergunta.create({
            titulo:    titulo,
            descricao: descricao
        }).then(()=>{
            res.redirect("/");
        });
        //res.send(titulo + descricao);
    }else{
        res.render("alerta");
    }
});

app.get("/responder/:id",(req ,res) => {
   let id = req.params.id;
   Pergunta.findOne({
      where: {id: id}
   }).then(pergunta => {
      if(pergunta != undefined){ // Pergunta encontrada
         Resposta.findAll({
            where: {perguntaId: pergunta.id},
            order: [ 
               ['id', 'DESC'] 
            ]
        }).then(respostas => {
            res.render("responder",{
               pergunta: pergunta,
               respostas: respostas
            });
        });
      }else{ // Não encontrada
        res.redirect("/");
      }
   });
});

app.post("/responder", (req,res) =>{
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta;

    if(corpo != ""){
        Resposta.create({
            corpo:   corpo,
            perguntaId: perguntaId
        }).then(()=>{
            res.redirect("/responder/"+perguntaId);
        });
    }else{
        res.render("alerta");
    }
});

