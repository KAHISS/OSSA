export const createFilterLink = (filterName: string, value: string, params: any) => {
    const newParams = new URLSearchParams(params as Record<string, string>);
    newParams.set(filterName, value);
    return `?${newParams.toString()}`;
};