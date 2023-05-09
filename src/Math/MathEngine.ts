import { BoxedExpression, ComputeEngine } from "@cortex-js/compute-engine";
import { Expression } from "@cortex-js/compute-engine/dist/types/math-json/math-json-format";

export type MathJSON = Expression | Expression[] | null;
export type LaTeX = string;

/**
 * Used to compute all math equations, extends ComputeEngine for parsing
 */
class MathEngine extends ComputeEngine {
  constructor() {
    super();
    super.jsonSerializationOptions = {
      exclude: ["Square", "Subtract", "Sqrt"],
    };
    super.latexOptions.notation = "scientific";
    super.latexOptions.truncationMarker = "";
  }

  /**
   * Formats expression in to the desired LaTeX output for displaying
   *
   * 1. Substitutes in all known values, constants
   * 2. filters out numbers so only variables are shown
   * 3. formats them accordingly based on round and sci
   */
  public format(
    expr: BoxedExpression[],
    constants: {},
    exclude: string[],
    round: number,
    sci: boolean
  ): LaTeX[] {
    return expr
      .map((x) => x.subs(constants).simplify().json)
      .filter((x) => {
        if (exclude.includes((x as Expression[])[1] as string)) return false;
        if (JSON.stringify((x as Expression[])[2]).includes("Error"))
          return false;

        const LHS = super
          .box((x as Expression[])[1])
          .N()
          .valueOf();

        return isNaN(Number(LHS));
      })
      .map((expr) => {
        const x = expr as Expression[];

        expr = [x[0], x[1], super.box(x[2]).N().json];

        this.latexOptions.precision = round + 1;
        sci
          ? (this.latexOptions.avoidExponentsInRange = null)
          : (this.latexOptions.avoidExponentsInRange = [-6, 12]);

        return super.serialize(expr);
      });
  }

  /**
   * Generates all deduced equations from MathInput by traversing the nodes
   * of MathJSON tree, disregards duclicates of a single variable, choosing
   * first instance
   */
  public createEquations(input: MathJSON): BoxedExpression[] {
    input = (input as Expression[]) || null;
    if (!input || input[0] !== "Equal") return [];

    let duplicates: Set<Expression> = new Set();

    let result = new Array()
      .concat(
        this._evalNode(input[1], input[2]),
        this._evalNode(input[2], input[1])
      )
      .filter((x) => (!duplicates.has(x[1]) ? duplicates.add(x[1]) : false));

    return result.map((x) => super.box(x).simplify());
  }

  /**
   * Simplilfies equations used when we do an operation to both sides
   */
  private _simplify(expr: Expression[]): Expression[] {
    return expr.map((x) => super.box(x).simplify().json);
  }

  /**
   * Evaluate a node of the MathJSON tree, we only ever evaluate the 'alpha'
   * side so _evalNode must be called twice, once for each side of equation
   *
   * If _evalNode is called with a scalar alpha it is added to the result
   * bucket, if alpha is a node then it is recursed and the resulting leaves
   * are all appended to the result bucket. _evalNode does not append numbers
   */
  private _evalNode(alpha: Expression, beta: Expression): Expression[] {
    if (!(alpha instanceof Array))
      return isNaN(alpha as number) ? [["Equal", alpha, beta]] : [];

    const recurse = (expr: Expression) => {
      const x = expr as Expression[];
      result.push(...this._evalNode(x[1], x[2]));
    };

    let result: Expression[] = [];
    let operation = alpha[0];

    switch (operation) {
      case "Negate":
        recurse(["Equal", alpha[1], ["Negate", beta]]); // -a = b -> a = -b
        break;
      case "Add":
        this._add(alpha, beta).forEach(recurse);
        break;
      case "Multiply":
        this._mul(alpha, beta).forEach(recurse);
        break;
      case "Divide":
      case "Rational":
        this._div(alpha, beta).forEach(recurse);
        break;
      case "Power":
        this._pow(alpha, beta).forEach(recurse);
        break;
      case "Log":
      case "Lb":
      case "Ln":
        this._log(alpha, beta).forEach(recurse);
        break;
    }

    return result;
  }

