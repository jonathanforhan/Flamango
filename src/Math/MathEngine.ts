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

    let result: MathJSON[] = [];
    if (input) {
      const expr = input as Expression[];
      if (expr[0] == "Equal") {
        result = this._evalMathNodes(
          expr[1],
          expr[2],
          this.opLeft,
          this.opRight
        );
      }
    }

    // only include isolated variables
    result = result.filter((x) => {
      const expr = x as MathJSON[];
      if (expr && !(expr[1] instanceof Array && expr[2] instanceof Array)) {
        return x;
      } else if (
        (expr[1] as Expression[]).length < 3 ||
        (expr[2] as Expression[]).length < 3
      ) {
        return x;
      }
    });

    return result.map((eq) => {
      const expr = eq as MathJSON[];
      // isolate left side
      if (expr && expr[1] instanceof Array) {
        var tmp = expr[1];
        expr[1] = expr[2];
        expr[2] = tmp;
      }
      // make left side never negative
      if (expr && expr[1] instanceof Array && expr[1][0] == "Negate") {
        expr[1] = expr[1][1];
        expr[2] = ["Negate", expr[2] as Expression];
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

  _evalMathNodes(
    left: Expression,
    right: Expression,
    opLeft: string[],
    opRight: string[]
  ): MathJSON[] {
    let result: MathJSON[] = [];

    if (left instanceof Array) {
      switch (opLeft[0]) {
        case "Add": {
          result.push(...this._addOps(right, left));
          opLeft = opLeft.slice(1);
          result.forEach((expr) => {
            const x = expr as MathJSON[];
            if (x[1] instanceof Array && x[2] instanceof Array) {
              const ret = this._evalMathNodes(
                x[1] as Expression,
                x[2] as Expression,
                opLeft,
                opRight
              );
              result.push(...ret);
            }
          });
          break;
        }
        case "Multiply": {
          result.push(...this._mulOps(right, left));
          opLeft = opLeft.slice(1);
          result.forEach((expr) => {
            const x = expr as MathJSON[];
            if (x[1] instanceof Array && x[2] instanceof Array) {
              const ret = this._evalMathNodes(
                x[1] as Expression,
                x[2] as Expression,
                opLeft,
                opRight
              );
              result.push(...ret);
            }
          });
          break;
        }
        default: {
          opLeft = opLeft.slice(1);
        }
      }
    } else {
      result.push(["Equal", left, right]);
    }

    if (right instanceof Array) {
      switch (opRight[0]) {
        case "Add": {
          result.push(...this._addOps(left, right));
          opRight = opRight.slice(1);
          result.forEach((expr) => {
            const x = expr as MathJSON[];
            if (x[1] instanceof Array && x[2] instanceof Array) {
              const ret = this._evalMathNodes(
                x[1] as Expression,
                x[2] as Expression,
                opLeft,
                opRight
              );
              result.push(...ret);
            }
          });
          break;
        }
        case "Multiply": {
          result.push(...this._mulOps(left, right));
          opRight = opRight.slice(1);
          result.forEach((expr) => {
            const x = expr as MathJSON[];
            if (x[1] instanceof Array && x[2] instanceof Array) {
              const ret = this._evalMathNodes(
                x[1] as Expression,
                x[2] as Expression,
                opLeft,
                opRight
              );
              result.push(...ret);
            }
          });
          break;
        }
        default: {
          opRight = opRight.slice(1);
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
    if (!(primary instanceof Array) || primary[0] !== "Add") {
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

  /**
   * Handles mulitplication operations, isolates each component of
   * the multiply operation
   */
  _mulOps(primary: MathJSON, secondary: MathJSON[]): MathJSON[] {
    let result: MathJSON[] = [];

    // Make a singlet like 'x' become an add operation
    // ['Multiply', 'x']
    if (!(primary instanceof Array) || primary[0] !== "Multiply") {
      primary = ["Multiply", primary as Expression];
    }

    // Add the negative of the accompanying addition term, for example
    // a = bc -> a * 1/b = bc * 1/b
    for (let i = 1; i < secondary.length; i++) {
      const negator = secondary.filter((_, index) => {
        return index !== 0 && index !== i;
      });

      result.push([
        "Equal",
        [...primary, ["Divide", 1, ...negator]],
        [...secondary, ["Divide", 1, ...negator]],
      ] as MathJSON);
    }

    // simplify answer to get rid of the double negations
    // a * 1/b = b * c * 1/b -> c = a / b
    return this._simplify(result);
  }
}

export default MathEngine;
