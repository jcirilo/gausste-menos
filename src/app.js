const BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})

const tabelaEntrada = new Tabela(
    ['fornecedor', 'orçamento'],
    []
)
const tabelaSolucao = new Tabela(
    ['fornecedor', 'quantidade'],
    []
)

function limparTabela(idTabela) {
    $(idTabela).find('table').remove()
}

function renderizarTabela(idTabela, tabela) {
    $(idTabela).append(
        '<table class="table table-striped">'+
            '<thead><tr></tr></thead>'+
            '<tbody></tbody>'+
        '</table>')

    for (i=0; i<tabela.cabecalho.length; i++) {
        $(idTabela)
        .find("table")
        .find("thead")
        .find("tr")
        .append('<th scope="col">' + tabela.cabecalho[i] + '</th>')
    }

    for (i=0; i<tabela.linhas.length; i++) {
        let colunasLinha = '<th scope="row">'+tabela.linhas[i][0]+'</th>'

        for (j=1; j<tabela.linhas[i].length; j++) {
            colunasLinha += '<td>'+ BRL.format(tabela.linhas[i][j])+'</td>'
        }

        $(idTabela)
        .find("table")
        .find("tbody")
        .append('<tr>'+colunasLinha+'</tr>')
    }
}

function renderizarTabelaSolucao(idTabela, tabela) {
    $(idTabela).append(
        '<table class="table table-striped">'+
            '<thead><tr></tr></thead>'+
            '<tbody></tbody>'+
        '</table>')

    for (i=0; i<tabela.cabecalho.length; i++) {
        $(idTabela)
        .find("table")
        .find("thead")
        .find("tr")
        .append('<th scope="col">' + tabela.cabecalho[i] + '</th>')
    }

    for (i=0; i<tabela.linhas.length; i++) {
        let coluna = '<th scope="row">'+tabela.linhas[i][0]+'</th>'+
                     '<td>'+tabela.linhas[i][1]+'</td>'

        $(idTabela)
        .find("table")
        .find("tbody")
        .append('<tr>'+coluna+'</tr>')
    }
        
}

function atualizarRenderSolucao() {
    $("#matriz-solucao").children().remove()
    try {
        let determinante = math.det(tabelaEntrada.getA())
        if (determinante == 0) {
            $("#matriz-solucao").append('<div class="card-body">Sistema possui nenhuma ou infinitas soluções (determinante = 0)</div>')
        } else if (tabelaEntrada.linhas.length == 0) {
            $("#matriz-solucao").append('<div class="card-body">Matriz vazia</div>')
        } else if (tabelaEntrada.linhas.find(e => e.find(el => el == NaN)) == NaN) {
            $("#matriz-solucao").append('<div class="card-body">Matriz contém cedulas vazias</div>')
        } else {
            try {
                let tabelaPivoteada = tabelaEntrada.getPivot()
                let x = gaussSeidel(tabelaPivoteada.getA(), tabelaPivoteada.getB())
                let tabela = new Tabela(
                    ["fornecedor", "quantidade"],
                    []
                )
                tabelaPivoteada.linhas.forEach((e, i) => tabela.linhas.push([e[0], x[i]]))
                renderizarTabelaSolucao("#matriz-solucao", tabela)
            } catch (e) {
                $("#matriz-solucao").append('<div class="card-body">'+e.message+'</div>')
            }
    
        }
    } catch (error) {
        $("#matriz-solucao").append('<div class="card-body"> A Matriz não é quadrada </div>')
    }
}

function liveSearch() {
    $("#resultado-busca").html('')
    let termoBusca = $("#buscar-produto").val()
    let fornecedor = $("#fornecedor").val()
    let expressao = new RegExp(termoBusca, "i")
    if (termoBusca != '') {
        $.getJSON("./data.json", data => {
            $.each(data, (key, value) => {
                if (fornecedor == 'none') {
                    if(value.tituloProduto.search(expressao) != -1) {
                        $("#resultado-busca").append(novoElementoBusca(value))
                    }
                } else {
                    if(value.tituloProduto.search(expressao) != -1 && fornecedor == value.nomeFornecedor) {
                        $("#resultado-busca").append(novoElementoBusca(value))
                    }
                }
            })
        })
    } else {
        $("#buscar-produto").empty()
    }    
}

