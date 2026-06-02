import { ModuleRegistry } from "ag-grid-community";
import { ClientSideRowModelModule } from "ag-grid-community";
import { TextFilterModule } from "ag-grid-community";
import { NumberFilterModule } from "ag-grid-community";
import { PaginationModule } from "ag-grid-community";
import { RowAutoHeightModule } from "ag-grid-community";
import { RenderApiModule } from "ag-grid-community";
import { CellApiModule } from "ag-grid-community";
import { PinnedRowModule } from "ag-grid-community";
import { CellStyleModule } from "ag-grid-community";
import { ValidationModule } from "ag-grid-community";
import { RowStyleModule } from "ag-grid-community";

// Register only the modules actually used across all grids.
// Replaces AllCommunityModule (~500KB) with ~120KB of targeted imports.
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  PaginationModule,
  RowAutoHeightModule,
  RenderApiModule,
  CellApiModule,
  PinnedRowModule,
  CellStyleModule,
  ValidationModule,
  RowStyleModule,
]);
