import React from 'react';
import ReactDOM from 'react-dom';

const parser = function () {
  "use strict";

  function peg$subclass(child, parent) {
    function ctor() {
      this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message = message;
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function (expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
      literal: function (expectation) {
        return "\"" + literalEscape(expectation.text) + "\"";
      },

      "class": function (expectation) {
        var escapedParts = "",
            i;

        for (i = 0; i < expectation.parts.length; i++) {
          escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
        }

        return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
      },

      any: function (expectation) {
        return "any character";
      },

      end: function (expectation) {
        return "end of input";
      },

      other: function (expectation) {
        return expectation.description;
      }
    };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
        return '\\x0' + hex(ch);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
        return '\\x' + hex(ch);
      });
    }

    function classEscape(s) {
      return s.replace(/\\/g, '\\\\').replace(/\]/g, '\\]').replace(/\^/g, '\\^').replace(/-/g, '\\-').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
        return '\\x0' + hex(ch);
      }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
        return '\\x' + hex(ch);
      });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i,
          j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},
        peg$startRuleFunctions = { Query: peg$parseQuery },
        peg$startRuleFunction = peg$parseQuery,
        peg$c0 = function (head, tail) {
          return tail.reduce(function (r, e) {
            return {
              'l': r,
              'r': e[1],
              'op': e[0]
            };
          }, head);
        },
        peg$c1 = "[empty]",
        peg$c2 = peg$literalExpectation("[empty]", false),
        peg$c3 = "[nonempty]",
        peg$c4 = peg$literalExpectation("[nonempty]", false),
        peg$c5 = function (col, check) {
          return {
            'col': col,
            'check': check
          };
        },
        peg$c6 = function (col1, act, col2) {
          return {
            'col1': col1,
            'act': act,
            'col2': col2
          };
        },
        peg$c7 = function (col, act, exp) {
          return {
            'col': col,
            'act': act,
            'exp': exp
          };
        },
        peg$c8 = "&&",
        peg$c9 = peg$literalExpectation("&&", false),
        peg$c10 = "||",
        peg$c11 = peg$literalExpectation("||", false),
        peg$c12 = "<=",
        peg$c13 = peg$literalExpectation("<=", false),
        peg$c14 = "<",
        peg$c15 = peg$literalExpectation("<", false),
        peg$c16 = ">=",
        peg$c17 = peg$literalExpectation(">=", false),
        peg$c18 = ">",
        peg$c19 = peg$literalExpectation(">", false),
        peg$c20 = "=",
        peg$c21 = peg$literalExpectation("=", false),
        peg$c22 = "*",
        peg$c23 = peg$literalExpectation("*", false),
        peg$c24 = "!",
        peg$c25 = peg$literalExpectation("!", false),
        peg$c26 = "}",
        peg$c27 = peg$literalExpectation("}", false),
        peg$c28 = "{",
        peg$c29 = peg$literalExpectation("{", false),
        peg$c30 = function (items) {
          return items[1];
        },
        peg$c31 = function (chars) {
          return chars.join("");
        },
        peg$c32 = /^[a-zA-Z0-9<>.[\]@#$%\^-_+ ]/,
        peg$c33 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "<", ">", ".", "[", "]", "@", "#", "$", "%", ["^", "_"], "+", " "], false, false),
        peg$c34 = /^[ \t\n\r]/,
        peg$c35 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),
        peg$c36 = "\"",
        peg$c37 = peg$literalExpectation("\"", false),
        peg$currPos = 0,
        peg$savedPos = 0,
        peg$posDetailsCache = [{ line: 1, column: 1 }],
        peg$maxFailPos = 0,
        peg$maxFailExpected = [],
        peg$silentFails = 0,
        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

      throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
    }

    function error(message, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);

      throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return {
        type: "class",
        parts: parts,
        inverted: inverted,
        ignoreCase: ignoreCase
      };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line: details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line: startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line: endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) {
        return;
      }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
      return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
    }

    function peg$parseQuery() {
      var s0;

      s0 = peg$parseExpression();
      if (s0 === peg$FAILED) {
        s0 = peg$parseTerm();
      }

      return s0;
    }

    function peg$parseExpression() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parseTerm();
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$currPos;
          s5 = peg$parseLogicAction();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseTerm();
            if (s6 !== peg$FAILED) {
              s5 = [s5, s6];
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$currPos;
              s5 = peg$parseLogicAction();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseTerm();
                if (s6 !== peg$FAILED) {
                  s5 = [s5, s6];
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c0(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseTerm() {
      var s0;

      s0 = peg$parseNonParametrizedTerm();
      if (s0 === peg$FAILED) {
        s0 = peg$parseInterColumnTerm();
        if (s0 === peg$FAILED) {
          s0 = peg$parseSimpleTerm();
        }
      }

      return s0;
    }

    function peg$parseNonParametrizedTerm() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseColumn();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.substr(peg$currPos, 7) === peg$c1) {
              s4 = peg$c1;
              peg$currPos += 7;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c2);
              }
            }
            if (s4 === peg$FAILED) {
              if (input.substr(peg$currPos, 10) === peg$c3) {
                s4 = peg$c3;
                peg$currPos += 10;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c4);
                }
              }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c5(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseInterColumnTerm() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseColumn();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSearchAction();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseColumn();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c6(s2, s4, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseSimpleTerm() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseColumn();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseSearchAction();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseWord();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c7(s2, s4, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLogicAction() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c8) {
        s0 = peg$c8;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c9);
        }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c10) {
          s0 = peg$c10;
          peg$currPos += 2;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c11);
          }
        }
      }

      return s0;
    }

    function peg$parseSearchAction() {
      var s0;

      if (input.substr(peg$currPos, 2) === peg$c12) {
        s0 = peg$c12;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c13);
        }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 60) {
          s0 = peg$c14;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c15);
          }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c16) {
            s0 = peg$c16;
            peg$currPos += 2;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c17);
            }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 62) {
              s0 = peg$c18;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c19);
              }
            }
            if (s0 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s0 = peg$c20;
                peg$currPos++;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c21);
                }
              }
              if (s0 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 42) {
                  s0 = peg$c22;
                  peg$currPos++;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c23);
                  }
                }
                if (s0 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 33) {
                    s0 = peg$c24;
                    peg$currPos++;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c25);
                    }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s0 = peg$c26;
                      peg$currPos++;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c27);
                      }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 123) {
                        s0 = peg$c28;
                        peg$currPos++;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c29);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parseColumn() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseQuote();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseWord();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseQuote();
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c30(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseWord() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseLetters();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseLetters();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c31(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseLetters() {
      var s0;

      if (peg$c32.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c33);
        }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      if (peg$c34.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c35);
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c34.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c35);
          }
        }
      }

      return s0;
    }

    function peg$parseQuote() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 34) {
        s0 = peg$c36;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c37);
        }
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse: peg$parse
  };
}();

