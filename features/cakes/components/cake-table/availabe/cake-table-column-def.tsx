"use client";

import { type ColumnDef } from "@tanstack/react-table";

import selectColumn from "./column/select-column";
import idColumn from "./column/id-column";
import priceColumn from "./column/price-column";
import quantityColumn from "./column/quantity-column";
import typeColumn from "./column/type-column";
import cakeImgColumn from "./column/cake-img-column";
import availableCakeNameColumn from "./column/available_cake_name";
import actionColumn from "./column/action-column";
import { ICake } from "@/features/cakes/types/cake";

export function fetchCakeTableColumnDefs(): ColumnDef<ICake, unknown>[] {
  return [
    selectColumn,
    idColumn,
    availableCakeNameColumn,
    cakeImgColumn,
    priceColumn,
    quantityColumn,
    typeColumn,
    actionColumn,
  ];
}
