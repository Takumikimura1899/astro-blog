import { format } from "@formkit/tempo";

export const getFormattedYearMonthDay = (date: string) =>
  format(date, "short", "ja-JP");