class Column {
  constructor(name) {
    this.inFilterExpression = false;
    this.name = name;
    this.visibility = true;
  }

  setVisibility(visibility) {
    this.visibility = visibility;
  }

  setInFilterExpression(flag) {
    this.inFilterExpression = flag;
  }

}

class Filter {

  /**
   * @param availableColumns {Array.<Column>}
   * @param parseWasOk {function(string)}
   * @param lastFilterQuery {string}
   */
  constructor(availableColumns, parseWasOk, lastFilterQuery) {

    this.__parseWasOk = parseWasOk;

    this.__availableColumns = availableColumns;

    this.__lastSuccessfullExpression = '';

    /**
     * @type {Object<string,function(string, string): Boolean>}
     */
    this.__LOGIC_SYNTAX = {
      //Intersection
      '&&': (lRows = [], rRows = []) => lRows.filter(n => rRows.indexOf(n) !== -1),
      //Concatenation with deduplicate;
      '||': (lRows = [], rRows = []) => [...new Set(lRows.concat(rRows)).values()]
    };

    /**
     * @type {Object<string,function(string, string): Boolean>}
     */
    this.__CHECK_SYNTAX = {
      '[empty]': value => value == '',
      '[nonempty]': value => value != ''
    };

    /**
     * @type {Object<string,function(string, string): Boolean>}
     */
    this.__SEARCH_SYNTAX = {
      '<': (value, expectation) => {
        return parseFloat(value) < parseFloat(expectation);
      },
      '<=': (value, expectation) => {
        return parseFloat(value) <= parseFloat(expectation);
      },
      '>': (value, expectation) => {
        return parseFloat(value) > parseFloat(expectation);
      },
      '>=': (value, expectation) => {
        return parseFloat(value) >= parseFloat(expectation);
      },
      '=': (value, expectation) => {
        return value == expectation;
      },
      '*': (value, expectation) => {
        if (typeof value === 'string') {
          return value.indexOf(expectation) !== -1;
        } else {
          return value.toString().indexOf(expectation) !== -1;
        }
      },
      '!': (value, expectation) => {
        if (typeof value === 'string') {
          return value.indexOf(expectation) === -1;
        } else {
          return value.toString().indexOf(expectation) === -1;
        }
      },
      '{': (value, expectation) => {
        if (typeof value === 'string') {
          return value.startsWith(expectation);
        } else {
          return value.toString().startsWith(expectation);
        }
      },
      '}': (value, expectation) => {
        if (typeof value === 'string') {
          return value.endsWith(expectation);
        } else {
          return value.toString().endsWith(expectation);
        }
      }
    };

    this.__parsedExpression = undefined;

    this.lastError = '';

    this.expression = "";
    this.setExpression(lastFilterQuery);
  }

  setExpression(expression) {
    this.expression = expression;
    this.__parseExpression(expression.trim());
  }

  __parseExpression(expression) {
    this.lastError = '';
    let lastExpression = copyObject(this.__parsedExpression);
    if (expression.length > 0) {
      try {
        this.__parsedExpression = parser.parse(expression);
      } catch (e) {
        this.lastError = e.message;
      }
    } else {
      this.__parsedExpression = undefined;
    }

    if (JSON.stringify(copyObject(this.__parsedExpression)) !== JSON.stringify(lastExpression)) {
      this.__lastSuccessfullExpression = expression;
      this.__parseWasOk(this.__lastSuccessfullExpression);
      this.__markColumns(expression);
    }
  }

  static __isTermValid(term) {
    return term['col'] && term['act'] && term['exp'];
  }

  static __isInterColumnTermValid(term) {
    return term['col1'] && term['col2'] && term['act'];
  }

  static __isNonArgumentedTermValid(term) {
    return term['col'] && term['check'];
  }

  static __isExpressionValid(expression) {
    return expression['l'] && expression['r'] && expression['op'];
  }

  __reduceTerm(rows, term) {
    let { col: columnName, act: action, exp: expectation } = term;
    return rows.filter(row => {
      let value = row.getValueByColumnName(columnName);
      let valueAsFloat = parseFloat(value);
      let expectationAsFloat = parseFloat(expectation);
      if (value) {
        return this.__SEARCH_SYNTAX[action](value.toString(), expectation.toString().trim());
      }
      return false;
    });
  }

  __reduceInterColumnTerm(rows, term) {
    let { col1: firstColumnName, col2: secondColumnName, act: action } = term;
    return rows.filter(row => {
      let firstValue = row.getValueByColumnName(firstColumnName);
      let secondValue = row.getValueByColumnName(secondColumnName);
      if (firstValue && secondValue) {
        return this.__SEARCH_SYNTAX[action](firstValue.toString(), secondValue.toString());
      }
      return false;
    });
  }

