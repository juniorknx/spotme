export function formatDate(value: string): string {
    const numbers = value.replace(/\D/g, "");

    const day = numbers.substring(0, 2);
    const month = numbers.substring(2, 4);
    const year = numbers.substring(4, 8);

    let formatted = day;
    if (month) formatted += "/" + month;
    if (year) formatted += "/" + year;

    return formatted;
}
