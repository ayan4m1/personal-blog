import { v4 } from 'uuid';

export const evaluateComparison = (a, b, operator) => {
  switch (operator) {
    case '>':
      return a > b;
    case '>=':
      return a >= b;
    case '<':
      return a < b;
    case '<=':
      return a <= b;
  }
};

export const parseExpression = (expression) => {
  const [rawCount, rawSides] = expression.trim().split(/d/i);
  const count = parseInt(rawCount, 10);
  let comparison = null;

  let sideString = rawSides;

  if (/[<>]/.test(rawSides)) {
    const matchResults = /(\d+)/.exec(rawSides);

    sideString = matchResults[1];
  }

  const sides = parseInt(sideString, 10);

  if (isNaN(count) || isNaN(sides)) {
    return null;
  }

  const values = Array(count)
    .fill(0)
    .map(() => Math.ceil(Math.random() * sides));

  if (/[<>]/.test(rawSides)) {
    const [, op, rawVal] = /([<>]+=*)(\d+)/.exec(rawSides);
    const val = parseInt(rawVal, 10);

    comparison = evaluateComparison(
      values.reduce((prev, curr) => prev + curr, 0),
      val,
      op
    );
  }

  return {
    id: v4(),
    expression,
    count,
    sides,
    values,
    comparison
  };
};

export const parseExpressions = (input) => {
  const expressions = input.split(/,/);

  return expressions.map(parseExpression).filter((val) => Boolean(val));
};
