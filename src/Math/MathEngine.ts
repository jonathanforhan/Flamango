import { ComputeEngine } from "@cortex-js/compute-engine";
import { Expression } from "@cortex-js/compute-engine/dist/types/math-json/math-json-format";

export type MathJSON = Expression | Expression[] | null;

const copy = (x: any) => JSON.parse(JSON.stringify(x));

/**
 * Used to compute all math equations
 */
class MathEngine extends ComputeEngine {
  constructor() {
    super();
    super.jsonSerializationOptions = {
      exclude: ["Square", "Subtract", "Sqrt"],
    };
  }

  /**
   * TODO TESTING DELETE LATER
   */
  TEST_INPUT(input: MathJSON): MathJSON[] {
    console.log(JSON.stringify(input));
    return input ? [super.box(input).latex] : [];
  }

  /**
   * Generates all deduced equations from MathInput
   */
  createEquations(input: MathJSON): MathJSON[] {
    if (!input) return []; // assert(!null)
    else input = input as Expression[];
    if (input[0] !== "Equal") return [];

    let result: MathJSON[] = this._evalNodes(input[1], input[2]);
    result.push(...this._evalNodes(input[2], input[1]));

    // only include isolated variables
    // result = result.filter((expr) => {
    //   const x = expr as Expression[][];
    //   if (
    //     (x && !(x[1] instanceof Array && x[2] instanceof Array)) ||
    //     (x[1].length < 3 && !(x[1][1] instanceof Array)) ||
    //     (x[2].length < 3 && !(x[2][1] instanceof Array))
    //   ) {
    //     return x;
    //   }
    // });

    result = result.map((expr) => {
      const x = expr as Expression[];
      // // isolate left side
      // if (x && x[1] instanceof Array) {
      //   [x[1], x[2]] = [x[2], x[1]]; // E6 swap
      // }
      // // make left side never negative
      // if (x && x[1] instanceof Array && x[1][0] == "Negate") {
      //   x[1] = x[1][1];
      //   x[2] = ["Negate", x[2]];
      // }
      return super.box(x).simplify().latex;
    });

    return result;
  }

  /**
   * Simplilfies equations useful for discarding double negatives
   */
  _simplify(expr: Expression[]) {
    return expr.map((x) => super.box(x).simplify().json);
  }

  /**
   * -a = b -> a = -b
   */
  _flipNegative(alpha: Expression, beta: Expression): Expression[] {
    if (alpha instanceof Array && alpha[0] == "Negate") {
      alpha = alpha[1];
      beta = ["Negate", beta];
    }
    return this._simplify([alpha, beta]);
  }

  /**
   * Evaluate a node of the MathJSON tree
   */
  _evalNodes(alpha: Expression, beta: Expression): Expression[] {
    let result: Expression[] = [];

    const recurse = (expr: Expression) => {
      const x = expr as Expression[];
      if (!(x[1] instanceof Array)) return;
      result.push(...this._evalNodes(x[1], x[2]));
    };

    // Evaluate 'Alpha' side of equation
    if (alpha instanceof Array) {
      let head = alpha[0];

      switch (head) {
        case "Negate":
          [alpha, beta] = this._flipNegative(alpha, beta);
          result.push(...this._evalNodes(alpha, beta));
          break;
        case "Add":
          result.push(...this._addOps(alpha, beta));
          result.forEach(recurse);
          break;
        case "Multiply":
          result.push(...this._mulOps(alpha, beta));
          result.forEach(recurse);
          break;
        case "Divide":
        case "Rational":
          result.push(...this._divOps(alpha, beta));
          result.forEach(recurse);
          break;
        case "Power":
          result.push(...this._powOps(alpha, beta));
          result.forEach(recurse);
          break;
      }
    } else {
      result.push(["Equal", alpha, beta]);
    }

    return result;
  }

  /**
   * Handles add operations, isolates each component of the add operation
   */
  _addOps(alpha: Expression[], beta: Expression): Expression[] {
    let result: Expression[] = [];

    // Make a singlet like 'x' become an add operation
    // ['Add', 'x']
    if (!(beta instanceof Array) || beta[0] !== "Add") {
      beta = ["Add", beta as Expression];
    }

    // Add the negative of the accompanying addition term, for example
    // a = b + c -> a + (-b) = b + c + (-b)
    for (let i = 1; i < alpha.length; i++) {
      let neg = alpha
        .filter((_, index) => index !== 0 && index !== i)
        .map((n) => ["Negate", n]);

      result.push([
        "Equal",
        [...alpha, ...neg],
        [...beta, ...neg],
      ] as Expression);
    }

    // simplify answer to get rid of the double negations
    // a + (-b) = b + c + (-b) -> c = -b + a
    return this._simplify(result);
  }

  /**
   * Handles mulitplication operations, isolates each component of
   * the multiply operation
   */
  _mulOps(alpha: Expression[], beta: Expression): Expression[] {
    let result: Expression[] = [];

    // Make a singlet like 'x' become an mulitplication operation
    // ['Multiply', 'x']
    if (!(beta instanceof Array) || beta[0] !== "Multiply") {
      beta = ["Multiply", beta as Expression];
    }

    // Multiply the inverse of the accompanying multipl term, for example
    // a = bc -> a * 1/b = bc * 1/b
    for (let i = 1; i < alpha.length; i++) {
      let inv = alpha
        .filter((_, index) => index !== 0 && index !== i)
        .map((n) => ["Divide", 1, n]);

      result.push([
        "Equal",
        [...alpha, ...inv],
        [...beta, ...inv],
      ] as Expression);
    }

    // simplify answer to get rid of the double negations
    // a * 1/b = b * c * 1/b -> c = a / b
    return this._simplify(result);
  }

  /**
   * Handles division operations, isolates each component of
   * the division operation
   */
  _divOps(alpha: Expression[], beta: Expression): Expression[] {
    let result: Expression[] = [];

    // numerator & denominator
    const [num, dem] = [alpha[1], alpha[2]];

    // seperate the nmuberator and demoninator into individual equations
    result.push(["Equal", num, ["Multiply", beta, dem]]);
    result.push(["Equal", dem, ["Divide", num, beta]]);

    // simplify answer to get rid of the double negations
    // a * 1/b = b * c * 1/b -> c = a / b
    return this._simplify(result);
  }

  /**
   * Handles power operations
   */
  _powOps(alpha: Expression[], beta: Expression): Expression[] {
    let result: Expression[] = [];

    this._flipNegative(alpha as Expression, beta);

    return this._simplify(result);
  }
}

export default MathEngine;
