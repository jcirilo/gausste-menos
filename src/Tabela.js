class Tabela {

    constructor(cabecalho, linhas) {
        this.cabecalho = cabecalho
        this.linhas = linhas
    }

    adicionar(item, orcamento = NaN) {
        let linhaFornecedor = this.linhas.findIndex(l => l[0] == item.fornecedor)

        if (linhaFornecedor < 0) {
            this.cabecalho.forEach(e => {
                if (e == 'fornecedor') {
                    this.linhas.push([item.fornecedor])
                } else {
                    if (e == 'orçamento') {
                        this.linhas[this.linhas.length - 1].push(orcamento)
                    } else {
                        this.linhas[this.linhas.length - 1].push(NaN)
                    }
                }
            })
            linhaFornecedor = this.linhas.length - 1
        }

        let colunaProduto = this.cabecalho.findIndex(e => e == item.coluna)

        if (colunaProduto < 0) {
            let aux = this.cabecalho.pop()
            this.cabecalho.push(item.coluna)
            this.cabecalho.push(aux)
            this.linhas.forEach(linha => {
                let aux = linha.pop()
                linha.push(NaN)
                linha.push(aux)
            })
            colunaProduto = this.cabecalho.length - 2
        }

        this.linhas[linhaFornecedor][colunaProduto] = item.preco
    }

    getA() {
        return this.linhas.map(linha => linha.slice(1, -1))
    }

    getB() {
        return this.linhas.map(linha => linha.at(-1))
    }

    getPivot() {
        let tabela = new Tabela(this.cabecalho.map(e => e), this.linhas.map(e => e))
        let linPivot = 0
        let maiorLinha = linPivot
        let aux = null

        for (let colPivot = 1; colPivot < tabela.linhas.length; colPivot++) {
            for (let linComp = linPivot + 1; linComp < tabela.linhas.length; linComp++) {
                if (tabela.linhas[linComp][colPivot] > tabela.linhas[linPivot][colPivot]) {
                    maiorLinha = linComp
                }
            }
            aux = tabela.linhas[linPivot]
            tabela.linhas[linPivot] = tabela.linhas[maiorLinha]
            tabela.linhas[maiorLinha] = aux
            linPivot = colPivot
            maiorLinha = linPivot
        }

        return tabela
    }
}