  __reduceNonArgumentedTerm(rows, term) {
    let { col: columnName, check } = term;
    return rows.filter(row => {
      let value = row.getValueByColumnName(columnName);
      return this.__CHECK_SYNTAX[check](value.toString());
    });
  }

  __reduceExpression(expression) {
    let { l: left, r: right, op: operation } = expression;
    let a = this.__LOGIC_SYNTAX[operation](left, right);
    return a;
  }

  __reduceTree(rows, tree) {
    if (Filter.__isExpressionValid(tree)) {
      tree['l'] = this.__reduceTree(rows, tree['l']);
      tree['r'] = this.__reduceTree(rows, tree['r']);
      return this.__reduceExpression(tree);
    }
    if (Filter.__isTermValid(tree)) {
      return this.__reduceTerm(rows, tree);
    }
    if (Filter.__isInterColumnTermValid(tree)) {
      return this.__reduceInterColumnTerm(rows, tree);
    }
    if (Filter.__isNonArgumentedTermValid(tree)) {
      return this.__reduceNonArgumentedTerm(rows, tree);
    }
  }

  filterRow(rows) {
    if (this.__parsedExpression) {
      return this.__reduceTree(rows, copyObject(this.__parsedExpression));
    } else {
      return rows;
    }
  }

  __markColumns(expression) {
    this.__availableColumns.forEach(column => {
      if (expression.indexOf(column.name) !== -1) {
        column.setInFilterExpression(true);
      } else {
        column.setInFilterExpression(false);
      }
    });
  }
}

export const reduceAstToState = ast => {
  if (Filter.__isExpressionValid(ast)) {
    ast['l'] = reduceAstToState(ast['l']);
    ast['r'] = reduceAstToState(ast['r']);
    return __reduceExpression(ast);
  }
  if (Filter.__isTermValid(ast)) {
    return __reduceTerm(ast);
  }
  if (Filter.__isInterColumnTermValid(ast)) {
    return __reduceInterColumnTerm(ast);
  }
  if (Filter.__isNonArgumentedTermValid(ast)) {
    return __reduceNonArgumentedTerm(ast);
  }
};

const __reduceExpression = ast => {
  return {
    items: [...ast.l.items, ast.op, ...ast.r.items],
    steps: [...ast.l.steps, step.LOGIC, ...ast.r.steps]
  };
};

const __reduceTerm = ast => {
  return {
    items: ['"' + ast.col + '"', ast.act, ast.exp],
    steps: [step.COLUMN, step.ACTION, step.VALUE]
  };
};

const __reduceInterColumnTerm = ast => {
  return {
    items: ['"' + ast.col1 + '"', ast.act, '"' + ast.col2 + '"'],
    steps: [step.COLUMN, step.ACTION, step.VALUE]
  };
};

const __reduceNonArgumentedTerm = ast => {
  return {
    items: ['"' + ast.col + '"', ast.check],
    steps: [step.COLUMN, step.ACTION]
  };
};

class Row {
  /**
   * @param key {String}
   * @param columns {Array.<Column>}
   * @param values {Array.<String>}
   */
  constructor(key, columns, values) {

    /**
     * @type {Array.<Column>}
     */
    this.columns = columns;

    /**
     * @type {{String, String}}
     */
    this.values = {};

    /**
     * @type {String}
     */
    this.key = key;

    columns.forEach(column => {
      this.values[column.name] = values[column.name];
    });
  }

  updateValue(columnName, newValue) {
    this.values[columnName] = newValue;
  }

  /**
   * @param column {Column}
   * @returns String
   */
  getValue(column) {
    return this.getValueByColumnName(column.name);
  }

  /**
   * @param columnName {String}
   * @returns String
   */
  getValueByColumnName(columnName) {
    return this.values[columnName];
  }
}

class Table {
  constructor(columnNames, rows, exportLastFilterQuery, filterQueryForBootstrap, pageSize) {
    /**
     * @type {{String, Row}}
     */
    this.rows = {};

    this.initialColumnOrder = [];
    /**
     * @type {Array<Column>}
     */
    this.columns = [];

    columnNames.forEach(columnName => {
      this.columns.push(new Column(columnName));
    });

    this.initialColumnOrder = this.columns.slice();

    rows.forEach(row => {
      let rowClass = new Row(row.key, this.columns, row);
      this.rows[rowClass.key] = rowClass;
    });

    this.ordering = {
      'column': null,
      'order': true
    };

    this.pageSize = pageSize;

    this.currentPage = 1;

    this.filter = new Filter(this.columns, exportLastFilterQuery, filterQueryForBootstrap);
  }

  getMaxPage() {
    return Math.ceil(Object.keys(this.exportFilteredRows(this.getRowsArray())).length / this.pageSize);
  }

  setPageSize(pageSize) {
    this.pageSize = pageSize;
    return this;
  }

  resetColumnOrdering() {
    while (this.columns.pop() != undefined) {
      this.columns.pop();
    }

    this.initialColumnOrder.forEach((column, idx) => {
      this.columns[idx] = column;
    });
    return this;
  }

  reorderColumn(side, columnName) {

    for (let idx = 0; idx < this.columns.length; idx++) {
      if (this.columns[idx].name === columnName) {
        if (side === moveSide.RIGHT) {
          for (let visibleIdx = 1; visibleIdx + idx < this.columns.length; visibleIdx++) {
            if (this.columns[idx + visibleIdx].visibility) {
              const buff = this.columns[idx + visibleIdx];
              this.columns[idx + visibleIdx] = this.columns[idx];
              this.columns[idx] = buff;

              break;
            }
          }
          break;
        } else if (side === moveSide.LEFT) {
          for (let visibleIdx = 1; idx - visibleIdx >= 0; visibleIdx++) {
            if (this.columns[idx - visibleIdx].visibility) {
              const buff = this.columns[idx - visibleIdx];
              this.columns[idx - visibleIdx] = this.columns[idx];
              this.columns[idx] = buff;
              break;
            }
          }
          break;
        }
      }
    }

    return this;
  }

