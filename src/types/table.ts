import { ColumnDef, Table } from "@tanstack/react-table";

export type DataTableProps<TData> = {
  id: string;
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  enableSorting?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnFilters?: boolean;
  stickyHeader?: boolean;
  customLoadingComponent?: React.ReactNode;
  customErrorComponent?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  rowClassName?: string;
  wrapperClassName?: string;
  headerClassName?: string;
  tableClassName?: string;
  modalComponent?: React.ReactNode;
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
