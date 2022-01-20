
function removeHeader(content) {
    const RegExpArray = [
        new RegExp('MINISTÉRIO DA ECONOMIA', 'gmi'),
        new RegExp('SECRETARIA ESPECIAL DA RECEITA FEDERAL DO BRASIL', 'gmi'),
        new RegExp('PROCURADORIA-GERAL DA FAZENDA NACIONAL', 'gmi'),
        new RegExp('INFORMAÇÕES DE APOIO PARA EMISSÃO DE CERTIDÃO', 'gmi'),
        new RegExp('Por meio do e-CAC - CNPJ do certificado: \\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}', 'gmi'),
        new RegExp('\\d{2}\\/\\d{2}\\/\\d{4}\\s+\\d{2}:\\d{2}:\\d{2}', 'gmi'),
        new RegExp('Página: \\d{1}\\s+\\/\\s+\\n\\d{1}', 'gmi')
    ]

    let newContent = content

    for (let index = 0; index < RegExpArray.length; index++) {
        newContent = newContent.replace(RegExpArray[index], '')
    }

    return newContent

}

module.exports = removeHeader