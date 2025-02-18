import { rankItem } from "@tanstack/match-sorter-utils";
import { Row } from "@tanstack/react-table";

export function fuzzyFilter<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: string,
): boolean {
  const itemRank = rankItem(row.getValue(columnId), filterValue);
  return itemRank.passed;
}
