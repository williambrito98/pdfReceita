const pdf = require('pdf-parse');
const path = require('path');
const fs = require('fs')
const getDASByPendenciaParcelamento = require('./helpers/getDASByPendenciaParcelamento')
const removeHeader = require('./helpers/removeHeader')
const InputDirectory = path.join(__dirname, 'entrada');
const OutputDirectoryDAS = path.join(__dirname, 'DAS.csv');
const OutputDirectoryINSS = path.join(__dirname, 'INSS.csv');
const OutputDirectoryPGDAS = path.join(__dirname, 'PGDAS.csv');
(async () => {
    const cliente = fs.readdirSync(InputDirectory);
    for (let index = 0; index < cliente.length; index++) {
        const contentPdf = removeHeader((await pdf(path.join(InputDirectory, cliente[index]))).text)
        const cnpj = contentPdf.match(/CNPJ:\s+\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/gmi)[0].replace('CNPJ:', '').trim()
        const razaoSocial = contentPdf.match(/CNPJ:\s+\d{2}\.\d{3}\.\d{3}\s+-\s+.+/gmi)[0].split('-')[1].trim()

        const DAS = getDASByPendenciaParcelamento(contentPdf, cnpj, razaoSocial)
        //const INSS = getINSS(contentPdf, cnpj, razaoSocial)
        //const PGDAS = getPGDAS(contentPdf, cnpj, razaoSocial)
        DAS ? fs.appendFileSync(OutputDirectoryDAS, DAS + '\n') : ''
        //INSS ? fs.appendFileSync(OutputDirectoryINSS, INSS + '\n') : ''
        //PGDAS ? fs.appendFileSync(OutputDirectoryPGDAS, PGDAS + '\n') : ''
    }
})()


