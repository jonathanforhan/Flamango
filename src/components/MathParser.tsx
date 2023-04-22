import { ComputeEngine } from "@cortex-js/compute-engine";

export type MathJSON = string | number | MathJSON[] | null;

const operatorMap = new Map();
operatorMap.set("Add", "Subtract");
operatorMap.set("Multiply", "Divide");

export class MathEngine extends ComputeEngine {
  private _equations: MathJSON[];

  constructor() {
    super();
    this._equations = [];
  }

  // Parse TeX input to ComputeObject
  parse(expression: string | undefined) {
    return super.parse(expression);
  }

  // Parse MathJSON to LaTeX
  toLatex(expression: MathJSON): string {
    if (expression != null) {
      // return JSON.stringify(expression);
      return super.serialize(expression);
    }
    return "";
  }

  // Generate all valid equations that isolate one variable
  generateEquations(expr: MathJSON[]): MathJSON[] {
    const leftSide = expr[1];
    const rightSide = expr[2];

    this._equations = [];
    this._recurseOps(leftSide, rightSide);

    return this._equations;
  }

  _recurseOps(a: MathJSON, b: MathJSON) {
    if (a instanceof Array<MathJSON>) {
      const operator = a[0];
      const inverse = operatorMap.get(operator);

      for (let i = 1; i < a.length; ++i) {
        let exculsiveNodes: MathJSON = a.filter((_, index) => {
          return i !== index && 0 !== index;
        });
        if (exculsiveNodes.length === 1) {
          exculsiveNodes = exculsiveNodes[0];
        } else {
          exculsiveNodes.unshift(operator);
        }
        this._equations.push(["Equal", a[i], [inverse, b, exculsiveNodes]]);
      }
    }
    if (b instanceof Array<MathJSON>) {
      const operator = b[0];
      const inverse = operatorMap.get(operator);

      for (let i = 1; i < b.length; ++i) {
        let exculsiveNodes: MathJSON = b.filter((_, index) => {
          return i !== index && 0 !== index;
        });
        if (exculsiveNodes.length === 1) {
          exculsiveNodes = exculsiveNodes[0];
        } else {
          exculsiveNodes.unshift("Negate");
        }
        // TODO add Negate for correct operations
        this._equations.push(["Equal", b[i], [inverse, a, exculsiveNodes]]);
      }
    }
  }

  // Append add operations to equations list
  _addOps(primary: MathJSON, secondary: MathJSON) {}
}
