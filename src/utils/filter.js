export const currency = (num) => {
    const n = Number(num) || 0;
    return n.toLocaleString('ja-JP', {style: 'currency', currency: 'JPY'});
}