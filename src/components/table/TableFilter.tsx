import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn, Row } from "@tanstack/react-table";

export const fuzzyFilter: FilterFn<unknown> = <TData,>(
  row: Row<TData>,
  columnId: string,
  filterValue: string,
) => {
  const itemRank = rankItem(row.getValue(columnId), filterValue);
  return itemRank.passed;
};
