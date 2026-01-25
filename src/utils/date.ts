import { format } from "@formkit/tempo";

export const formatDate = (date: string) => format(date, "short", "ja-JP");
