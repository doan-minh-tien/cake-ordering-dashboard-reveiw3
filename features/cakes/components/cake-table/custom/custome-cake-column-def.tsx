"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { ICustomCake } from "../../../types/custome-cake";
import selectColumn from "./column/select-column";
import idColumn from "./column/id-column";
import cakeNameColumn from "./column/cake-name-column";
import customerColumn from "./column/customer-column";
import bakeryColumn from "./column/bakery-column";
import priceColumn from "./column/price-column";
import dateColumn from "./column/date-column";
import actionsColumn from "./column/actions-column";
import ingredientsColumn from "./column/ingredients-column";

export function fetchCustomCakeTableColumnDefs(): ColumnDef<
  ICustomCake,
  unknown
>[] {
  return [
    selectColumn,
    idColumn,
    cakeNameColumn,
    ingredientsColumn,
    customerColumn,
    bakeryColumn,
    priceColumn,
    dateColumn,
    actionsColumn,
  ];
}
