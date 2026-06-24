/**
 * Traduz o enum de status da matrícula no plano (RegistrationStatus) para Português.
 */
export const translateRegistrationStatus = (status: string) => {
    const statuses: Record<string, string> = {
        ACTIVE: "Ativa",
        INACTIVE: "Inativa",
        SUSPENDED: "Suspensa",
        CANCELLED: "Cancelada",
    };

    return statuses[status?.toUpperCase()] || status;
};

/**
 * Converte o campo "period" do Plano (Mensal, Trimestral, Semestral, Anual)
 * na quantidade de meses correspondente.
 */
export const periodToMonths = (period: string): number => {
    const periods: Record<string, number> = {
        Mensal: 1,
        Trimestral: 3,
        Semestral: 6,
        Anual: 12,
    };

    return periods[period] ?? 1; // fallback: 1 mês caso o período não seja reconhecido
};

/**
 * Calcula a data de vencimento (dueDate) de uma matrícula em plano a partir
 * de uma data de início e do período/duração do plano.
 */
export const calculateDueDate = (period: string, startDate: Date = new Date()): Date => {
    const months = periodToMonths(period);
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + months);
    return dueDate;
};
