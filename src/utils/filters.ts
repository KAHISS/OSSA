export const createFilterLink = (nomeDoFiltro: string, valor: string, params: any) => {
    const novosParametros = new URLSearchParams(params as Record<string, string>);
    novosParametros.set(nomeDoFiltro, valor);
    return `?${novosParametros.toString()}`;
};