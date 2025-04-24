/**
 * @file Stata grammar for tree-sitter
 * @author Nicolas de Camino <ndecamino@uc.cl>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "stata",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
