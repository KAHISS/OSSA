/**
 * Traduz o enum de dia da semana do Prisma para Português.
 */
export const translateDay = (day: string) => {
    const days: Record<string, string> = {
        MONDAY: "Segunda-feira",
        TUESDAY: "Terça-feira",
        WEDNESDAY: "Quarta-feira",
        THURSDAY: "Quinta-feira",
        FRIDAY: "Sexta-feira",
        SATURDAY: "Sábado",
        SUNDAY: "Domingo"
    };
    
    return days[day.toUpperCase()] || day;
};