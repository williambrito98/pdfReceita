const pdf = require("pdf-parse");
const path = require("path");
const fs = require("fs");
const getDASByPendenciaParcelamento = require("./helpers/getDASByPendenciaParcelamento");
const getDASByPendenciaDebitoSIEF = require("./helpers/getDASByPendenciaDebitoSIEF");
const getDASByDebitoComExigibilidadeSuspensaSIEF = require("./helpers/getDASByDebitoComExigibilidadeSuspensaSIEF");
const getINSS = require("./helpers/getINSSByPendenciaDivergenciaGFPxGPS");
const getPGDAS = require("./helpers/getPGDAS");
const removeHeader = require("./helpers/removeHeader");
const InputDirectory = path.join(__dirname, "teste");
const OutputDirectoryDAS = path.join(__dirname, "DAS.csv");
const OutputDirectoryINSS = path.join(__dirname, "INSS.csv");
const OutputDirectoryPGDAS = path.join(__dirname, "PGDAS.csv");
const OutputDirectorySIEF = path.join(__dirname, "DAS_DEBITO_SIEF.csv");
const OutputDirectoryExigibilidadeSuspensa = path.join(
  __dirname,
  "DAS_DEBITO_EXIGIBILIDADE_SUSPENSA.csv"
);
(async () => {
  const cliente = fs.readdirSync(InputDirectory);
  for (let index = 0; index < cliente.length; index++) {
    if (
      fs.statSync(path.join(path.join(InputDirectory, cliente[index]))).isFile()
    ) {
      const contentPdf = removeHeader(
        (await pdf(path.join(InputDirectory, cliente[index]))).text
      );
      const cnpj = contentPdf
        .match(/CNPJ:\s+\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/gim)[0]
        .replace("CNPJ:", "")
        .trim();
      const razaoSocial = contentPdf
        .match(/CNPJ:\s+\d{2}\.\d{3}\.\d{3}\s+-\s+.+/gim)[0]
        .split("-")[1]
        .trim();

      const DAS = getDASByPendenciaParcelamento(contentPdf, cnpj, razaoSocial);
      const INSS = getINSS(contentPdf, cnpj, razaoSocial);
      const PGDAS = getPGDAS(contentPdf, cnpj, razaoSocial);
      const DasPendenciaDebitoSief = getDASByPendenciaDebitoSIEF(
        contentPdf,
        cnpj,
        razaoSocial
      );
      const DasDebitoExigibilidadeSuspensa =
        getDASByDebitoComExigibilidadeSuspensaSIEF(
          contentPdf,
          cnpj,
          razaoSocial
        );
      DAS ? fs.appendFileSync(OutputDirectoryDAS, DAS + "\n") : "";
      INSS ? fs.appendFileSync(OutputDirectoryINSS, INSS + "\n") : "";
      PGDAS ? fs.appendFileSync(OutputDirectoryPGDAS, PGDAS + "\n") : "";
      DasPendenciaDebitoSief
        ? fs.appendFileSync(OutputDirectorySIEF, DasPendenciaDebitoSief + "\n")
        : "";
      DasDebitoExigibilidadeSuspensa
        ? fs.appendFileSync(
            OutputDirectorySIEF,
            OutputDirectoryExigibilidadeSuspensa + "\n"
          )
        : "";
      continue;
    }

    const cliente2 = fs.readdirSync(
      path.join(path.join(InputDirectory, cliente[index]))
    );
    for (let y = 0; y < cliente2.length; y++) {
      if (
        fs
          .statSync(
            path.join(path.join(InputDirectory, cliente[index], cliente2[y]))
          )
          .isFile()
      ) {
        const contentPdf = removeHeader(
          (await pdf(path.join(InputDirectory, cliente[index], cliente2[y])))
            .text
        );
        const cnpj = contentPdf
          .match(/CNPJ:\s+\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/gim)[0]
          .replace("CNPJ:", "")
          .trim();
        const razaoSocial = contentPdf
          .match(/CNPJ:\s+\d{2}\.\d{3}\.\d{3}\s+-\s+.+/gim)[0]
          .split("-")[1]
          .trim();

        const DAS = getDASByPendenciaParcelamento(
          contentPdf,
          cnpj,
          razaoSocial
        );
        const INSS = getINSS(contentPdf, cnpj, razaoSocial);
        const PGDAS = getPGDAS(contentPdf, cnpj, razaoSocial);
        const DasPendenciaDebitoSief = getDASByPendenciaDebitoSIEF(
          contentPdf,
          cnpj,
          razaoSocial
        );
        const DasDebitoExigibilidadeSuspensa =
          getDASByDebitoComExigibilidadeSuspensaSIEF(
            contentPdf,
            cnpj,
            razaoSocial
          );
        DAS ? fs.appendFileSync(OutputDirectoryDAS, DAS + "\n") : "";
        INSS ? fs.appendFileSync(OutputDirectoryINSS, INSS + "\n") : "";
        PGDAS ? fs.appendFileSync(OutputDirectoryPGDAS, PGDAS + "\n") : "";
        DasPendenciaDebitoSief
          ? fs.appendFileSync(
              OutputDirectorySIEF,
              DasPendenciaDebitoSief + "\n"
            )
          : "";
        DasDebitoExigibilidadeSuspensa
          ? fs.appendFileSync(
              OutputDirectorySIEF,
              OutputDirectoryExigibilidadeSuspensa + "\n"
            )
          : "";
        continue;
      }
    }
  }
})();