  setCurrentPage(pageNum) {
    this.currentPage = pageNum;
    return this;
  }

  /**
   * @param rowsUpdate Array<{{String, String}}>
   */
  updateRows(rowsUpdate) {
    rowsUpdate.forEach(rowUpdate => {
      if (this.rows[rowUpdate.key]) {
        this.columns.forEach(column => {
          if (rowUpdate[column.name]) {
            this.rows[rowUpdate.key].updateValue(column.name, rowUpdate[column.name]);
          }
        });
      } else {
        let newRow = new Row(rowUpdate.key, this.columns, rowUpdate);
        this.rows[newRow.key] = newRow;
      }
    });
    return this;
  }

  setColumnVisibility(columnName, visibility) {
    this.columns.forEach(column => {
      if (column.name == columnName) {
        column.setVisibility(visibility);
      }
    });
    return this;
  }

  exportOrderedRows(rows) {
    if (this.ordering.column) {
      return rows.sort((rowA, rowB) => {
        let valueA = rowA.getValueByColumnName(this.ordering.column);
        let valueB = rowB.getValueByColumnName(this.ordering.column);

        if (this.ordering.order) {
          if (valueA < valueB) {
            return -1;
          } else if (valueA > valueB) {
            return 1;
          } else {
            return 0;
          }
        } else {
          if (valueA > valueB) {
            return -1;
          } else if (valueA < valueB) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    } else {
      return rows;
    }
  }

  exportFilteredRows(rows) {
    return this.filter.filterRow(rows);
  }

  getRowsArray() {
    return Object.keys(this.rows).map(rowKey => this.rows[rowKey]);
  }

  /**
   * @returns Array.<Row>
   */
  exportRows() {
    let orderedRows = this.exportOrderedRows(this.exportFilteredRows(this.getRowsArray()));

    return orderedRows.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  setOrdering(columnName, order) {
    this.ordering.column = columnName;
    this.ordering.order = order;
    return this;
  }

  setFilterExpression(expression) {
    this.setCurrentPage(1);
    this.filter.setExpression(expression);
    return this;
  }

  static empty() {
    return new Table([], [], expression => expression, "");
  }

  getFilterExpression() {
    return this.filter.expression;
  }

  getFilterError() {
    return this.filter.lastError;
  }

}

const copyObject = obj => {
  if (obj) {
    return JSON.parse(JSON.stringify(obj));
  }
};

const DEFAULT_LEFT = '8px';

class ColumnResizerView extends React.Component {
  constructor(props) {
    super(props);

    this.defaultStyle = {
      width: '16px',
      height: '11px',
      cursor: 'col-resize',
      border: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      display: 'flex',
      position: 'relative',
      left: DEFAULT_LEFT,
      zIndex: '1'
    };

    this.imgStyle = {
      position: 'relative',
      top: '-9px',
      left: '-4px'
    };
  }

  componentWillMount() {
    this.setState({ 'drag': false });
  }

  updateState(drag, xPosition) {
    this.setState({ drag, xPosition });
  }

  setXPosition(xPosition) {
    this.setState({ xPosition });
  }

  generateStyles() {
    if (this.state.drag) {
      this.defaultStyle['position'] = 'fixed';
      this.defaultStyle['left'] = this.state.xPosition;
    } else {
      this.defaultStyle['position'] = 'relative';
      this.defaultStyle['left'] = DEFAULT_LEFT;
    }

    return Object.assign({}, this.defaultStyle);
  }

  render() {

    let { handleWidthChange } = this.props;
    return React.createElement('th', {
      style: this.generateStyles(),
      onDragStart: e => {
        this.updateState(true, e.clientX - 14);
      },
      onDragEnd: e => {
        this.updateState(false, e.clientX - 14);
      },
      onDrag: e => {
        if (this.state.drag && e.clientX !== 0) {
          this.setXPosition(e.clientX);
          handleWidthChange(e.clientX, this.state.xPosition);
        }
      } }, React.createElement('img', { style: this.imgStyle, width: '25', height: '12', title: '', alt: '',
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAMCAYAAACX8hZLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AsYDjAk0TYAawAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAT0lEQVQ4y7XUSwoAIAhFUe/+F12DIIIIfz0HkTo4BSK2Ypgu4EgUEPsQQVyXzxDP5BOEW2hChItFiHQjCVFuBiFaLwhAWPebDoRwS+SnbgKAYwwLsTvjuQAAAABJRU5ErkJggg==' }));
  }
}

class ColumnsVisibility extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let { onChange, columns } = this.props;

    return React.createElement('div', { className: 'form-group col-sm-12 col-md-12 col-lg-12 col-xs-12' }, React.createElement('label', { className: 'control-label' }, 'Hide columns'), React.createElement('br', null), columns.map(column => {
      return React.createElement('label', { className: 'checkbox-inline', key: column.name }, React.createElement('input', { type: 'checkbox',
        value: '',
        onChange: evt => {
          onChange(column.name, !evt.target.checked);
        } }), column.name);
    }));
  }
}

export const moveSide = {
  RIGHT: 'right',
  LEFT: 'left'
};
class ColumnView extends React.Component {
  constructor(props) {
    super(props);
  }

  orderingIconClass(columnName, orderingColumnName) {
    if (orderingColumnName !== columnName) {
      return "glyphicon glyphicon-sort";
    } else if (orderingColumnName === columnName && this.props.order) {
      return "glyphicon glyphicon-sort-by-attributes";
    } else if (orderingColumnName === columnName && !this.props.order) {
      return "glyphicon glyphicon-sort-by-attributes-alt";
    } else {
      return "glyphicon glyphicon-sort";
    }
  }

  render() {
    let {
        column,
        orderedByColumn,
        columnOrderingHandler,
        notLast,
        width,
        first,
        last,
        columnMoveHandler
    } = this.props;

    const style = {};
    if (notLast) {
      style['borderRight'] = '0px';
    } else {
      style['borderRight'] = undefined;
    }
    if (width) {
      style['width'] = width + 'px';
    }
    return React.createElement('th', { key: column.name, style: style, className: column.inFilterExpression ? "active" : "" }, !first ? React.createElement('span', { className: 'glyphicon glyphicon-arrow-left',
      onClick: () => columnMoveHandler(moveSide.LEFT, column.name) }) : null, '\xA0', React.createElement('span', { className: this.orderingIconClass(column.name, orderedByColumn),
      onClick: () => columnOrderingHandler(column.name) }), '\xA0', column.name, ' ', !last && notLast ? React.createElement('span', { style: {
      float: 'right',
      marginRight: '-15px',
      marginTop: '1px'
    }, className: 'glyphicon glyphicon-arrow-right',
      onClick: () => columnMoveHandler(moveSide.RIGHT, column.name) }) : null);
  }
}

class FilterView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { table, filterHandler, columnsVisibilityHandler, resetOrdering, resetColumnOrdering } = this.props;
    return React.createElement('div', { className: 'panel-group', id: 'table-filtering-accordion',
      role: 'tablist', 'aria-multiselectable': 'true' }, React.createElement('div', { className: 'panel panel-default' }, React.createElement('div', { className: 'panel-heading', role: 'tab', id: 'headingFiltering' }, React.createElement('a', { className: 'collapsed', role: 'button', 'data-toggle': 'collapse',
      'data-parent': '#accordion', href: '#collapseFiltering',
      'aria-expanded': 'false', 'aria-controls': 'collapseFiltering' }, React.createElement('h4', { className: 'panel-title' }, 'Table Filtering'))), React.createElement('div', { id: 'collapseFiltering', className: 'panel-collapse collapse',
      role: 'tabpanel', 'aria-labelledby': 'headingFiltering' }, React.createElement('div', { className: 'panel-body' }, React.createElement(QueryInput, { table: table,
      onChange: filterHandler,
      query: table.getFilterExpression(),
      error: table.getFilterError() }), React.createElement(ColumnsVisibility, { columns: table.columns,
      onChange: columnsVisibilityHandler }), React.createElement('div', {
      className: 'form-group col-sm-12 col-md-12 col-lg-12 col-xs-12' }, React.createElement('label', { className: 'control-label' }, 'Reset'), React.createElement('br', null), React.createElement('div', { className: 'row' }, React.createElement('div', { className: 'col-sm-1 col-md-1 col-lg-1 col-xs-1' }, React.createElement('button', { type: 'button', className: 'btn btn-danger',
      onClick: resetOrdering }, 'Ordering by value')), React.createElement('div', { className: 'col-sm-1 col-md-1 col-lg-1 col-xs-1' }), React.createElement('div', { className: 'col-sm-1 col-md-1 col-lg-1 col-xs-1' }, React.createElement('button', { type: 'button', className: 'btn btn-danger',
      onClick: resetColumnOrdering }, 'Column position'))))))));
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  setOrdering(columnName, order) {
    this.setState({
      columnName: columnName,
      order: order
    });
  }

  toggleOrdering(columnName) {
    let order = true;
    if (this.state.columnName !== columnName) {
      this.setOrdering(columnName, true);
    } else {
      order = !this.state.order;
      this.setOrdering(columnName, order);
    }
    return order;
  }

  handleWidthChange(currentX, initialX, leftColumn, rightColumn) {

    const diff = initialX - currentX;

    const newState = Object.assign({}, this.state.columnsWidth);

    const leftKey = `columnsWidth.${ leftColumn }`;
    const rightKey = `columnsWidth.${ rightColumn }`;

    newState[rightColumn] = newState[rightColumn] + diff > 0 ? newState[rightColumn] + diff : 0;
    newState[leftColumn] = newState[leftColumn] - diff > 0 ? newState[leftColumn] - diff : 0;

    this.setState({ columnsWidth: newState });
  }

  updateWidth() {
    this.setState({
      elWidth: ReactDOM.findDOMNode(this).getBoundingClientRect().width
    });
  }

  recalculateWidth() {
    const columns = this.props.columns;
    const currentSizes = this.state.columnsWidth;
    const width = ReactDOM.findDOMNode(this).getBoundingClientRect().width;

    const state = {};
    let initialState = 0;

    const multipliers = {};

    columns.forEach(column => {
      if (initialState) {
        multipliers[column.name] = currentSizes[column.name] / initialState;
      } else {
        initialState = currentSizes[column.name];
        multipliers[column.name] = 1;
      }
    });

    const multipliersSum = Object.keys(multipliers).reduce((a, b) => a + multipliers[b], 0);

    const columnWidth = Math.floor(width / multipliersSum);

    columns.forEach(column => {
      state[column.name] = multipliers[column.name] * columnWidth;
    });

    this.setState({ columnsWidth: state });
  }

  populateColumns(columns, silent) {
    const width = ReactDOM.findDOMNode(this).getBoundingClientRect().width;
    const columnWidth = Math.floor(width / columns.length);

    const state = {};

    columns.forEach(column => {
      state[column.name] = columnWidth;
    });

    if (!silent) {
      this.setState({ columnsWidth: state });
    }
    return state;
  }

  initState() {
    this.setState({
      columnName: null,
      order: null,
      columnsWidth: {}
    });
  }

  componentDidMount() {
    this.updateWidth();
    this.populateColumns(this.props.columns);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.recalculateWidth());
  }

  componentWillMount() {
    this.initState();
    window.addEventListener("resize", () => this.recalculateWidth());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visibleColumns.length !== this.props.visibleColumns.length) {
      this.populateColumns(nextProps.visibleColumns);
    }
  }

  render() {

    let { columns, columnOrderingHandler, orderingColumn, columnMoveHandler } = this.props;
    let { columnsWidth } = this.state;

    return React.createElement('thead', null, React.createElement('tr', null, columns.filter(column => column.visibility).map((column, idx, collection) => {

      const notLast = idx < collection.length - 1;
      const last = idx === collection.length;
      const first = idx === 0;

      let result = [React.createElement(ColumnView, {
        column: column,
        orderedByColumn: orderingColumn,
        notLast: notLast,
        last: last,
        first: first,
        width: columnsWidth[column.name],
        order: this.state.order,
        columnMoveHandler: columnMoveHandler,
        columnOrderingHandler: columnName => columnOrderingHandler(columnName, this.toggleOrdering(columnName)) })];

      if (notLast) {
        result.push(React.createElement(ColumnResizerView, {
          handleWidthChange: (curX, initX) => this.handleWidthChange(curX, initX, column.name, collection[idx + 1].name)
        }));
      }

      return result;
    })));
  }
}

class PaginationView extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPageCounter(table, handlePageSet) {
    let pages = [];
    for (let counter = 1; counter < table.getMaxPage() + 1; counter++) {
      pages.push(React.createElement('li', { key: counter, className: counter === table.currentPage ? 'active' : '' }, React.createElement('a', { onClick: () => handlePageSet(counter) }, counter, React.createElement('span', { className: 'sr-only' }))));
    }
    return pages;
  }

  static makeClassLine(classes, showSelect) {
    if (showSelect) {
      return classes;
    } else {
      return classes + " hidden";
    }
  }

  render() {
    let {
        table,
        handlePageSet,
        setPageSize,
        showSelect
    } = this.props;
    return React.createElement('div', { className: 'row' }, React.createElement('div', {
      className: PaginationView.makeClassLine("col-sm-2 col-md-2 col-lg-2 col-xs-2", showSelect) }, React.createElement('div', { className: 'form-group' }, React.createElement('label', { htmlFor: 'table-page-size-selec' }, 'Page size:'), React.createElement('select', {
      className: 'form-control',
      id: 'table-page-size-select',
      value: table.pageSize,
      onChange: evt => {
        setPageSize(evt.target.value);
      } }, React.createElement('option', { value: '10' }, '10'), React.createElement('option', { value: '25' }, '25'), React.createElement('option', { value: '50' }, '50'), React.createElement('option', { value: '100' }, '100')))), React.createElement('div', { className: 'col-sm-10 col-md-10 col-lg-10 col-xs-10' }, React.createElement('nav', { 'aria-label': '...', style: { paddingTop: '5px' } }, React.createElement('ul', { className: 'pagination' }, React.createElement('li', { className: table.currentPage === 1 ? 'disabled' : '' }, React.createElement('a', { 'aria-label': 'Previous', onClick: () => handlePageSet(1) }, React.createElement('span', { 'aria-hidden': 'true' }, '\xAB'))), this.renderPageCounter(table, handlePageSet), React.createElement('li', { className: table.currentPage < table.getMaxPage() ? '' : 'disabled' }, React.createElement('a', { 'aria-label': 'Next',
      onClick: () => handlePageSet(table.getMaxPage()) }, React.createElement('span', { 'aria-hidden': 'true' }, '\xBB')))))));
  }
}

const selectedTab = {
  SIMPLE: 'simple-query',
  RAW: 'raw-query'
};

class QueryInput extends React.Component {
  constructor(props) {
    super(props);
  }

