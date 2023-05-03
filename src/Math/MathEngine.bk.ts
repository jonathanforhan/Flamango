import { ComputeEngine } from "@cortex-js/compute-engine";
import { Expression } from "@cortex-js/compute-engine/dist/types/math-json/math-json-format";

export type MathJSON = Expression | Expression[] | null;

/**
 * Used to compute all math equations
 */
class MathEngine extends ComputeEngine {
  // list of operations done in equation, useful for reversing their order
  private _opList: { left: string[]; right: string[] } = {
    left: [],
    right: [],
  };

  constructor() {
    super();
    super.jsonSerializationOptions = {
      exclude: ["Square", "Subtract"],
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

    this._opList = { left: [], right: [] };
    this._concatOpList(input[1], this._opList.left);
    this._concatOpList(input[2], this._opList.right);

    let result: MathJSON[] = this._evalNodes(input[1], input[2]);

    // only include isolated variables
    result = result.filter((expr) => {
      const x = expr as Expression[][];
      if (
        (x && !(x[1] instanceof Array && x[2] instanceof Array)) ||
        (x[1].length < 3 && !(x[1][1] instanceof Array)) ||
        (x[2].length < 3 && !(x[2][1] instanceof Array))
      ) {
        return x;
      }
    });

    return result.map((expr) => {
      const x = expr as Expression[];
      // isolate left side
      if (x && x[1] instanceof Array) {
        [x[1], x[2]] = [x[2], x[1]]; // E6 swap
      }
      // make left side never negative
      if (x && x[1] instanceof Array && x[1][0] == "Negate") {
        x[1] = x[1][1];
        x[2] = ["Negate", x[2]];
      }
      return super.box(x).simplify().latex;
    });
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
    else if (beta instanceof Array && beta[0] == "Negate") {
      beta = beta[1];
      alpha = ["Negate", alpha];
    }

    return this._simplify([alpha, beta]);
  }

  /**
   * Concats operations to operation list
   */
  _concatOpList(input: Expression, opList: string[]) {
    if (!(input instanceof Array)) return;

    opList.push(input[0] as string);
    // Add operations recursively, the non-Arrays will be filtered by guard
    input.forEach((x) => this._concatOpList(x, opList));
  }

  /**
   * Evaluate a node of the MathJSON tree
   */
  _evalNodes(alpha: Expression, beta: Expression): Expression[] {
    let result: Expression[] = [];

    // Recursion call back implimented when side not isolated,
    // calls on eval nodes again to further split node
    const recurse = (expr: Expression) => {
      const x = JSON.parse(JSON.stringify(expr as Expression[]));
      while (x[1] instanceof Array && x[1][0] === "Negate") {
        x[1] = x[1][1];
      }
      while (x[2] instanceof Array && x[2][0] === "Negate") {
        x[2] = x[2][1];
      }
      if (x[1] instanceof Array && x[2] instanceof Array) {
        result.push(...this._evalNodes(
          (expr as Expression[])[1],
          (expr as Expression[])[2]));
      }
    };

    // Evaluate 'Alpha' side of equation
    if (alpha instanceof Array) {
      let op = this._opList.left[0];
      this._opList.left = this._opList.left.slice(1);

      switch (op) {
        case "Negate":
          result.push(["Equal", ...this._flipNegative(alpha, beta)])
          this._evalNodes(beta, alpha)
          break;
        case "Add":
          result.push(...this._addOps(beta, alpha));
          result.forEach(recurse);
          break;
        case "Multiply":
          result.push(...this._mulOps(beta, alpha));
          result.forEach(recurse);
          break;
        case "Divide":
        case "Rational":
          result.push(...this._divOps(beta, alpha));
          result.forEach(recurse);
          break;
      }
    } else {
      result.push(["Equal", alpha, beta]);
    }

    // Evaluate 'Beta' side of equation
    if (beta instanceof Array) {
      let op = this._opList.right[0];
      this._opList.right = this._opList.right.slice(1);

      switch (op) {
        case "Negate":
          result.push(["Equal", ...this._flipNegative(beta, alpha)])
          this._evalNodes(alpha, beta)
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
      }
    } else {
      result.push(["Equal", beta, alpha]);
    }

    return this._simplify(result);
  }

  /**
   * Handles add operations, isolates each component of the add operation
   */
  _addOps(alpha: Expression, beta: Expression[]): Expression[] {
    let result: Expression[] = [];

    // Make a singlet like 'x' become an add operation
    // ['Add', 'x']
    if (!(alpha instanceof Array) || alpha[0] !== "Add") {
      alpha = ["Add", alpha as Expression];
    }

    // Add the negative of the accompanying addition term, for example
    // a = b + c -> a + (-b) = b + c + (-b)
    for (let i = 1; i < beta.length; i++) {
      let neg = beta
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
  _mulOps(alpha: Expression, beta: Expression[]): Expression[] {
    let result: Expression[] = [];

    // flip the negative on the one being mulitplied
    if (beta[0] === "Negate") {
      beta = beta[1] as Expression[];
      alpha = ["Negate", alpha];
    }

    // Make a singlet like 'x' become an mulitplication operation
    // ['Multiply', 'x']
    if (!(alpha instanceof Array) || alpha[0] !== "Multiply") {
      alpha = ["Multiply", alpha as Expression];
    }

    // Multiply the inverse of the accompanying multipl term, for example
    // a = bc -> a * 1/b = bc * 1/b
    for (let i = 1; i < beta.length; i++) {
      let inv = beta
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
  _divOps(alpha: Expression, beta: Expression[]): Expression[] {
    let result: Expression[] = [];

    // flip the negative on the one being mulitplied
    if (beta[0] === "Negate") {
      beta = beta[1] as Expression[];
      alpha = ["Negate", alpha];
    }

    // denominator
    const dem = beta[2]

    // convert the division to an equivolent multiplication problem
    const eqv = [
      "Equal",
      ["Multiply", alpha, dem],
      ["Multiply", beta, dem],
    ] as Expression[];

    result.push(...this._mulOps(eqv[2], eqv[1] as Expression[]))

    // simplify answer to get rid of the double negations
    // a * 1/b = b * c * 1/b -> c = a / b
    return this._simplify(result);
  }
}

export default MathEngine;
