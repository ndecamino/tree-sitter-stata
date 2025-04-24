module.exports = grammar({
  name: 'stata',

  // Specify precedence for conflict resolution
  precedences: $ => [
    ['command', 'macro'],
    ['options', 'qualifier']
  ],
  
  conflicts: $ => [
    [$._command_with_args, $.stata_command],
    [$.varlist, $.macro_reference],
    [$.option, $.options]
  ],

  extras: $ => [
    $.comment,
    /\s/
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.command,
      $.control_flow_structure,
      $.macro_definition,
      $.comment,
      $.empty_statement
    ),

    empty_statement: $ => ';',

    macro_definition: $ => prec.right('macro', seq('$', $.identifier, '=', $.expression)),

    macro_reference: $ => prec('macro', seq('$', $.identifier)),
    
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    
    command: $ => prec.left('command', seq(
      optional(seq('by', $.varlist, ':')),
      $._command_with_args
    )),

    _command_with_args: $ => prec.left(seq(
      $.stata_command,
      optional($.varlist),
      optional(seq('=', $.expression)),
      repeat(choice(
        $.if_qualifier,
        $.in_qualifier,
        $.weight_qualifier,
        $.options_qualifier
      ))
    )),

    if_qualifier: $ => prec('qualifier', seq('if', $.expression)),
    
    in_qualifier: $ => prec('qualifier', seq('in', $.range)),
    
    weight_qualifier: $ => prec('qualifier', seq('weight', $.expression)),
    
    options_qualifier: $ => prec('qualifier', seq(',', prec.left('options', $.options))),

    stata_command: $ => $.identifier,

    varlist: $ => prec.left(repeat1(choice(
      $.identifier,
      $.macro_reference
    ))),
    
    comment: $ => token(choice(
      seq('//', /.*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')
    )),

    control_flow_structure: $ => choice(
      $.if_structure,
      $.for_structure
    ),

    if_structure: $ => seq(
      'if', 
      $.expression, 
      '{', 
      repeat($._statement), 
      '}',
      optional(seq('else', '{', repeat($._statement), '}'))
    ),

    for_structure: $ => seq(
      'forvalues', 
      $.identifier,
      '=',
      $.range,
      '{', 
      repeat($._statement), 
      '}'
    ),

    expression: $ => choice(
      $.identifier,
      $.number,
      $.string,
      $.macro_reference,
      $.binary_expression
    ),

    binary_expression: $ => prec.left(1, seq(
      field('left', $.expression),
      field('operator', choice('>', '<', '>=', '<=', '==', '!=', '+', '-', '*', '/')),
      field('right', $.expression)
    )),

    number: $ => /[0-9]+(\.[0-9]+)?/,
    
    string: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq('\'', /[^\']*/, '\'')
    ),

    range: $ => /\d+\s*(-|\/)\s*\d+/,

    options: $ => prec.left('options', seq(
      $.option,
      repeat(seq(',', $.option))
    )),

    option: $ => choice(
      $.identifier,
      seq($.identifier, '(', $.expression, ')')
    )
  }
});
