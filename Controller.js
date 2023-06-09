const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itemPedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

app.get('/', (req, res) => {
    res.send('Olá, mundo!')
});

app.post('/servicos', async (req, res) => {
    await servico.create(req.body)
    .then(() => {
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/clientes', async (req, res) => {
    await cliente.create(req.body)
    .then(() => {
        return res.json({
            error: false,
            message: "Cliente criado com sucesso!"
        })
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/pedidos', async (req, res) => {
    await pedido.create(req.body)
    .then(() => {
        return res.json({
            error: false,
            message: "Pedido criado com sucesso!"
        })
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/itenspedido', async (req, res) => {
    await itemPedido.create(req.body)
    .then(() => {
        return res.json({
            error: false,
            message: "Item criado com sucesso!"
        })
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.get('/listaservicos', async (req, res) => {
    await servico.findAll({
        // row: true
        order: [['nome', 'ASC']]
    })
    .then(servicos => {
        res.json(servicos)
    });
});

app.get('/listaclientes', async (req, res) => {
    await cliente.findAll({
        order: [['nascimento', 'ASC']]
    })
    .then(clientes => {
        res.json({clientes});
    });
});

app.get('/listapedidos', async (req, res) => {
    await pedido.findAll()
    .then(pedidos => {
        res.json({pedidos});
    });
});

app.get('/listaitempedidos', async (req, res) => {
    await itemPedido.findAll({
        order: [
            ['valor', 'DESC']
        ]
    })
    .then(itempedidos => {
        res.json({itempedidos});
    }); 
});

app.get('/ofertaservicos', async (req, res) => {
    await servico.count('id')
    .then(servicos => {
        res.json({servicos});
    });
});

app.get('/ofertaclientes', async (req, res) => {
    await cliente.count('id')
    .then(clientes => {
        res.json({clientes});
    });
});

app.get('/ofertapedidos', async (req, res) => {
    await pedido.count('id')
    .then(pedidos => {
        res.json({pedidos})
    });
});

app.get('/servico/:id', async (req, res) => {
    await servico.findByPk(req.params.id)
    .then(serv => {
        return res.json({
            error: false,
            serv
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível conectar!"
        });
    });
});

app.get('/servico/:id/pedidos', async (req, res) => {
    await itemPedido.findAll({
        where: {ServicoId: req.params.id}
    })
    .then(item => {
        return res.json({
            error: false,
            item
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível conectar!"
        });
    });
});

app.get('/pedidos/:id', async (req, res) => {
    await pedido.findByPk(req.params.id, {
        include: [
            { all: true }
        ]
    })
    .then(ped => {
        return res.json(
            {ped}
        );
    });
});

app.put('/atualizaservico/:id', async (req, res) => {
    await servico.update(req.body, {
        where: {id: req.params.id}
    })
    .then(() => {
        return res.json({
            error: false,
            message: "Serviço atualizado com sucesso!"
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Erro: O serviço não pôde ser alterado."
        });
    });
});

app.put('/atualizacliente/:id', async (req, res) => {
    await cliente.update(req.body, {
        where: {id: req.params.id}
    })
    .then(() => {
        return res.json({
            error: false,
            message: "Cliente atualizado com sucesso!"
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Erro: O cliente não pôde ser alterado."
        });
    });
});

app.put('/atualizapedido/:id', async (req, res) => {
    await pedido.update(req.body, {
        where: {id: req.params.id}
    })
    .then(() => {
        return res.json({
            error: false,
            message: "Pedido atualizado com sucesso!"
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Erro: O serviço não pôde ser alterado."
        });
    });
});

app.put('/pedidos/:id/editaritem', async (req, res) => {
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado.'
        });
    };

    if (!await servico.findByPk(req.body.ServicoId)) {
        return res.status(400).json({
            error: true,
            message: 'Serviço não foi encontrado.'
        });
    };

    await itemPedido.update(item, {
        where: Sequelize.and(
            {ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id}
        )
    })
    .then(items => {
        return res.json({
            error: false,
            message: 'Item alterado com sucesso!',
            items
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: 'ERRO: não foi possível alterar.'
        });
    });
});

app.delete('/excluirservico/:id', async (req, res) => {
    await servico.destroy({
        where: {id: req.params.id}
    })
    .then(() => {
        return res.json({
            error: false,
            message: "Serviço excluído com sucesso!"
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir serviço."
        });
    });
});

app.delete('/excluircliente/:id', async (req, res) => {
    await cliente.destroy({
        where: {id: req.params.id}
    })
    .then(() => {
        return res.json({
            error: false,
            message: "Cliente excluído com sucesso!"
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir cliente."
        });
    });
});

app.delete('/excluirpedido/:id', async (req, res) => {
    await pedido.destroy({
        where: {id: req.params.id}
    })
    .then(() => {
        return res.json({
            error: false,
            message: "Pedido excluído com sucesso!"
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Erro ao excluir pedido."
        });
    });
});

app.delete('/servped/:id/excluiritem', async (req, res) => {
    if (! await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Pedido não foi encontrado."
        });
    };
    
    if (! await servico.findByPk(req.body.ServicoId)) {
        return res.status(400).json({
            error: true,
            message: "Serviço não foi encontrado."
        });
    };

    if (! await itemPedido.destroy({
        where: Sequelize.and(
            { PedidoId: req.params.id },
            { ServicoId: req.body.ServicoId }
        )
    })) {
        return res.status(400).json({
            error: true,
            message: "Item não foi encontrado."
        });
    }

    await itemPedido.destroy({
        where: Sequelize.and(
            { PedidoId: req.params.id },
            { ServicoId: req.body.ServicoId }
        )
    })
    .then(() => {
        return res.json({
            error: false,
            message: "Item excluído com êxito."
        });
    })
    .catch(erro => {
        return res.status(400).json({
            error: true,
            message: "Não foi possível excluir.",
            erro
        });
    });
});

let port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
    console.log('Servidor ativo: http://localhost:3001');
});