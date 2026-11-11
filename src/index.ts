// @farishan-labs/ui — entry point.
// Importing this module registers all custom elements and re-exports primitives.

export { Component } from "./core/component";
export { Button } from "./components/button";
export { Badge } from "./components/badge";
export { Card } from "./components/card";
export { Field } from "./components/field";
export { Dialog } from "./components/dialog";
export { Toast } from "./components/toast";
export { EmptyState } from "./components/empty-state";
export { LoadingState } from "./components/loading-state";
export { CommandPalette } from "./components/command-palette";

export * from "./tokens";

// Side-effect registration happens in each component module on import.
import "./components/button";
import "./components/badge";
import "./components/card";
import "./components/field";
import "./components/dialog";
import "./components/toast";
import "./components/empty-state";
import "./components/loading-state";
import "./components/command-palette";
