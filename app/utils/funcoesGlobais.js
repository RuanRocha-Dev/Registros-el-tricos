export const formatarDataPtBr = (dataIso) => {
    const data = new Date(dataIso);
    return data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

export const formataNome = (str) => {
    const stringformatada = str.replace('_', ' ').toUpperCase();
    return stringformatada;
};

export const formatarDatatempoReal = (data) => {
    if (!data) return ''; 

    let valor = data.replace(/\D/g, ''); 
    let dia = valor.substring(0, 2);
    let mes = valor.substring(2, 4);
    let ano = valor.substring(4, 8);

    if (dia.length === 2) dia = Math.min(31, Math.max(1, parseInt(dia, 10))).toString().padStart(2, '0');
    if (mes.length === 2) mes = Math.min(12, Math.max(1, parseInt(mes, 10))).toString().padStart(2, '0');
    if (ano.length === 4) ano = Math.min(2999, Math.max(1000, parseInt(ano, 10))).toString();

    if (valor.length <= 2) return dia;
    if (valor.length <= 4) return `${dia}/${mes}`;
    return `${dia}/${mes}/${ano}`;
};


export const formatarHora = (text) => {
    if (!text) return '';

    let valor = text.replace(/\D/g, '');

    let hh = valor.substring(0, 2);
    let mm = valor.substring(2, 4);

    if (hh.length === 2) hh = Math.min(23, parseInt(hh, 10)).toString().padStart(2, '0');
    if (mm.length === 2) mm = Math.min(59, parseInt(mm, 10)).toString().padStart(2, '0');

    if (valor.length <= 2) return hh; 
    return `${hh}:${mm}`;
};
