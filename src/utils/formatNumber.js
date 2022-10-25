export default function formatNumber(number){
    if (!number) return number;
    const val = +number;
    if (isNaN(val)) return number;
    return new Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits: 4,
        maximumSignificantDigits: 2,
        compactDisplay: "short"
    }).format(val);
}