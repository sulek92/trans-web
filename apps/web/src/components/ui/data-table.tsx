import * as React from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export function DataTable<T>({ data, columns, className }: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto rounded-md border border-[var(--color-outline-variant)]", className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b bg-[var(--color-surface-offset)] text-[var(--color-on-surface-variant)]">
          <tr className="border-b border-[var(--color-outline-variant)] transition-colors">
            {columns.map((col, i) => (
              <th key={i} className="h-12 px-4 text-left align-middle font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0 bg-[var(--color-surface)] text-[var(--color-on-background)]">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                Brak danych.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-[var(--color-outline-variant)] transition-colors hover:bg-[var(--color-surface-offset)]/50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-4 align-middle">
                    {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey]) : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