  updateState(item) {
    let { items, steps } = this.state.query;
    let newItems = items.slice();
    let newSteps = steps.slice();
    newSteps.push(this.state.step);
    newItems.push(item);
    let newValue = newItems.join(' ');
    this.setState({ query: { value: newValue, items: newItems, steps: newSteps } });
    return newValue;
  }

  rewindStep(exportQuery) {
    let { items, steps } = this.state.query;
    if (steps.length > 0) {
      let newSteps = steps.slice();
      let newCurrentStep = newSteps.pop();
      let newItems = items.slice(0, items.length - 1);
      let newValue = newItems.join(' ');
      this.setState({
        step: steps[steps.length - 1],
        query: { value: newValue, items: newItems, steps: newSteps }
      });
      exportQuery(newValue);
    }
  }

  gotoStep(step) {
    this.setState({ step });
  }

  static addErrorClass(base, error) {
    let classes = base;
    if (error) {
      classes = classes + ' has-error';
    } else {
      classes = classes + ' has-success';
    }
    return classes;
  }

  changeTab(tab) {
    if (tab === selectedTab.RAW) {
      this.props.onChange(this.state.query.value);
    }
    this.setState({ tab });
  }

  componentWillMount() {
    let { query, step } = queryToState(this.props.query);
    this.setState({
      tab: selectedTab.SIMPLE,
      query,
      step
    });
  }

