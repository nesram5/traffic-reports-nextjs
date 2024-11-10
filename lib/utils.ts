export function checkIfCurrentMonth(month: string) {
    const monthsInSpanish = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
  
    const currentMonthInSpanish = monthsInSpanish[new Date().getMonth()];
    return month.toLowerCase() === currentMonthInSpanish;
  }