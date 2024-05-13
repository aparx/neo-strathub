import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { Text } from "../text";
import * as css from "./table.css";

export type TableProps = ComponentPropsWithoutRef<"div">;
export type TableHeadProps = ComponentPropsWithoutRef<"thead">;
export type TableBodyProps = ComponentPropsWithoutRef<"tbody">;
export type TableRowProps = ComponentPropsWithoutRef<"tr">;
export type TableCellProps = ComponentPropsWithoutRef<"td">;

export const Root = forwardRef<HTMLDivElement, TableProps>(
  function TableRoot(props, ref) {
    const { className, children, ...restProps } = props;
    return (
      <Text
        ref={ref}
        className={mergeClassNames(css.root, className)}
        {...restProps}
      >
        <table className={css.table} cellSpacing={0} cellPadding={0}>
          {children}
        </table>
      </Text>
    );
  },
);

export const Head = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead({ className, ...restProps }, ref) {
    return (
      <thead
        ref={ref}
        className={mergeClassNames(css.head, className)}
        {...restProps}
      />
    );
  },
);

export const Body = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ className, ...restProps }, ref) {
    return (
      <tbody
        ref={ref}
        className={mergeClassNames(css.body, className)}
        {...restProps}
      />
    );
  },
);

export const Row = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ className, ...restProps }, ref) {
    return (
      <tr
        ref={ref}
        className={mergeClassNames(css.row, className)}
        {...restProps}
      />
    );
  },
);

export const Cell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell({ className, ...restProps }, ref) {
    return (
      <td
        ref={ref}
        className={mergeClassNames(css.cell, className)}
        {...restProps}
      />
    );
  },
);

export const HeadCell = forwardRef<HTMLTableHeaderCellElement, TableCellProps>(
  function TableHeadCell({ className, ...restProps }, ref) {
    return (
      <th
        ref={ref}
        className={mergeClassNames(css.cell, className)}
        {...restProps}
      />
    );
  },
);
