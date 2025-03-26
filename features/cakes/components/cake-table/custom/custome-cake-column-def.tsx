"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { ICustomCake } from "../../../types/custome-cake";
import selectColumn from "./column/select-column";
import idColumn from "./column/id-column";


export function fetchCustomCakeTableColumnDefs(): ColumnDef<ICustomCake, unknown>[] {
  return [
    selectColumn,    
    idColumn,

  ];
}
