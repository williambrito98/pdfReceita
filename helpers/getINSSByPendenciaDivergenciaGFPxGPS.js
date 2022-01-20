function getINSSByPendenciaDivergenciaGFPxGPS(content, cnpj, razao) {
    const posTitle = content.indexOf('Pendência - Divergência GFIP x GPS (AGUIA)')
    let newContent = ''
    if (posTitle !== -1) {
        newContent = content.slice(posTitle)
        newContent = newContent.replace(/(Pendência - Divergência GFIP x GPS \(AGUIA\))\s+_+/gmi, '$1 ')
        const pos_ = newContent.indexOf('_')
        newContent = newContent.slice(0, pos_)
        newContent = newContent.replace(/(CNPJ:\s+\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i, '\n')
        newContent = newContent.replace(/Pendência - Divergência GFIP x GPS \(AGUIA\) Divergência de GFIP x GPS\(Valor declarado menos o recolhido, por rubrica e FPAS\)/i, '')
        newContent = newContent.replace(/CNPJ:\s+\n.*/gmi, '')
        newContent = newContent.replace('Pendência - Débito (SICOB)', '')
        const posValor = newContent.indexOf('Valor')
        newContent = newContent.slice(posValor + 5).trim()
        //console.log(newContent)
        let array = newContent.split('\n').filter(item => item !== '')
        let string = razao + ';' + cnpj + ';'
        let ano = ''
        let aux = 0
        for (let index = 0; index < array.length; index++) {
            if (aux === 4) {
                string += '\n'
                if (array[index].includes('/')) {
                    ano = array[index]
                    aux = 0
                    string += razao + ';' + cnpj + ';' + ano + ';'
                } else {
                    aux = 1
                    string += razao + ';' + cnpj + ';' + ano + ';' + array[index] + ';'
                }
                continue
            }

            if (array[index].includes('/')) {
                ano = array[index].trim()
                string += ano + ';'
                continue
            }


            string += array[index].trim() + ';'
            aux++
        }
        return string
    }
    return false
}

module.exports = getINSSByPendenciaDivergenciaGFPxGPS