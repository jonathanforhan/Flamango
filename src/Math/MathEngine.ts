import { ComputeEngine } from "@cortex-js/compute-engine";
import { Expression } from "@cortex-js/compute-engine/dist/types/math-json/math-json-format";

export type MathJSON = Expression | Expression[] | null;

class MathEngine extends ComputeEngine {
  private opLeft: string[] = [];
  private opRight: string[] = [];

  constructor() {
    super();
    super.jsonSerializationOptions = {
      exclude: ["Square", "Subtract"],
    };
  }

  TEST_INPUT(input: MathJSON): MathJSON[] /* TODO DELETE */ {
    console.log(JSON.stringify(input));
    return input ? [super.box(input).latex] : [];
  }

  createEquations(input: MathJSON): MathJSON[] {
    [this.opLeft, this.opRight] = [[], []];
    if (input) {
      const expr = input as Expression[];
      this._recurseMathNodes(expr[1] as MathJSON[], this.opLeft);
      this._recurseMathNodes(expr[2] as MathJSON[], this.opRight);
    }
    console.log("left", this.opLeft);
    console.log("right", this.opRight);

    let result: MathJSON[] = [];
    if (input) {
      const expr = input as Expression[];
      if (expr[0] == "Equal") {
        result = this._evalMathNodes(expr[1], expr[2]);
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

  _simplify(json: MathJSON[]) {
    return json.map((eq) => {
      return super.box(eq as Expression).simplify().json;
    });
  }

  _recurseMathNodes(input: MathJSON[], store: string[]) {
    if (!input || !(input instanceof Array)) return;
    store.push(input[0] as string);
    for (let i = 1; i < input.length; i++) {
      if (input[i] instanceof Array) {
        this._recurseMathNodes(input[i] as MathJSON[], store);
      }
    }
  }

  _evalMathNodes(left: Expression, right: Expression): MathJSON[] {
    let result: MathJSON[] = [];

    if (left instanceof Array) {
      switch (this.opLeft[0]) {
        case "Add": {
          result.push(...this._addOps(right, left));
          this.opLeft = this.opLeft.slice(1);
          break;
        }
      }
    } else {
      result.push(["Equal", left, right]);
    }

    if (right instanceof Array) {
      switch (this.opRight[0]) {
        case "Add": {
          result.push(...this._addOps(left, right));
          this.opRight = this.opRight.slice(1);
          break;
        }
      }
    } else {
      result.push(["Equal", right, left]);
    }

    return this._simplify(result);
  }

  /**
   * Handles add operations, isolates each component of the add operation
   */
  _addOps(primary: MathJSON, secondary: MathJSON[]): MathJSON[] {
    let result: MathJSON[] = [];

    // Make a singlet like 'x' become an add operation
    // ['Add', 'x']
    if (!(primary instanceof Array)) {
      primary = ["Add", primary as Expression];
    }

    // Add the negative of the accompanying addition term, for example
    // a = b + c -> a + (-b) = b + c + (-b)
    for (let i = 1; i < secondary.length; i++) {
      const negator = secondary.filter((_, index) => {
        return index !== 0 && index !== i;
      });

      result.push([
        "Equal",
        [...primary, ["Negate", ...negator]],
        [...secondary, ["Negate", ...negator]],
      ] as MathJSON);
    }

    // simplify answer to get rid of the double negations
    // a + (-b) = b + c + (-b) -> c = -b + a
    return this._simplify(result);
  }
}

export default MathEngine;
