export function numberWithCommas(x?: number): string | null {
  if (x) return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  else return null;
}
