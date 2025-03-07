package tree_sitter_stata_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_stata "github.com/ndecamino/tree-sitter-stata/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_stata.Language())
	if language == nil {
		t.Errorf("Error loading Stata grammar")
	}
}
