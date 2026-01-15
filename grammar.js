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

    command: ($) => seq($.identifier, optional($.argument_list)),

    argument_list: ($) => repeat1($._expression),

    _expression: ($) =>
      choice(
        $.string,
        $.number,
        $.identifier
      ),

    string: ($) => /"[^"]*"/,

    number: ($) => /\d+(\.\d+)?/,

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
  },
});
