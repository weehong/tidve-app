import { ColumnDef, Table } from "@tanstack/react-table";

export type DataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  header?: string;
  searchPlaceholder?: string;
  enableSorting?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  rowsPerPage?: number;
  stickyHeader?: boolean;
  customLoadingComponent?: React.ReactNode;
  customErrorComponent?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  rowClassName?: string | ((row: TData) => string);
  headerClassName?: string;
  tableClassName?: string;
  enablePagination?: boolean;
  defaultPageSize?: number;
  defaultPageIndex?: number;
};

export type TableSearchProps = {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  searchPlaceholder: string;
};

export type TableHeaderProps<TData> = {
  table: Table<TData>;
  stickyHeader: boolean;
  headerClassName?: string;
};

export type TableBodyProps<TData> = {
  table: Table<TData>;
  isLoading: boolean;
  error: Error | null;
  onRefresh?: () => void;
  customLoadingComponent?: React.ReactNode;
  customErrorComponent?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  rowClassName?: string | ((row: TData) => string);
};

export type TablePaginationProps<TData> = {
  table: Table<TData>;
  pageSize: number;
  data: TData[];
};
