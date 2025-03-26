"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { ICakeDecorationType } from "../../../types/cake-decoration-type";
import selectColumn from "./column/select-column";


export function fetchCakeDecorationTableColumnDefs(): ColumnDef<ICakeDecorationType, unknown>[] {
  return [
    selectColumn,    

  ];
}
