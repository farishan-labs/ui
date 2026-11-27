import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

interface BmlStateEntry {
  type: string;
  default: unknown;
}

interface BmlPropEntry {
  type: string;
  default: unknown;
}

interface BmlIr {
  name: string;
  atoms: string[];
  state: Record<string, BmlStateEntry>;
  props?: Record<string, BmlPropEntry>;
  transitions?: unknown[];
  a11y?: string;
}

const ROOT = resolve(import.meta.dir, "..", "..");
const ATOMS_DIR = resolve(ROOT, "src/behaviors/atoms");

const ATOM_IMPORTS: Record<string, { module: string; exportName: string }> = {
  disclosure: { module: "disclosure", exportName: "Disclosure" },
  roving: { module: "roving-tabindex", exportName: "RovingTabindex" },
};

function toPascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function relativeImport(fromDir: string, toDir: string): string {
  let rel = relative(fromDir, toDir).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

function compileAccordion(ir: BmlIr): string {
  const className = toPascalCase(ir.name);
  const optionsName = `${className}Options`;
  const factoryName = `create${className}`;

  const multipleDefault = ir.props?.multiple?.default ?? false;
  const collapsibleDefault = ir.props?.collapsible?.default ?? true;

  const lines: string[] = [];
  lines.push("__IMPORTS__");
  lines.push("");
  lines.push(`export interface ${optionsName} {`);
  lines.push("  multiple?: boolean;");
  lines.push("  collapsible?: boolean;");
  lines.push("  disabled?: (value: string) => boolean;");
  lines.push("  initialOpen?: string[];");
  lines.push("}");
  lines.push("");
  lines.push(`export class ${className} {`);
  lines.push("  open: string[];");
  lines.push("  multiple: boolean;");
  lines.push("  collapsible: boolean;");
  lines.push("  private disabledFn: (value: string) => boolean;");
  lines.push("  private roving: RovingTabindex;");
  lines.push("");
  lines.push(`  constructor(options: ${optionsName} = {}, count = 0) {`);
  lines.push(`    this.multiple = options.multiple ?? ${String(multipleDefault)};`);
  lines.push(`    this.collapsible = options.collapsible ?? ${String(collapsibleDefault)};`);
  lines.push("    this.disabledFn = options.disabled ?? (() => false);");
  lines.push("    this.open = [...(options.initialOpen ?? [])];");
  lines.push("    this.roving = new RovingTabindex(count);");
  lines.push("  }");
  lines.push("");
  lines.push("  isDisabled(value: string): boolean {");
  lines.push("    return this.disabledFn(value);");
  lines.push("  }");
  lines.push("");
  lines.push("  isExpanded(value: string): boolean {");
  lines.push("    return this.open.includes(value);");
  lines.push("  }");
  lines.push("");
  lines.push("  toggle(value: string): void {");
  lines.push("    if (this.isDisabled(value)) return;");
  lines.push("    const disclosure = new Disclosure(this.open.includes(value));");
  lines.push("    if (disclosure.open) {");
  lines.push("      if (this.collapsible || this.open.length > 1) {");
  lines.push("        disclosure.closePanel();");
  lines.push("        this.open = this.open.filter((v) => v !== value);");
  lines.push("      }");
  lines.push("    } else {");
  lines.push("      disclosure.openPanel();");
  lines.push("      this.open = this.multiple ? [...this.open, value] : [value];");
  lines.push("    }");
  lines.push("  }");
  lines.push("");
  lines.push("  get focusIndex(): number {");
  lines.push("    return this.roving.index;");
  lines.push("  }");
  lines.push("");
  lines.push("  setItemCount(count: number): void {");
  lines.push("    this.roving.setCount(count);");
  lines.push("  }");
  lines.push("");
  lines.push("  moveFocus(key: string): number {");
  lines.push("    return this.roving.handleKey(key);");
  lines.push("  }");
  lines.push("}");
  lines.push("");
  lines.push(
    `export function ${factoryName}(options?: ${optionsName}, count?: number): ${className} {`,
  );
  lines.push(`  return new ${className}(options, count);`);
  lines.push("}");

  return lines.join("\n") + "\n";
}

function compileTabs(ir: BmlIr): string {
  const className = toPascalCase(ir.name);
  const optionsName = `${className}Options`;
  const factoryName = `create${className}`;

  const lines: string[] = [];
  lines.push("__IMPORTS__");
  lines.push("");
  lines.push(`export interface ${optionsName} {`);
  lines.push("  initialActive?: string;");
  lines.push("}");
  lines.push("");
  lines.push(`export class ${className} {`);
  lines.push("  active: string;");
  lines.push("  private roving: RovingTabindex;");
  lines.push("");
  lines.push(`  constructor(options: ${optionsName} = {}, count = 0) {`);
  lines.push('    this.active = options.initialActive ?? "";');
  lines.push("    this.roving = new RovingTabindex(count);");
  lines.push("  }");
  lines.push("");
  lines.push("  isActive(value: string): boolean {");
  lines.push("    return this.active === value;");
  lines.push("  }");
  lines.push("");
  lines.push("  select(value: string): void {");
  lines.push("    this.active = value;");
  lines.push("  }");
  lines.push("");
  lines.push("  get focusIndex(): number {");
  lines.push("    return this.roving.index;");
  lines.push("  }");
  lines.push("");
  lines.push("  setItemCount(count: number): void {");
  lines.push("    this.roving.setCount(count);");
  lines.push("  }");
  lines.push("");
  lines.push("  moveFocus(key: string): number {");
  lines.push("    return this.roving.handleKey(key);");
  lines.push("  }");
  lines.push("}");
  lines.push("");
  lines.push(
    `export function ${factoryName}(options?: ${optionsName}, count?: number): ${className} {`,
  );
  lines.push(`  return new ${className}(options, count);`);
  lines.push("}");

  return lines.join("\n") + "\n";
}

function generate(ir: BmlIr, outputPath: string): string {
  const outputDir = dirname(resolve(outputPath));
  const atomsImportDir = relativeImport(outputDir, ATOMS_DIR);

  const neededAtoms = ir.name === "tabs" ? ["roving"] : ir.atoms;
  const atomNames = neededAtoms.map((a) => ATOM_IMPORTS[a]).filter(Boolean);

  const importLines = atomNames
    .map((info) => `import { ${info.exportName} } from "${atomsImportDir}/${info.module}";`)
    .join("\n");

  let body: string;
  if (ir.name === "tabs") {
    body = compileTabs(ir);
  } else {
    body = compileAccordion(ir);
  }

  return body.replace("__IMPORTS__", importLines);
}

export function compileBml(inputPath: string, outputPath: string): string {
  const ir = JSON.parse(readFileSync(resolve(inputPath), "utf8")) as BmlIr;
  if (!ir.name || !ir.atoms || !ir.state) {
    throw new Error("Invalid BML IR: missing name/atoms/state");
  }
  if (ir.name !== "accordion" && ir.name !== "tabs") {
    throw new Error(`Unsupported BML behavior: ${ir.name} (supported: accordion, tabs)`);
  }
  const code = generate(ir, outputPath);
  mkdirSync(dirname(resolve(outputPath)), { recursive: true });
  writeFileSync(resolve(outputPath), code, "utf8");
  return code;
}

export function main(): void {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: compile-bml.ts <input.bml.json> <output.ts>");
    process.exit(1);
  }
  const inputPath = args[0];
  const outputPath = args[1];
  compileBml(inputPath, outputPath);
  console.log(`Compiled ${inputPath} -> ${outputPath}`);
}

if (import.meta.main) {
  main();
}
