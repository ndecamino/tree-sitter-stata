/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "stata",

  extras: ($) => [/\s/],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.comment,
        $.command
      ),

    comment: ($) => token(seq("//", /[^\n]*/)),

    command: ($) => prec.right(seq(
      $.identifier,
      repeat($._expression)
    )),

    _expression: ($) =>
      choice(
        $.string,
        $.number
      ),

    string: ($) => /"[^"]*"/,

    number: ($) => /\d+(\.\d+)?/,

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
  },
});
