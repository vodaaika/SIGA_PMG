///C:\nodeproject> node index.js
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const bcrypt = require('bcrypt'); // https://www.npmjs.com/package/bcrypt npm i bcrypt
var jwt = require('jsonwebtoken'); //https://github.com/auth0/node-jsonwebtoken npm install jsonwebtoken

const app = express();
const port = 3001

app.use(express.json());
app.use(cors());


//=====================================================================================================
// Conexão com o banco de dados   
const con = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "1324",
    database: "guaratingueta"
})

con.connect(function (err) {
    if (err) {
        console.log("Error na conexão");
    } else {
        console.log("Conectado");
    }
})

//=========================================================================================================
//Módulo projetos
//=========================================================================================================
app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM projetos";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Erro na listagem do projeto" });
        return res.json({ Status: "Success", Result: result })
    })
})


app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM projetos where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.put("/update/:id", (req, res) => {
    const userId = req.params.id;
    const q = "UPDATE projetos SET `secretaria` = ?,`nomeprojeto` = ?,`descricao` = ?,`prioridade` = ?,`gestor` = ?,`tipo` = ?,`valorestimado` = ?,`prazoestimado` = ?,`equipelocada` = ?,`arquivo` = ?,`codigoprojeto` = ? WHERE id = ?";

    const values = [
        req.body.secretaria,
        req.body.nomeprojeto,
        req.body.descricao,
        req.body.prioridade,
        req.body.gestor,
        req.body.tipo,
        req.body.valorestimado,
        req.body.prazoestimado,
        req.body.equipelocada,
        req.body.arquivo,
        req.body.codigoprojeto
    ];
    con.query(q, [...values, userId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
        //return res.json({Status: "Success"})
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM projetos WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete projeto no banco de dados" });
        return res.json({ Status: "Success" })
    })
})

app.post('/create', (req, res) => {
    const sql = "INSERT INTO projetos (`secretaria`,`nomeprojeto`,`descricao`,`prioridade`,`gestor`,`tipo`,`valorestimado`,`prazoestimado`,`equipelocada`,`arquivo`,`codigoprojeto`) VALUES (?)";
    const values = [
        req.body.secretaria,
        req.body.nomeprojeto,
        req.body.descricao,
        req.body.prioridade,
        req.body.gestor,
        req.body.tipo,
        req.body.valorestimado,
        req.body.prazoestimado,
        req.body.equipelocada,
        req.body.arquivo,
        req.body.codigoprojeto
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Erro no cadastro" });
        return res.json({ Status: "Success" });
    });
});
//================================================================================================