  /**
   * Addition handler
   *
   * subtract is not used in this engine so this handles both addition and
   * subtraction by converting subtraction into adding a negative. A negative
   * of each leaf node is added to both sides and appended to result, MathEngine
   * will always isolate each leaf. Ex:
   *
   * a+b+c=x -> [ a=-(b+c)+x , b=-(a+c)+x , c=-(a+b)+x ]
   */
  private _add(alpha: Expression[], beta: Expression): Expression[] {
    let result: Expression[] = [];

    if (!(beta instanceof Array) || beta[0] !== "Add")
      beta = ["Add", beta as Expression];

    for (let i = 1; i < alpha.length; i++) {
      const neg = alpha
        .filter((_, index) => index !== 0 && index !== i)
        .map((n) => ["Negate", n]);

      result.push(["Equal", alpha[i], [...beta, ...neg]] as Expression);
    }

    return this._simplify(result);
  }

  /**
   * Mulitplication handler
   *
   * An inverse of each leaf node will be added to either side, this is then
   * Simplilfied to give accurate result. MathEngine will always isolate each
   * variable in the operation. Ex:
   *
   * a*b*c=x -> [ a=(1/(b*c))*x , b=(1/(a*c))*x , c=(1/(a*b))*x ]
   */
  private _mul(alpha: Expression[], beta: Expression): Expression[] {
    let result: Expression[] = [];

    if (!(beta instanceof Array) || beta[0] !== "Multiply")
      beta = ["Multiply", beta as Expression];

    for (let i = 1; i < alpha.length; i++) {
      const inv = alpha
        .filter((_, index) => index !== 0 && index !== i)
        .map((n) => ["Divide", 1, n]);

      result.push(["Equal", alpha[i], [...beta, ...inv]] as Expression);
    }

    return this._simplify(result);
  }

  /**
   * Division handler
   *
   * Isolates numerator and denominator, then creates two equivalent equations
   * each with the component (numerator or denominator) on either side. Ex:
   *
   * (a+b)/c=x -> [ a+b=x*c , c=(a+b)/x ]
   */
  private _div(alpha: Expression[], beta: Expression): Expression[] {
    const [numerator, denominator] = [alpha[1], alpha[2]];

    const result: Expression[] = [
      ["Equal", numerator, ["Multiply", beta, denominator]],
      ["Equal", denominator, ["Divide", numerator, beta]],
    ];

    return this._simplify(result);
  }

  /**
   * Exponent handler
   *
   * Splits exponential expression into two parts, isolating the base, by
   * taking the inverse power of each side, and then isolating the exponent
   * by taking the log. Ex:
   *
   * a^b=c -> [ a=c^(1/b), b=log_a(c) ]
   */
  private _pow(alpha: Expression[], beta: Expression): Expression[] {
    const [base, exp] = [alpha[1], alpha[2]];

    const result: Expression[] = [
      ["Equal", base, ["Power", beta, ["Divide", 1, exp]]],
      ["Equal", exp, ["Log", beta, base]],
    ];

    return this._simplify(result);
  }

  /**
   * Logarithm handler
   *
   * Like _pow, splits equation into two parts, the base and argument. It then
   * isolates each component producing 2 equivalent equations. Ex:
   *
   * b=log_a(c) -> [ a=c^(1/b), c=a^b ]
   */
  private _log(alpha: Expression[], beta: Expression): Expression[] {
    if (alpha.length === 2) {
      switch (alpha[0]) {
        case "Lb":
          alpha = ["Log", alpha[1], 2];
          break;
        case "Ln":
          alpha = ["Log", alpha[1], "e"];
          break;
        case "Log":
          alpha = ["Log", alpha[1], 10];
          break;
      }
    }

    const [arg, base] = [alpha[1], alpha[2]];

    const result: Expression[] = [
      ["Equal", base, ["Power", arg, ["Rational", 1, beta]]],
      ["Equal", arg, ["Power", base, beta]],
    ];

    return this._simplify(result);
  }
}

export default MathEngine;