  handleRawQueryUpdate(queryText) {
    try {
      let { query, step } = queryToState(queryText);
      this.setState({
        query,
        step
      });
    } catch (e) {}

    this.props.onChange(queryText);
  }

  render() {

    let { onChange, query, error, table } = this.props;
    let hasError = !!error;

    let { tab, step, query: simpleQuery } = this.state;

    return React.createElement('div', null, React.createElement('ul', { className: 'nav nav-tabs', role: 'tablist' }, React.createElement('li', { role: 'presentation',
      className: tab === selectedTab.SIMPLE ? 'active' : '' }, React.createElement('a', { onClick: e => this.changeTab(selectedTab.SIMPLE), role: 'tab' }, 'Simple query')), React.createElement('li', { role: 'presentation',
      className: tab === selectedTab.RAW ? 'active' : '' }, React.createElement('a', { onClick: e => this.changeTab(selectedTab.RAW), role: 'tab' }, 'Raw query'))), React.createElement('div', { className: 'tab-content' }, React.createElement('div', { role: 'tabpanel',
      className: tab === selectedTab.SIMPLE ? 'tab-pane active' : 'tab-pane' }, React.createElement('br', null), React.createElement(SimpleQueryInput, { gotoStep: step => this.gotoStep(step),
      updateState: item => this.updateState(item),
      step: step,
      rewindStep: () => this.rewindStep(onChange),
      query: simpleQuery,
      table: table,
      exportQuery: value => onChange(value) })), React.createElement('div', { role: 'tabpanel',
      className: tab === selectedTab.RAW ? 'tab-pane active' : 'tab-pane' }, React.createElement('br', null), React.createElement('div', {
      className: QueryInput.addErrorClass('form-group col-sm-12 col-md-12 col-lg-12 col-xs-12', hasError) }, React.createElement('label', { htmlFor: 'tableViewFilterQuery' }, 'Filter Query'), React.createElement('input', {
      id: 'tableViewFilterQuery',
      type: 'text',
      className: 'form-control',
      onChange: evt => this.handleRawQueryUpdate(evt.target.value),
      value: query })))));
  }
}

class RowView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    /**
     * @type {Row}
     */
    let row = this.props.row;

