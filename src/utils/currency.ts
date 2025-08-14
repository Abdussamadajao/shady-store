interface FormatNGNOptions {
  style: "currency";
  currency: "NGN";
  minimumFractionDigits: number;
  maximumFractionDigits: number;
}

export function formatNGN(amount: number | string): string {
  const number = Number(amount);

  if (isNaN(number)) {
    throw new Error("Invalid amount: Must be a number");
  }

  // Format with 2 decimal places
  const options: FormatNGNOptions = {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formatted = new Intl.NumberFormat("en-NG", options).format(number);

  // Remove .00 if present for whole numbers
  return formatted.replace(/\.00$/, "");
}
