function getDASByPendenciaParcelamento(content, cnpj, razao) {
  const posTitle = content.indexOf("Pendência - Parcelamento (PARCSN/PARCMEI)");
  let newContent = "";
  let string = razao + ";" + cnpj + ";";
  if (posTitle !== -1) {
    newContent = content.slice(posTitle);
    newContent = newContent.replace(
      /(Pendência - Parcelamento \(PARCSN\/PARCMEI\))\s+_+/gim,
      "$1 "
    );
    const pos_ = newContent.indexOf("_");
    newContent = newContent.slice(0, pos_);
    newContent = newContent.replace(
      /(CNPJ:\s+\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i,
      "\n"
    );
    newContent = newContent.replace(
      /Pendência - Divergência GFIP x GPS \(AGUIA\) Divergência de GFIP x GPS\(Valor declarado menos o recolhido, por rubrica e FPAS\)/i,
      ""
    );
    newContent = newContent.replace(/CNPJ:\s+\n.*/gim, "");
    newContent = newContent.replace("Pendência - Débito (SIEF) ", "");
    newContent = newContent.replace(
      "Pendência - Parcelamento (PARCSN/PARCMEI)",
      ""
    );
    newContent = newContent.replace(
      "Débito com Exigibilidade Suspensa (SIEF)",
      ""
    );
    newContent = newContent.replace(
      "Parcelamento com Exigibilidade Suspensa (PARCSN/PARCMEI)",
      ""
    );
    newContent = newContent.replace(
      /(Parcelas em atraso)\n\n(\d{1})/gim,
      "$1: $2"
    );
    //console.log(newContent.match(/(Parcelas em atraso)\n\n\d{1}/gmi))
    let array = newContent
      .trim()
      .split("\n")
      .filter((item) => item.trim() !== "");
    let aux = 0;
    let canReturn = false;
    for (let index = 0; index < array.length; index++) {
      //f (aux == 0 && !array[index].includes('SIMPLES NAC')) {
      //continue
      // }
      canReturn = true;
      if (aux === 2) {
        string += "\n";
        if (index !== array.length - 1) {
          string += razao + ";" + cnpj + ";" + array[index].trim() + ";";
        }
        aux = 0;
        continue;
      }
      string += array[index].trim() + ";";
      aux++;
    }
    return canReturn ? string : false;
    // process.exit()
  }
}

module.exports = getDASByPendenciaParcelamento;
