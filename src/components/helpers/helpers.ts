export const NumberFormatter = (
  number: string,
  country: number,
  setFormattedPhoneNumber: (val: string) => void
): void => {
  const digits = (number || "").replace(/\D+/g, "");

  if (country === 1 || country === 3) {
    const a = digits.slice(0, 3);
    const b = digits.slice(3, 6);
    const c = digits.slice(6, 10);
    let formatted = "";
    if (a) formatted = `(${a}`;
    if (a && a.length === 3) formatted += `)`;
    if (b) formatted += `${a.length === 3 ? "" : ")"}${b}`;
    if (c) formatted += `-${c}`;
    setFormattedPhoneNumber(formatted);
    return;
  }

  if (country === 2) {
    const nat = digits.replace(/^44/, "");
    const a = nat.slice(0, 4);
    const b = nat.slice(4, 10);
    let formatted = "+44";
    if (a) formatted += ` ${a}`;
    if (b) formatted += ` ${b}`;
    setFormattedPhoneNumber(formatted);
    return;
  }

  setFormattedPhoneNumber(digits);
};
