/**
 * @file Stata grammar for tree-sitter
 * @author Nicolás de Camino <nicolasdecamino@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "stata",

  conflicts: ($) => [
    [$.variable_list, $.expression],
    [$.generate_command, $.binary_expression], // Added this line to resolve the conflict
  ],

  precedences: ($) => [["multiplication", "addition", "comparison"]],

  rules: {
    program: ($) => repeat($.statement),

    statement: ($) =>
      choice($.command_statement, $.comment, seq($.statement, ";")),

    command_statement: ($) =>
      choice(
        $.regress_command,
        $.summarize_command,
        $.generate_command,
        $.use_command,
        $.if_statement,
        $.foreach_loop,
      ),

    regress_command: ($) =>
      seq("regress", $.variable_list, optional($.options)),

    summarize_command: ($) =>
      seq("summarize", optional($.variable_list), optional($.options)),

    generate_command: ($) =>
      seq("generate", $.variable_name, "=", $.expression),

    use_command: ($) => seq("use", $.string, optional($.options)),

    if_statement: ($) => seq("if", $.condition, "{", repeat($.statement), "}"),

    foreach_loop: ($) =>
      seq(
        "foreach",
        $.variable_name,
        "in",
        $.list_of_values,
        "{",
        repeat($.statement),
        "}",
      ),

    variable_list: ($) =>
      seq($.variable_name, repeat(seq(optional(/\s+/), $.variable_name))),

    variable_name: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    expression: ($) =>
      choice($.variable_name, $.number, $.string, $.binary_expression),

    binary_expression: ($) =>
      choice(
        prec.left("addition", seq($.expression, "+", $.expression)),
        prec.left("addition", seq($.expression, "-", $.expression)),
        prec.left("multiplication", seq($.expression, "*", $.expression)),
        prec.left("multiplication", seq($.expression, "/", $.expression)),
      ),

    condition: ($) =>
      choice(
        prec.left("comparison", seq($.expression, "==", $.expression)),
        prec.left("comparison", seq($.expression, "!=", $.expression)),
        prec.left("comparison", seq($.expression, "<", $.expression)),
        prec.left("comparison", seq($.expression, ">", $.expression)),
        prec.left("comparison", seq($.expression, "<=", $.expression)),
        prec.left("comparison", seq($.expression, ">=", $.expression)),
      ),

    list_of_values: ($) =>
      choice(
        seq('"', repeat(choice(/[^"\s]+/, /\s+/)), '"'),
        seq($.number, repeat(seq(/\s+/, $.number))),
      ),

    number: ($) => /\d+(\.\d+)?/,

    string: ($) => choice(seq('"', /[^"]*/, '"'), seq("'", /[^']*/, "'")),

    options: ($) =>
      seq(
        ",",
        repeat(seq($.option_name, optional(seq("(", $.option_value, ")")))),
      ),

    option_name: ($) => /[a-zA-Z][a-zA-Z0-9_]*/,

    option_value: ($) => choice($.number, $.string, $.variable_name),

    comment: ($) =>
      choice(seq("*", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
  },
});
