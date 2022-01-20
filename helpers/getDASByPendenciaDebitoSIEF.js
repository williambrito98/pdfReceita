function getDASByPendenciaDebitoSIEF(content, cnpj, razao) {
    const posTitle = content.indexOf('Pendência - Débito (SIEF)')
    let string = razao + ';' + cnpj + ';'
    let newContent = ''
    if (posTitle !== -1) {
        newContent = content.slice(posTitle)

        newContent = newContent.replace(/(Pendência - Débito \(SIEF\))\s+_+/gmi, '$1 ')
        const pos_ = newContent.indexOf('_')
        newContent = newContent.slice(0, pos_)
        newContent = newContent.replace(/(CNPJ:\s+\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i, '\n')
        newContent = newContent.replace(/Pendência - Débito \(SIEF\)/i, '')
        newContent = newContent.replace('Pendência - Divergência GFIP x GPS (AGUIA)', '')
        newContent = newContent.replace(/CNPJ:\s+\n.*/, '')
        const posValor = newContent.indexOf('Situação')
        newContent = newContent.slice(posValor + 8).trim()
        newContent = newContent.replace(/Notificação de lançamento:\s+\d{16}/gmi, '')
        newContent = newContent.replace('Pendência - Processo Fiscal (SIEF)', '')
        newContent = newContent.replace('Débito com Exigibilidade Suspensa (SIEF)', '')
        // console.log(newContent)
        let array = newContent.trim().split('\n').filter(item => item !== '')
        let aux = 0
        let canReturn = false
        for (let index = 0; index < array.length; index++) {
            if (aux == 0 && !array[index].includes('SIMPLES NAC')) {
                continue
            }
            canReturn = true
            if (aux === 5) {
                string += array[index].trim() + '\n'
                if (index !== (array.length - 1)) {
                    string += razao + ';' + cnpj + ';'
                }
                aux = 0
                continue
            }
            string += array[index].trim() + ';'
            aux++
        }
        return canReturn ? string : false
    }






    return false
}


module.exports = getDASByPendenciaDebitoSIEF