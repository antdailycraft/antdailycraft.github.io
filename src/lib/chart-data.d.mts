export interface DataPoint { date: string; value: number }
export interface ParsedSeries { points: DataPoint[]; invalidRows: number }
export function parseSeries(csv: string, column: string): ParsedSeries;
export function alignSeries(prices: DataPoint[], dividends: DataPoint[]): { dates: string[]; prices: (number | null)[]; dividends: (number | null)[] };