//================================================================================================
//Dashboard
//================================================================================================
app.get('/adminCount', (req, res) => {
    const sql = "Select count(id) as admin from users";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/employeeCount', (req, res) => {
    const sql = "Select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


//=========================================================================================================
//Gantt2
//=========================================================================================================

app.get('/agriculturavalor', (req, res) => {
    const sql = "Select sum(valorestimado) as agro from projetos where secretaria='Secretaria da Agricultura'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/saegvalor', (req, res) => {
    const sql = "Select sum(valorestimado) as saeg from projetos where secretaria='SAEG'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/codesgvalor', (req, res) => {
    const sql = "Select sum(valorestimado) as codesg from projetos where secretaria='CODESG'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/obrasvalor', (req, res) => {
    const sql = "Select sum(valorestimado) as obras from projetos where secretaria='Secretaria de Obras'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/governovalor', (req, res) => {
    const sql = "Select sum(valorestimado) as governo from projetos where secretaria='Secretaria de Governo'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/meioambientevalor', (req, res) => {
    const sql = "Select sum(valorestimado) as meio from projetos where secretaria='Secretaria de Meio Ambiente'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/esportevalor', (req, res) => {
    const sql = "Select sum(valorestimado) as esporte from projetos where secretaria='Secretaria de Esportes e Lazer'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/culturavalor', (req, res) => {
    const sql = "Select sum(valorestimado) as cultura from projetos where secretaria='Secretaria da Cultura'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/turismovalor', (req, res) => {
    const sql = "Select sum(valorestimado) as turismo from projetos where secretaria='Secretaria de Turismo'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


app.get('/segurancavalor', (req, res) => {
    const sql = "Select sum(valorestimado) as seguranca from projetos where secretaria='Secretaria de Seg. e Mobilidade Urbana'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/saudevalor', (req, res) => {
    const sql = "Select sum(valorestimado) as saude from projetos where secretaria='Secretaria da Saúde'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/educacaovalor', (req, res) => {
    const sql = "Select sum(valorestimado) as educacao from projetos where secretaria='Secretaria da Educação'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/planejamentovalor', (req, res) => {
    const sql = "Select sum(valorestimado) as planejamento from projetos where secretaria='Secretaria de Planejamento'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


app.get('/mulherdevalor', (req, res) => {
    const sql = "Select sum(valorestimado) as mulher from projetos where secretaria='Secretaria de Políticas para as Mulheres'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/defesacivilvalor', (req, res) => {
    const sql = "Select sum(valorestimado) as defesacivil from projetos where secretaria='Assessoria Especial de Defesa Civil'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


app.get('/administracaovalor', (req, res) => {
    const sql = "Select sum(valorestimado) as administracao from projetos where secretaria='Secretaria de Administração'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})
//======================================================================================================= 

//=========================================================================================================
//Valores dos cards
//=========================================================================================================

app.get('/totalprojeto', (req, res) => {
    const sql = "Select count(id) as id from projetos";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/altaprioridade', (req, res) => {
    const sql = "Select count(id) as alta from projetos where prioridade='alta'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/getnaoiniciado', (req, res) => {
    const sql = "Select count(id) as naoiniciado from projetocompleto where situacaoetapa1='Não iniciado'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/getatrasado', (req, res) => {
    const sql = "Select count(id) as atrasado from projetocompleto where situacaoetapa1='Atrasado'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


app.get('/getconcluido', (req, res) => {
    const sql = "Select count(id) as concluido from projetocompleto where situacaoetapa1='Concluído'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


app.get('/getemandamento', (req, res) => {
    const sql = "Select count(id) as emandamento from projetocompleto where situacaoetapa1='Em andamento'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


app.get('/valorprojeto', (req, res) => {
    const sql = "Select sum(valorestimado) as valor from projetos";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/maiorvalorprojeto', (req, res) => {
    const sql = "Select max(valorestimado) as maior from projetos";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


//======================================================================================================= 





//=========================================================================================================
//Gráfico /inicial
//=========================================================================================================

app.get('/agricultura', (req, res) => {
    const sql = "Select count(id) as agro from projetos where secretaria='Secretaria da Agricultura'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/saeg', (req, res) => {
    const sql = "Select count(id) as saeg from projetos where secretaria='SAEG'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/codesg', (req, res) => {
    const sql = "Select count(id) as codesg from projetos where secretaria='CODESG'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/obras', (req, res) => {
    const sql = "Select count(id) as obras from projetos where secretaria='Secretaria de Obras'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/governo', (req, res) => {
    const sql = "Select count(id) as governo from projetos where secretaria='Secretaria de Governo'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/meioambiente', (req, res) => {
    const sql = "Select count(id) as meio from projetos where secretaria='Secretaria de Meio Ambiente'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/esporte', (req, res) => {
    const sql = "Select count(id) as esporte from projetos where secretaria='Secretaria de Esportes e Lazer'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/cultura', (req, res) => {
    const sql = "Select count(id) as cultura from projetos where secretaria='Secretaria da Cultura'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/turismo', (req, res) => {
    const sql = "Select count(id) as turismo from projetos where secretaria='Secretaria de Turismo'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


app.get('/seguranca', (req, res) => {
    const sql = "Select count(id) as seguranca from projetos where secretaria='Secretaria de Seg. e Mobilidade Urbana'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/saude', (req, res) => {
    const sql = "Select count(id) as saude from projetos where secretaria='Secretaria da Saúde'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/educacao', (req, res) => {
    const sql = "Select count(id) as educacao from projetos where secretaria='Secretaria da Educação'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/planejamento', (req, res) => {
    const sql = "Select count(id) as planejamento from projetos where secretaria='Secretaria de Planejamento'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/mulher', (req, res) => {
    const sql = "Select count(id) as mulher from projetos where secretaria='Secretaria de Políticas para as Mulheres'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


app.get('/defesacivil', (req, res) => {
    const sql = "Select count(id) as defesacivil from projetos where secretaria='Assessoria Especial de Defesa Civil'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


app.get('/administracao', (req, res) => {
    const sql = "Select count(id) as administracao from projetos where secretaria='Secretaria de Administração'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


//======================================================================================================= 

//=========================================================================================================
//Login
app.get('/hash', (req, res) => {
    bcrypt.hash("123456", 10, (err, hash) => {
        if (err) return res.json({ Error: "Error in hashing password" });
        const values = [
            hash
        ]
        return res.json({ result: hash });
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users Where email = ?";
    con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in runnig query" });
        if (result.length > 0) {
            bcrypt.compare(req.body.password.toString(), result[0].password, (err, response) => {
                if (err) return res.json({ Error: "password error" });
                if (response) {
                    const token = jwt.sign({ role: "admin" }, "jwt-secret-key", { expiresIn: '1d' });
                    return res.json({ Status: "Success", Token: token })
                } else {
                    return res.json({ Status: "Error", Error: "Wrong Email or Password" });
                }
            })
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
    })
})

app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (`name`,`email`,`password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
        if (err) return res.json({ Error: "Error in hashing password" });
        const values = [
            req.body.name,
            req.body.email,
            hash,
        ]
        con.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Error query" });
            return res.json({ Status: "Success" });
        })
    })
});
//========================================================================================================




//========================================================================================================
//Folha pagamento
//========================================================================================================
app.get('/getfolhapagamento', (req, res) => {
    const sql = "SELECT * FROM folhapagamento";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Erro na execução" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getfolhapagamentoajustada', (req, res) => {
    const sql = "SELECT nome, mes, salariobruto, inss, irrf, alimentacao, dependentes, salarioliquido FROM folhapagamento";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Erro na execução" });
        return res.json({ Status: "Success", Result: result })
    })
})


app.get('/getfolha/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM folhapagamento where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Erro na execução" });
        return res.json({ Status: "Success", Result: result })
    });
});


app.delete('/deletefolhapagamento/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM folhapagamento WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Erro na execução" });
        return res.json({ Status: "Success" })
    });
});

app.post('/createfolhapagamento', (req, res) => {
    const sql = "INSERT INTO folhapagamento (`nome`, `mes`, `cargo`, `salariobruto`, `inss`, `irrf`,`alimentacao`, `dependentes`, `salarioliquido`) VALUES (?)";
    const values = [
        req.body.nome,
        req.body.mes,
        req.body.cargo,
        req.body.salariobruto,
        req.body.inss,
        req.body.irrf,
        req.body.alimentacao,
        req.body.dependentes,
        req.body.salarioliquido
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Erro na execução" });
        return res.json({ Status: "Success" });
    });
});

app.put("/updatefolhapagamento/:id", (req, res) => {
    const userId = req.params.id;
    const q = "UPDATE folhapagamento SET `nome`=?, `mes`=?, `cargo`=?, `salariobruto`=?, `inss`=?, `irrf`=?,`alimentacao`=?, `dependentes`=?, `salarioliquido`=? WHERE id = ?";
    const values = [
        req.body.nome,
        req.body.mes,
        req.body.cargo,
        req.body.salariobruto,
        req.body.inss,
        req.body.irrf,
        req.body.alimentacao,
        req.body.dependentes,
        req.body.salarioliquido
    ];
    con.query(q, [...values, userId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});
//========================================================================================================


//========================================================================================================
//Etapas do projeto
//========================================================================================================
app.get('/getgantt', (req, res) => {
    const sql = "SELECT  etapa, datainicio, datafim, prazoestimado FROM etapasprojeto";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})


app.get('/getDadosprofissionais', (req, res) => {
    const sql = "SELECT * FROM etapasprojeto";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getDadosprof/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM etapasprojeto where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.put("/updatedadosprofissionais/:id", (req, res) => {
    const userId = req.params.id;
    const q = "UPDATE etapasprojeto SET `projeto`= ?, `etapa`= ?, `gestor`= ?, `responsavel`= ?, `datainicio`= ?, `prazoestimado`= ?, `datafim`= ?,`prazoreal`= ?, `esforco`= ?,`situacao`= ?,`id_projeto`= ? WHERE id = ?";
    const values = [
        req.body.projeto,
        req.body.etapa,
        req.body.gestor,
        req.body.responsavel,
        req.body.datainicio,
        req.body.prazoestimado,
        req.body.datafim,
        req.body.prazoreal,
        req.body.esforco,
        req.body.situacao,
        req.body.id_projeto
    ];
    con.query(q, [...values, userId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
        //return res.json({Status: "Success"})
    });
});

app.delete('/deletedadosprofissionais/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM etapasprojeto WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" })
    })
})

app.post('/createDadosprofissionais', (req, res) => {
    const sql = "INSERT INTO etapasprojeto (`projeto`,`etapa`,`gestor`,`responsavel`,`datainicio`,`prazoestimado`,`datafim`,`prazoreal`,`esforco`,`situacao`,`id_projeto`) VALUES (?)";
    const values = [
        req.body.projeto,
        req.body.etapa,
        req.body.gestor,
        req.body.responsavel,
        req.body.datainicio,
        req.body.prazoestimado,
        req.body.datafim,
        req.body.prazoreal,
        req.body.esforco,
        req.body.situacao,
        req.body.id_projeto
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Erro no cadastro" });
        return res.json({ Status: "Success" });
    });
});
//================================================================================================

//========================================================================================================
//Secretaria
//========================================================================================================
app.get('/getSecretaria', (req, res) => {
    const sql = "SELECT * FROM secretaria";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Não foi possível listar os dados" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getSecret/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM secretaria where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.put("/updatesecretaria/:id", (req, res) => {
    const userId = req.params.id;
    const q = "UPDATE secretaria SET `nomesecretaria`= ?, `secretario`= ?, `formacao`= ?, `dataregistro`= ?, `imagem`= ? WHERE id = ?";
    const values = [
        req.body.nomesecretaria,
        req.body.secretario,
        req.body.formacao,
        req.body.dataregistro,
        req.body.imagem
    ];
    con.query(q, [...values, userId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
        //return res.json({Status: "Success"})
    });
});

app.delete('/deleteSecretaria/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM secretaria WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" })
    })
})

app.post('/createsecretaria', (req, res) => {
    const sql = "INSERT INTO secretaria (`nomesecretaria`,`secretario`,`formacao`,`dataregistro`,`imagem`) VALUES (?)";
    const values = [
        req.body.nomesecretaria,
        req.body.secretario,
        req.body.formacao,
        req.body.dataregistro,
        req.body.imagem
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Erro no cadastro" });
        return res.json({ Status: "Success" });
    });
});
//================================================================================================

//========================================================================================================
//Cronograma do projeto - projeto completo
//========================================================================================================
app.get('/getprojetocompleto', (req, res) => {
    const sql = "SELECT * FROM projetocompleto";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Não foi possível listar os dados" });
        return res.json({ Status: "Success", Result: result })
    })
})


app.get('/getprojetocompletogantt', (req, res) => {
    const sql = "SELECT nomeprojeto, prazoetapa1, prazoetapa2, prazoetapa3, prazoetapa4, prazoetapa5, prazoetapa6 FROM projetocompleto";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Não foi possível listar os dados" });
        return res.json({ Status: "Success", Result: result })
    })
})


app.get('/getprojetocompl/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM projetocompleto where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.put("/updateprojetocompleto/:id", (req, res) => {
    const userId = req.params.id;
    const q = "UPDATE projetocompleto SET `secretaria`= ?, `nomeprojeto`= ?, `gestorprojeto`= ?, `etapa1`= ?, `datainicioetapa1`= ?, `datafimetapa1`= ?, `prazoetapa1`= ?,`situacaoetapa1`= ?, `etapa2`= ?, `datainicioetapa2`= ?, `datafimetapa2`= ?,  `prazoetapa2`= ?,`situacaoetapa2`= ?, `etapa3`= ?, `datainicioetapa3`= ?, `datafimetapa3`= ?,  `prazoetapa3`= ?,`situacaoetapa3`= ?,`etapa4`= ?, `datainicioetapa4`= ?, `datafimetapa4`= ?,  `prazoetapa4`= ?,`situacaoetapa4`= ?,`etapa5`= ?, `datainicioetapa5`= ?, `datafimetapa5`= ?,  `prazoetapa5`= ?,`situacaoetapa5`= ?, `etapa6`= ?, `datainicioetapa6`= ?, `datafimetapa6`= ?,  `prazoetapa6`= ?,`situacaoetapa6`= ? WHERE id = ?";
    const values = [
        req.body.secretaria,
        req.body.nomeprojeto,
        req.body.gestorprojeto,
        req.body.etapa1,
        req.body.datainicioetapa1,
        req.body.datafimetapa1,
        req.body.prazoetapa1,
        req.body.situacaoetapa1,
        req.body.etapa2,
        req.body.datainicioetapa2,
        req.body.datafimetapa2,
        req.body.prazoetapa2,
        req.body.situacaoetapa2,
        req.body.etapa3,
        req.body.datainicioetapa3,
        req.body.datafimetapa3,
        req.body.prazoetapa3,
        req.body.situacaoetapa3,
        req.body.etapa4,
        req.body.datainicioetapa4,
        req.body.datafimetapa4,
        req.body.prazoetapa4,
        req.body.situacaoetapa4,
        req.body.etapa5,
        req.body.datainicioetapa5,
        req.body.datafimetapa5,
        req.body.prazoetapa5,
        req.body.situacaoetapa5,
        req.body.etapa6,
        req.body.datainicioetapa6,
        req.body.datafimetapa6,
        req.body.prazoetapa6,
        req.body.situacaoetapa6
    ];
    con.query(q, [...values, userId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
        //return res.json({Status: "Success"})
    });
});

app.delete('/deleteprojetocompleto/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM projetocompleto WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" })
    })
})

app.post('/createprojetocompleto', (req, res) => {
    const sql = "INSERT INTO projetocompleto (`secretaria`,`nomeprojeto`,`gestorprojeto`,`etapa1`,`datainicioetapa1`,`datafimetapa1`,`prazoetapa1`, `situacaoetapa1`,`etapa2`,`datainicioetapa2`,`datafimetapa2`, `prazoetapa2`, `situacaoetapa2`, `etapa3`,`datainicioetapa3`,`datafimetapa3`,`prazoetapa3`, `situacaoetapa3`, `etapa4`,`datainicioetapa4`,`datafimetapa4`, `prazoetapa4`, `situacaoetapa4`, `etapa5`,`datainicioetapa5`,`datafimetapa5`, `prazoetapa5`, `situacaoetapa5`, `etapa6`,`datainicioetapa6`,`datafimetapa6`,`prazoetapa6`, `situacaoetapa6`) VALUES (?)";
    const values = [
        req.body.secretaria,
        req.body.nomeprojeto,
        req.body.gestorprojeto,
        req.body.etapa1,
        req.body.datainicioetapa1,
        req.body.datafimetapa1,
        req.body.prazoetapa1,
        req.body.situacaoetapa1,
        req.body.etapa2,
        req.body.datainicioetapa2,
        req.body.datafimetapa2,
        req.body.prazoetapa2,
        req.body.situacaoetapa2,
        req.body.etapa3,
        req.body.datainicioetapa3,
        req.body.datafimetapa3,
        req.body.prazoetapa3,
        req.body.situacaoetapa3,
        req.body.etapa4,
        req.body.datainicioetapa4,
        req.body.datafimetapa4,
        req.body.prazoetapa4,
        req.body.situacaoetapa4,
        req.body.etapa5,
        req.body.datainicioetapa5,
        req.body.datafimetapa5,
        req.body.prazoetapa5,
        req.body.situacaoetapa5,
        req.body.etapa6,
        req.body.datainicioetapa6,
        req.body.datafimetapa6,
        req.body.prazoetapa6,
        req.body.situacaoetapa6
    ];
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Erro no cadastro" });
        return res.json({ Status: "Success" });
    });
});

//================================================================================================





//=========================================================================================================
//Gantt
//=========================================================================================================
app.get('/getNome/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT nomeprojeto FROM projetocompleto where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})


app.get('/prazoetapa1', (req, res) => {
    const sql = "Select prazoetapa1 as etapa1 from projetocompleto where etapa1='1 - Estruturação do projeto' and nomeprojeto = 'Trecho Bão'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/prazoetapa2', (req, res) => {
    const sql = "Select prazoetapa2 as etapa2 from projetocompleto where etapa2='2 - Elaboração do TdR/projeto e orçamento' and nomeprojeto = 'Trecho Bão'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/prazoetapa3', (req, res) => {
    const sql = "Select prazoetapa3 as etapa3 from projetocompleto where etapa3='3 - Processo licitatório' and nomeprojeto = 'Trecho Bão'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/prazoetapa4', (req, res) => {
    const sql = "Select prazoetapa4 as etapa4 from projetocompleto where etapa4='4 - Assinatura do contrato' and nomeprojeto = 'Trecho Bão'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/prazoetapa5', (req, res) => {
    const sql = "Select prazoetapa5 as etapa5 from projetocompleto where etapa5='5 - Acompanhamento contratual' and nomeprojeto = 'Trecho Bão'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})

app.get('/prazoetapa6', (req, res) => {
    const sql = "Select prazoetapa6 as etapa6 from projetocompleto where etapa6='6 - Prestação de contas e lições aprendidas' and nomeprojeto = 'Trecho Bão'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in runnig query" });
        return res.json(result);
    })
})


//============================================================================================================






//=========================================================================================================
//Diária
//=========================================================================================================
app.get('/getDiaria', (req, res) => {
    const sql = "SELECT * FROM diaria";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getselectDiaria', (req, res) => {
    const sql = "SELECT id, contratogestao, comite, nome FROM diaria";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getDia/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM diaria where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.put("/updateDiaria/:id", (req, res) => {
    const userId = req.params.id;
    const q = "UPDATE diaria SET `unidade`= ?, `contratogestao`= ?, `comite`= ?, `nome`= ?, `beneficiario`= ?,`motivodiaria`= ?, `data1`= ?, `partida1`= ?, `destino1`= ?, `data2`= ?, `partida2`= ?, `destino2`= ?, `data3`= ?, `partida3`= ?, `destino3`= ?, `valordiaria`= ?, `valoralimentacao`= ?, `valorfinaldiaria`= ? WHERE id = ?";
    const values = [
        req.body.unidade,
        req.body.contratogestao,
        req.body.comite,
        req.body.nome,
        req.body.beneficiario,
        req.body.motivodiaria,
        req.body.data1,
        req.body.partida1,
        req.body.destino1,
        req.body.data2,
        req.body.partida2,
        req.body.destino2,
        req.body.data3,
        req.body.partida3,
        req.body.destino3,
        req.body.valordiaria,
        req.body.valoralimentacao,
        req.body.valorfinaldiaria
    ];

    con.query(q, [...values, userId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
        //return res.json({Status: "Success"})
    });
});

app.delete('/deleteDiaria/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM diaria WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "deletar diaria" });
        return res.json({ Status: "Success" })
    })
})

app.post('/createDiaria', (req, res) => {
    const sql = "INSERT INTO diaria (`unidade`, `contratogestao`,`comite`,`nome`,`beneficiario`, `motivodiaria`, `data1`,`partida1`,`destino1`, `data2`,`partida2`,`destino2`, `data3`,`partida3`,`destino3`,`valordiaria`, `valoralimentacao`, `valorfinaldiaria` ) VALUES (?)";
    const values = [
        req.body.unidade,
        req.body.contratogestao,
        req.body.comite,
        req.body.nome,
        req.body.beneficiario,
        req.body.motivodiaria,
        req.body.data1,
        req.body.partida1,
        req.body.destino1,
        req.body.data2,
        req.body.partida2,
        req.body.destino2,
        req.body.data3,
        req.body.partida3,
        req.body.destino3,
        req.body.valordiaria,
        req.body.valoralimentacao,
        req.body.valorfinaldiaria
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Erro no cadastro" });
        return res.json({ Status: "Success" });
    });
});
//================================================================================================

app.post('/createtrabalho', (req, res) => {
    const sql = "INSERT INTO diaria (`unidade`, `contratogestao`,`comite`,`nome`,`beneficiario`, `motivodiaria`, `data1`,`partida1`,`destino1`, `data2`,`partida2`,`destino2`, `data3`,`partida3`,`destino3`, `valordiaria`,`valoralimentacao`,`valorfinaldiaria`) VALUES (?)";
    const values = [
        req.body.unidade,
        req.body.contratogestao,
        req.body.comite,
        req.body.nome,
        req.body.beneficiario,
        req.body.motivodiaria,
        req.body.data1,
        req.body.partida1,
        req.body.destino1,
        req.body.data2,
        req.body.partida2,
        req.body.destino2,
        req.body.data3,
        req.body.partida3,
        req.body.destino3,
        req.body.valordiaria,
        req.body.valoralimentacao,
        req.body.valorfinaldiaria
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Erro no cadastro" });
        return res.json({ Status: "Success" });
    });
});

//=========================================================================================================


//=========================================================================================================
//tabelas primárias
//=========================================================================================================

app.get('/getprojteste', (req, res) => {
    const sql = "SELECT projeto, etapa, prazoestimado FROM etapasprojeto";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getdatainicioetapa1', (req, res) => {
    const sql = "SELECT datainicioetapa1 as datainicioetapa1 FROM projetocompleto";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getdatafimetapa6', (req, res) => {
    const sql = "SELECT datafimetapa6 as datafimetapa6 FROM projetocompleto";;
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})


app.get('/getnomeprojeto', (req, res) => {
    const sql = "SELECT nomeprojeto as nomeprojeto FROM projetos";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Não foi possível listar os dados" });
        return res.json({ Status: "Success", Result: result })
    })
})


app.get('/getnomesecretaria', (req, res) => {
    const sql = "SELECT  nomesecretaria as nomesecretaria FROM secretaria";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Não foi possível listar os dados" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getSelectprazoestimado', (req, res) => {
    const sql = "SELECT id, nomeprojeto, prazoetapa1, prazoetapa2, prazoetapa3, prazoetapa4, prazoetapa5, prazoetapa6 FROM projetocompleto";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})


//=========================================================================================================
//Cards FICHA DO PROJETO
//=========================================================================================================

app.get('/naoiniciado', (req, res) => {
    const sql = "SELECT count(id) as naoiniciado FROM projetocompleto where situacaoetapa1 ='Não iniciado'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/concluido', (req, res) => {
    const sql = "SELECT count(id) as concluido FROM projetocompleto where situacaoetapa1 ='Concluído'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/atrasado', (req, res) => {
    const sql = "SELECT count(id) as atrasado FROM projetocompleto where situacaoetapa1 ='Atrasado'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/emandamento', (req, res) => {
    const sql = "SELECT count(id) as emandamento FROM projetocompleto where situacaoetapa1 ='Em andamento'";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

//=========================================================================================================





app.get('/getSelectEtapa', (req, res) => {
    const sql = "SELECT etapa FROM etapasprojeto";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getSelectprojetoetapa', (req, res) => {
    const sql = "SELECT projeto.id, projeto.secretaria, projeto.nomeprojeto, projeto.gestor, etapasprojeto.etapa, etapasprojeto.datainicio, etapasprojeto.datafim, etapasprojeto.prazoestimado, etapasprojeto.situacao FROM projeto JOIN etapasprojeto ON projeto.id = etapasprojeto.id_projeto"
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Erro no JOIN" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getSelectprojetoetapa/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT projeto.id, projeto.secretaria, projeto.nomeprojeto, projeto.gestor, etapasprojeto.etapa, etapasprojeto.datainicio, etapasprojeto.datafim, etapasprojeto.prazoestimado, etapasprojeto.situacao FROM projeto JOIN etapasprojeto ON projeto.id = etapasprojeto.id_projeto where id=?"
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})




app.get('/getprojetocompl/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM projetocompleto where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.get('/getetapasprojetogantt/:id_projeto', (req, res) => {
    const id_projeto = req.params.id_projeto;
    const sql = "SELECT projeto, etapa, prazoestimado FROM etapasprojeto WHERE id_projeto=?";
    con.query(sql, [id_projeto], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

//=========================================================================================================



app.listen(port, () => {
    console.log(`Aplicativo rodando na porta ${port}`)
})