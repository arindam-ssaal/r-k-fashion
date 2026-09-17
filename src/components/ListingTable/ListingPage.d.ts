import { CSSProperties, ReactNode } from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple"
  | "teal"
  | "neutral";

export interface BadgeConfig {
  variant?: BadgeVariant;
  label?: string;
  dot?: boolean;
  style?: CSSProperties;
}

export interface ColumnDef<T = Record<string, unknown>> {
  field: string;
  header: string;
  type?:
    | "code"
    | "link"
    | "date"
    | "number"
    | "currency"
    | "badge"
    | "boolean"
    | "checkbox";
  width?: string;
  minWidth?: string;
  sortable?: boolean;
  cellClass?: string;
  tdStyle?: CSSProperties;
  render?: (value: unknown, row: T) => ReactNode;
  isLink?: boolean;
  badgeMap?: Record<string, BadgeConfig>;
  badgeFn?: (value: unknown, row: T) => BadgeConfig;
  trueLabel?: string;
  falseLabel?: string;
}

export interface StatCard {
  label: string;
  value: number | string;
  icon?: string;
  iconClass?: "blue" | "green" | "amber" | "red" | "purple" | "teal";
  filterKey?: string;
}

export interface FilterChip {
  key: string;
  label: string;
  chipClass?: string;
  filterFn?: (row: Record<string, unknown>) => boolean;
}

export interface ToolbarAction {
  label?: string;
  icon?: string;
  btnClass?: string;
  onClick?: (selectedIds: (string | number)[]) => void;
  showWhen?: "always" | "selected" | "never";
}

export interface RowAction<T = Record<string, unknown>> {
  icon?: string;
  title?: string;
  btnClass?: string;
  onClick?: (row: T) => void;
}

export interface PrimaryAction {
  label: string;
  icon?: string;
  onClick: () => void;
}

export interface ListingPageProps<T = Record<string, unknown>> {
  title?: string;
  subtitle?: string;
  titleIcon?: string;
  rowData?: T[];
  columns?: ColumnDef<T>[];
  rowKey?: string;
  loading?: boolean;
  stats?: StatCard[];
  filterChips?: FilterChip[];
  defaultFilter?: string;
  searchPlaceholder?: string;
  searchFields?: string[];
  defaultSortCol?: string;
  defaultSortDir?: "asc" | "desc";
  pageSize?: number;
  selectable?: boolean;
  toolbarActions?: ToolbarAction[];
  rowActions?: RowAction<T>[];
  primaryAction?: PrimaryAction | null;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyIcon?: string;
  emptyText?: string;
  className?: string;
}

declare function ListingPage<T = Record<string, unknown>>(
  props: ListingPageProps<T>
): JSX.Element;

export default ListingPage;
