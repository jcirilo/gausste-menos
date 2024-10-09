const BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})

const matrizEntrada = {
    cabecalho: ['fornecedor','orçamento'],
    linhas: []
}

function pivotear(matriz) {
    let matrizCopia = {
        cabecalho: matriz.cabecalho,
        linhas: matriz.linhas.map(e => e)
    }
    return matrizCopia
}

function adicionarAMatriz(matriz, dados) {
    let linhaFornecedor = matriz.linhas.findIndex(l => l[0] == dados.fornecedor)

    if (linhaFornecedor < 0) {
        matriz.cabecalho.forEach(e=> {
            if (e == 'fornecedor') {
                matriz.linhas.push([dados.fornecedor])
            } else {
                if (e == 'orçamento') {
                    matriz.linhas[matriz.linhas.length-1].push($("#orcamento").maskMoney('unmasked')[0])
                } else {
                    matriz.linhas[matriz.linhas.length-1].push(NaN)
                }
            }
        })
        linhaFornecedor = matriz.linhas.length-1
    }

    let colunaProduto = matriz.cabecalho.findIndex(e => e == dados.coluna)

    if (colunaProduto < 0) {
        let aux = matriz.cabecalho.pop()
        matriz.cabecalho.push(dados.coluna)
        matriz.cabecalho.push(aux)
        matriz.linhas.forEach(linha => {
            let aux = linha.pop()
            linha.push(NaN)
            linha.push(aux)
        })
        colunaProduto = matriz.cabecalho.length-2
    }

    matriz.linhas[linhaFornecedor][colunaProduto] = dados.preco
}

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

renderizarTabela("#matriz-gerada", matrizEntrada)
renderizarTabela("#matriz-pivoteada", pivotear(matrizEntrada))
renderizarTabela("#matriz-solucao", {cabecalho: ['fornecedor', 'quantidade'],linhas: []})

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
    let linhaFornecedor = matrizEntrada.linhas.findIndex(e => e[0] == $("#fornecedor").val())
    if (linhaFornecedor > -1) {
        matrizEntrada.linhas[linhaFornecedor].pop()
        matrizEntrada.linhas[linhaFornecedor].push($("#orcamento").maskMoney('unmasked')[0])
    }
    limparTabela("#matriz-gerada")
    limparTabela("#matriz-pivoteada")
    renderizarTabela("#matriz-gerada", matrizEntrada)
    renderizarTabela("#matriz-pivoteada", matrizEntrada)
})

$("#resultado-busca").on('click', 'li', e => {
    dados = {
        'fornecedor': e.currentTarget.attributes.fornecedor.value, 
        'produto': e.currentTarget.attributes.produto.value, 
        'preco': e.currentTarget.attributes.preco.value,
        'coluna': e.currentTarget.attributes.coluna.value
    }
    adicionarAMatriz(matrizEntrada, dados)
    limparTabela("#matriz-gerada")
    limparTabela("#matriz-pivoteada")
    renderizarTabela("#matriz-gerada", matrizEntrada)
    renderizarTabela("#matriz-pivoteada", pivotear(matrizEntrada))
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