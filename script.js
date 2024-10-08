let dadosBusca = []

function novoElementoBusca(data) {
    BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
    elemento = '<li class="list-group-item resultado-busca" fornecedor="'+data.nomeFornecedor+'" produto="'+data.tituloProduto+'" preco="'+data.valorProduto+'">' +
                    '<a class="link-underline-opacity-0 link-underline-opacity-0-hover" href="#">'+
                        '<span class="text-body-secondary">' + 
                            data.nomeFornecedor + 
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

$("#resultado-busca").on('click', 'li', e => {
    dados = {
        'fornecedor': e.currentTarget.attributes.fornecedor.value, 
        'produto': e.currentTarget.attributes.produto.value, 
        'preco': e.currentTarget.attributes.preco.value
    }
    dadosBusca = dados
    $("#resultado-busca").children('li').remove()
    console.log(dadosBusca)
})

$("#orcamento").maskMoney(
    {prefix:'R$ ', 
    allowNegative: false, 
    thousands:'.', 
    decimal:',',
    allowZero:true
});

$("#buscar-produto").on('keyup', () => {
    $("#resultado-busca").html('')
    let termoBusca = $("#buscar-produto").val()
    let fornecedor = $("#fornecedor").val()
    let expressao = new RegExp(termoBusca, "i")
    if (termoBusca != '') {
        $.getJSON("./data.json", data => {
            $.each(data, (key, value) => {
                if(value.tituloProduto.search(expressao) != -1 && value.nomeFornecedor == fornecedor) {
                    $("#resultado-busca").append(novoElementoBusca(value))
                }
            })
        })
    } else {
        $("#buscar-produto").empty()
    }
})

let carrinhos = [{}]

const matrizGerada = new Tabulator("#matriz-gerada", {
    data: null,
    layout:"fitColumns",
    columns: [
        {title: 'Fornecedor', field: 'name', headerSort:false},
        {title: 'Orçamento', field: 'number', editor:'input', headerSort:false}
    ]
})

const matrizPivoteada = new Tabulator("#matriz-pivoteada", {
    data: null,
    layout:"fitColumns",
    columns: [
        {title: 'Fornecedor', field: 'name', headerSort:false},
        {title: 'Orçamento', field: 'number', editor:'input', headerSort:false}
    ]
})

const matrizSolucao = new Tabulator("#matriz-solucao", {
    data: null,
    layout:"fitColumns",
    columns: [
        {title: 'Carrinho Fornecedor', field: 'name', headerSort:false},
        {title: 'Custo Benefício', field: 'number', editor:'input', headerSort:false}
    ]
})