function novoElementoBusca(data) {
    elemento = '<li class="list-group-item resultado-busca" fornecedor="'+data.nomeFornecedor+'" produto="'+data.tituloProduto+'" preco="'+data.valorProduto+'" coluna="'+ data.nomeColuna +'">' +
                    '<a class="link-underline-opacity-0 link-underline-opacity-0-hover" action="none">'+
                        '<span class="text-body-secondary">' + 
                            data.nomeFornecedor + 
                            '<span class="mx-2 badge text-bg-primary">' + 
                                data.nomeColuna + 
                            "</span>" +
                        '</span>' +
                        '<div title="'+ data.tituloProduto+'" class="card-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' +
                            data.tituloProduto + 
                            '<div class="text-success-emphasis fw-bolder">' +
                                BRL.format(data.valorProduto) +
                            '</div>' +
                        '</div>' +
                    '</a>' +
                '</li>'
    return elemento
}

$("#orcamento").on('keyup', e => {
    let linhaFornecedor = tabelaEntrada.linhas.findIndex(e => e[0] == $("#fornecedor").val())
    if (linhaFornecedor > -1) {
        tabelaEntrada.linhas[linhaFornecedor].pop()
        tabelaEntrada.linhas[linhaFornecedor].push($("#orcamento").maskMoney('unmasked')[0])
    }
    limparTabela("#matriz-gerada")
    limparTabela("#matriz-pivoteada")
    renderizarTabela("#matriz-gerada", tabelaEntrada)
    renderizarTabela("#matriz-pivoteada", tabelaEntrada.getPivot())
    atualizarRenderSolucao()
})

$("#resultado-busca").on('click', 'li', e => {
    let item = new Item(
        e.currentTarget.attributes.fornecedor.value,
        e.currentTarget.attributes.produto.value,
        e.currentTarget.attributes.preco.value,
        e.currentTarget.attributes.coluna.value
    )

    tabelaEntrada.adicionar(item, $("#orcamento").maskMoney('unmasked')[0])
    limparTabela("#matriz-gerada")
    limparTabela("#matriz-pivoteada")
    renderizarTabela("#matriz-gerada", tabelaEntrada)
    renderizarTabela("#matriz-pivoteada", tabelaEntrada.getPivot())
    atualizarRenderSolucao()
    $("#resultado-busca").children('li').remove()
    $("#buscar-produto").val("")
})

$("#orcamento").maskMoney(
    {prefix:'R$ ', 
    allowNegative: false, 
    thousands:'.', 
    decimal:',',
    allowZero:true,
});

$("#buscar-produto").on('keyup', liveSearch)

renderizarTabela("#matriz-gerada", tabelaEntrada)
renderizarTabela("#matriz-pivoteada", tabelaEntrada.getPivot())
atualizarRenderSolucao()

// $("#matriz-gerada").click(e => {
//     let fornecedores = ["Alpha","Beta","Gamma","Sigma","Theta","Delta","Epsilon","Omega","Phi","Mi"]
//     console.log(fornecedores.findIndex(fornecedor => fornecedor == e.target.textContent))
//     if (fornecedores.findIndex(fornecedor => fornecedor == e.target.textContent) > -1) {
//         $("#fornecedor").children().each((i, el) => {
//             $(el).removeAttr('selected')
//             if ($(el).val() == e.target.textContent) {
//                 $(el).attr('selected', true)
//             }
//         })
//     }
// })

// $("#matriz-pivoteada").click(e => {
//     let fornecedores = ["Alpha","Beta","Gamma","Sigma","Theta","Delta","Epsilon","Omega","Phi","Mi"]
//     console.log(fornecedores.findIndex(fornecedor => fornecedor == e.target.textContent))
//     if (fornecedores.findIndex(fornecedor => fornecedor == e.target.textContent) > -1) {
//         $("#fornecedor").children().each((i, el) => {
//             $(el).attr('selected', false)
//         })
//         $("#fornecedor").children().each((i, el) => {
//             if ($(el).val() == e.target.textContent) {
//                 $(el).attr('selected', true)
//             }
//         })
//     }
// })