    return React.createElement('tr', null, row.columns.map(column => column.visibility ? React.createElement('td', { colSpan: '2' }, row.getValue(column)) : null));
  }
}

export const queryToState = query => {
  if (query.trim() != '') {
    try {
      let ast = parser.parse(query);
      let tmpState = reduceAstToState(ast);
      return {
        step: step.LOGIC,
        query: {
          value: tmpState.items.join(' '),
          items: tmpState.items,
          steps: tmpState.steps
        }
      };
    } catch (e) {}
  } else {
    return {
      step: step.COLUMN,
      query: { value: '', items: [], steps: [] }
    };
  }
};

export const step = {
  COLUMN: 'choose-column',
  ACTION: 'choose-action',
  VALUE: 'choose-value',
  LOGIC: 'chose-logic-actions'
};

export const actionType = {
  SIMPLE: 'simple',
  PARAM: 'param'
};

export const logicActions = {
  and: {
    view: '&&'
  },
  or: {
    view: '||'
  }
};

export const actions = {
  l: {
    view: '<',
    type: actionType.PARAM
  },
  lt: {
    view: '<=',
    type: actionType.PARAM
  },
  g: {
    view: '>',
    type: actionType.PARAM
  },
  gt: {
    view: '>=',
    type: actionType.PARAM
  },
  eq: {
    view: '=',
    type: actionType.PARAM
  },
  con: {
    view: '*',
    type: actionType.PARAM
  },
  exc: {
    view: '!',
    type: actionType.PARAM
  },
  st: {
    view: '{',
    type: actionType.PARAM
  },
  end: {
    view: '}',
    type: actionType.PARAM
  },
  empty: {
    view: '[empty]',
    type: actionType.SIMPLE
  },
  nonempty: {
    view: '[nonempty]',
    type: actionType.SIMPLE
  }

};

