function limparTabela(idTabela) {
    $(idTabela).find('table').remove()
}

function renderizarTabela(idTabela, tabela) {
    $(idTabela).append(
        '<table class="table table-striped overflow-auto table-hover">'+
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

    let colunasLinha = ''
    let valorCedula = 0.0
    for (i=0; i<tabela.linhas.length; i++) {
        colunasLinha = '<th scope="row">'+tabela.linhas[i][0]+'</th>'

        for (j=1; j<tabela.linhas[i].length; j++) {
            valorCedula = tabela.linhas[i][j]
            if (valorCedula == '--') {
                colunasLinha += '<td>--</td>'
            } else {
                colunasLinha += '<td>'+ BRL.format(tabela.linhas[i][j])+'</td>'
            }
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
        if (error.message == 'Cannot convert "--" to a number') {
            $("#matriz-solucao").append('<div class="card-body">Matriz contém cedulas vazias</div>')            
        } else {
            $("#matriz-solucao").append('<div class="card-body"> A Matriz não é quadrada </div>')
        }
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