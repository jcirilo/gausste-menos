const BRL = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})

const tabelaEntrada = new Tabela(
    ['fornecedor', 'orçamento'],
    []
)
const tabelaSolucao = new Tabela(
    ['fornecedor', 'quantidade'],
    []
)

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