class SimpleQueryInput extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      manualValue: ''
    });
  }

  chooseColumn(columnName) {
    columnName = '"' + columnName + '"';
    this.props.updateState(columnName);
    this.props.gotoStep(step.ACTION);
  }

  chooseAction(action, exportQuery) {
    const newQuery = this.props.updateState(action.view);
    if (action.type === actionType.PARAM) {
      this.props.gotoStep(step.VALUE);
    } else if (action.type === actionType.SIMPLE) {
      exportQuery(newQuery);
      this.props.gotoStep(step.LOGIC);
    }
  }

  chooseValue(value, exportQuery) {
    this.setState({ manualValue: '' });
    let result = '';
    if (value.value) {
      result = value.value;
    } else if (value.column) {
      result = '"' + value.column + '"';
    }

    if (result !== '') {
      const newQuery = this.props.updateState(result);
      exportQuery(newQuery);
      this.props.gotoStep(step.LOGIC);
    }
  }

  chooseLogic(logic) {
    this.props.updateState(logic);
    this.props.gotoStep(step.COLUMN);
  }

  renderChooseColumn(table, handler) {
    let columns = table.columns;
    return React.createElement('div', { className: 'form-group col-sm-12 col-md-12 col-lg-12 col-xs-12' }, React.createElement('label', { className: 'control-label' }, 'Choose column'), React.createElement('br', null), React.createElement('div', { className: 'btn-group', role: 'group' }, columns.map(column => React.createElement('button', { key: column.name, type: 'button',
      className: 'btn btn-default',
      onClick: e => handler(column.name) }, column.name))));
  }

  renderChooseAction(handler) {
    return React.createElement('div', { className: 'form-group col-sm-12 col-md-12 col-lg-12 col-xs-12' }, React.createElement('label', { className: 'control-label' }, 'Choose operator'), React.createElement('br', null), React.createElement('div', { className: 'btn-group', role: 'group' }, Object.keys(actions).map(key => {
      const action = actions[key];
      return React.createElement('button', { key: action.view, type: 'button',
        className: 'btn btn-default',
        onClick: e => handler(action) }, action.view);
    })));
  }

  renderChooseValue(table, handler) {
    let columns = table.columns;
    let { manualValue } = this.state;
    return React.createElement('div', { className: 'form-group col-sm-12 col-md-12 col-lg-12 col-xs-12' }, React.createElement('label', { className: 'control-label' }, 'Input value'), React.createElement('div', { className: 'input-group' }, React.createElement('input', { type: 'text', className: 'form-control',
      value: manualValue,
      onChange: evt => {
        this.setState({ manualValue: evt.target.value });
      },
      placeholder: '' }), React.createElement('span', { className: 'input-group-btn ' }, React.createElement('button', { className: 'btn btn-default',
      onClick: evt => handler({ value: manualValue }),
      type: 'button' }, 'Ok'))), React.createElement('label', { className: 'control-label' }, 'or choose column'), React.createElement('br', null), React.createElement('div', { className: 'btn-group', role: 'group' }, columns.map(column => React.createElement('button', { key: column.name, type: 'button',
      className: 'btn btn-default',
      onClick: e => handler({ column: column.name }) }, column.name))), React.createElement('br', null));
  }

  renderChooseLogic(handler) {
    return React.createElement('div', { className: 'form-group col-sm-12 col-md-12 col-lg-12 col-xs-12' }, React.createElement('label', { className: 'control-label' }, 'Choose logic operator'), React.createElement('br', null), React.createElement('div', { className: 'btn-group', role: 'group' }, Object.keys(logicActions).map(key => {
      const { view } = logicActions[key];
      return React.createElement('button', { key: view, type: 'button',
        className: 'btn btn-default',
        onClick: e => handler(view) }, view);
    })));
  }

  renderNeededHelper(table, exportQuery) {
    let { step: currentStep } = this.props;

    switch (currentStep) {
      case step.ACTION:
        return this.renderChooseAction(act => this.chooseAction(act, exportQuery));
      case step.COLUMN:
        return this.renderChooseColumn(table, cn => this.chooseColumn(cn));
      case step.VALUE:
        return this.renderChooseValue(table, val => this.chooseValue(val, exportQuery));
      case step.LOGIC:
        return this.renderChooseLogic(lo => this.chooseLogic(lo));
    }
  }

  render() {

    let { table, exportQuery, query, rewindStep } = this.props;

    return React.createElement('div', null, React.createElement('div', { className: 'form-group col-sm-12 col-md-12 col-lg-12 col-xs-12' }, React.createElement('label', { className: 'control-label' }, 'Resulting query'), React.createElement('br', null), React.createElement('div', { className: 'input-group' }, React.createElement('input', { type: 'text', disabled: true, className: 'form-control',
      placeholder: '', value: query.value }), React.createElement('span', { className: 'input-group-btn' }, React.createElement('button', { className: 'btn btn-default',
      disabled: query.items.length === 0,
      onClick: () => rewindStep(exportQuery),
      type: 'button' }, 'Backspace')))), this.renderNeededHelper(table, exportQuery));
  }
}

class TableView extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapped = false;
  }

  columnMoveHandler(side, columnName) {
    this.setState({
      td: this.state.td.reorderColumn(side, columnName)
    });
  }

  columnMoveReset() {
    this.setState({ td: this.state.td.resetColumnOrdering() });
  }

  handlePageSet(pageNum) {
    this.setState({ td: this.state.td.setCurrentPage(pageNum) });
  }

  filterHandler(expression) {
    this.setState({ td: this.state.td.setFilterExpression(expression) });
  }

  columnsVisibilityHandler(column, value) {
    this.setState({
      td: this.state.td.setColumnVisibility(column, value)
    });
  }

  columnOrderingHandler(columnName, order) {
    this.setState({
      td: this.state.td.setOrdering(columnName, order)
    });
  }

  resetOrdering() {
    this.setState({
      td: this.state.td.setOrdering(null, null)
    });
  }

  bootstrapTable(data, filterQueryExporter, filterQuery, pageSize) {
    this.bootstrapped = true;
    this.setState({
      td: new Table(data.columns, data.rows, filterQueryExporter, filterQuery, pageSize)
    });
  }

  updateTable(data) {
    this.setState({
      td: this.state.td.updateRows(data.rows)
    });
  }

  componentWillMount() {
    this.setState({ td: Table.empty() });
  }

  setPageSize(size) {
    this.setState({
      td: this.state.td.setPageSize(size)
    });
  }

  componentDidMount() {
    let {
        socket,
        eventName,
        filterQueryExporter = expression => expression,
        filterQuery = ""
    } = this.props;
    socket.on(eventName, data => {
      if (data && data.columns && data.rows && !this.bootstrapped) {
        this.bootstrapTable(data, filterQueryExporter, filterQuery, 10);
      } else if (data && data.rows) {
        this.updateTable(data);
      }
    });
  }

  render() {
    let { td: table } = this.state;
    if (table.columns.length > 0) {
      return React.createElement('div', { className: 'container-fluid' }, React.createElement(FilterView, {
        table: table,
        filterHandler: expr => this.filterHandler(expr),
        columnsVisibilityHandler: (column, value) => this.columnsVisibilityHandler(column, value),
        resetOrdering: () => this.resetOrdering(),
        resetColumnOrdering: () => this.columnMoveReset() }), React.createElement('table', { className: 'table table-responsive table-bordered' }, React.createElement(Header, {
        columnMoveHandler: (s, c) => {
          this.columnMoveHandler(s, c);
        },
        columns: table.columns,
        visibleColumns: table.columns.filter(col => col.visibility),
        columnOrderingHandler: (columnName, order) => this.columnOrderingHandler(columnName, order),
        orderingColumn: table.ordering.column }), React.createElement('tbody', null, table.exportRows().map(row => React.createElement(RowView, { key: row.key,
        row: row })))), React.createElement(PaginationView, { table: table,
        showSelect: true,
        setPageSize: pageSize => this.setPageSize(pageSize),
        handlePageSet: pageNum => this.handlePageSet(pageNum) }));
    }
    return null;
  }
}

export default TableView;
