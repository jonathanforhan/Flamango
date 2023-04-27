import { ComputeEngine } from "@cortex-js/compute-engine";
import { Expression } from "@cortex-js/compute-engine/dist/types/math-json/math-json-format";

export type MathJSON = Expression | Expression[] | null;

class MathEngine extends ComputeEngine {
  constructor() {
    super();
    super.jsonSerializationOptions = {
      exclude: ["Square", "Subtract"],
    };
  }

  TEST_INPUT(input: MathJSON): MathJSON[] /* TODO DELETE */ {
    return input ? [super.box(input).latex] : [];
  }

  createEquations(input: MathJSON): MathJSON[] {
    let result: MathJSON[] = [];
    if (input) {
      const expr = input as Expression[];
      if (expr[0] == "Equal") {
        result = this._recurseMathNodes(expr[1], expr[2]);
      }
    }

    return result.map((eq) => {
      const expr = eq as MathJSON[];
      if (expr && expr[1] instanceof Array) {
        var tmp = expr[1];
        expr[1] = expr[2];
        expr[2] = tmp;
      }
      return super.box(eq as Expression).simplify().latex;
    });
  }

  _recurseMathNodes(left: Expression, right: Expression): MathJSON[] {
    let result: MathJSON[] = [];

    if (left instanceof Array) {
      switch (left[0]) {
        case "Add": {
          result.push(...this._addOps(right, left));
          break;
        }
      }
    } else {
      result.push(["Equal", left, right]);
    }

    if (right instanceof Array) {
      switch (right[0]) {
        case "Add": {
          result.push(...this._addOps(left, right));
          break;
        }
      }
    } else {
      result.push(["Equal", right, left]);
    }

    return result;
  }

  _addOps(primary: MathJSON, secondary: MathJSON[]): MathJSON[] {
    let result: MathJSON[] = [];

    if (!(primary instanceof Array)) {
      primary = ["Add", primary as Expression];
    }

    for (let x of secondary.slice(1)) {
      result.push([
        "Equal",
        [...primary, ["Negate", x]],
        [...secondary, ["Negate", x]],
      ] as MathJSON);
    }

    console.log(JSON.stringify(result));

    return result;
  }
}

export default MathEngine;
