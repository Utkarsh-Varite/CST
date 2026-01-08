type LabelMap<TValues extends Record<string, any>> = Partial<
  Record<keyof TValues, string>
>;

type ValueFormatter<TValues extends Record<string, any>> = Partial<
  Record<keyof TValues, (value: any, allValues: TValues) => string>
>;

export function buildChangeLogString<
  TValues extends Record<string, any>
>(args: {
  isEditMode: boolean;
  prevValues: TValues; // usually Formik initialValues or snapshot at edit start
  currValues: TValues; // current Formik values
  labelMap?: LabelMap<TValues>;
  formatters?: ValueFormatter<TValues>;
  fields?: (keyof TValues)[];
  skipEmptyBoth?: boolean;
}): string {
  const {
    isEditMode,
    prevValues,
    currValues,
    fields,
    skipEmptyBoth = true,
  } = args;

  // ✅ IMPORTANT: typed defaults (instead of labelMap = {})
  const labelMap: LabelMap<TValues> = args.labelMap ?? {};
  const formatters: ValueFormatter<TValues> = args.formatters ?? {};

  if (!isEditMode) return "";
  if (!prevValues || !currValues) return "";

  const restrictedKeys = new Set<keyof TValues>([
    "accountManagerFirstName" as keyof TValues,
    "accountManagerLastName" as keyof TValues,
  ]);

  const keysToCheck = (fields ?? (Object.keys(currValues) as (keyof TValues)[]))
    .filter((k) => k in prevValues)
    .filter((k) => !restrictedKeys.has(k));

  const normalize = (v: any) => {
    if (v === null || v === undefined) return "";
    if (v instanceof Date) return v.toISOString();
    return String(v).trim();
  };

  const formatValue = (key: keyof TValues, value: any) => {
    const formatter = formatters[key];
    const formatted = formatter ? formatter(value, currValues) : value;
    return normalize(formatted);
  };

  const parts: string[] = [];

  for (const key of keysToCheck) {
    const prev = formatValue(key, prevValues[key]);
    const curr = formatValue(key, currValues[key]);

    if (skipEmptyBoth && prev === "" && curr === "") continue;

    if (prev !== curr) {
      const label = labelMap[key] ?? String(key);
      parts.push(`Previous ${label}: ${prev} ,Current ${label}: ${curr}`);
    }
  }

  return parts.join("; ");
}
