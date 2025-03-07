import XCTest
import SwiftTreeSitter
import TreeSitterStata

final class TreeSitterStataTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_stata())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Stata grammar")
    }
}
