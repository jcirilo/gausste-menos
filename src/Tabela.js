class Tabela {

    constructor(cabecalho, linhas) {
        this.cabecalho = cabecalho
        this.linhas = linhas
    }

    adicionar(item, orcamento=0) {
        let linhaFornecedor = this.linhas.findIndex(l => l[0] == item.fornecedor)

        if (linhaFornecedor < 0) {
            this.cabecalho.forEach(e => {
                if (e == 'fornecedor') {
                    this.linhas.push([item.fornecedor])
                } else {
                    if (e == 'orçamento') {
                        this.linhas[this.linhas.length - 1].push(orcamento)
                    } else {
                        this.linhas[this.linhas.length - 1].push('--')
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
                linha.push('--')
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
        let cabecalho= []
        let linhas = []

        for (let i=0; i<this.cabecalho.length; i++) {
            cabecalho.push(this.cabecalho[i])
        }

        for (let i=0; i<this.linhas.length; i++) {
            linhas.push([])
            for (let j=0; j<this.linhas[i].length; j++) {
                linhas[i].push(this.linhas[i][j])
            }
        }

        let linha = 0
        let pivo = linha+1
        let aux = null
        for (;linha<linhas.length; linha++) {
            pivo = linha+1
            for (let linhaComp=linha+1; linhaComp<linhas.length; linhaComp++) {
                if (linhas[linhaComp][pivo] > linhas[linha][pivo]) {
                    aux = linhas[linha]
                    linhas[linha] = linhas[linhaComp]
                    linhas[linhaComp] = aux
                }
            }
        }

        return new Tabela(cabecalho, linhas)
    }
}