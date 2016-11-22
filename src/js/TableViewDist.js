import React from 'react';

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
        peg$startRuleFunctions = { Expression: peg$parseExpression },
        peg$startRuleFunction = peg$parseExpression,
        peg$c0 = "&&",
        peg$c1 = peg$literalExpectation("&&", false),
        peg$c2 = "||",
        peg$c3 = peg$literalExpectation("||", false),
        peg$c4 = function (head, tail) {
          return tail.reduce(function (result, element) {
            return {
              'l': result,
              'r': element[3],
              'op': element[1]
            };
          }, head);
        },
        peg$c5 = "<=",
        peg$c6 = peg$literalExpectation("<=", false),
        peg$c7 = "<",
        peg$c8 = peg$literalExpectation("<", false),
        peg$c9 = ">=",
        peg$c10 = peg$literalExpectation(">=", false),
        peg$c11 = ">",
        peg$c12 = peg$literalExpectation(">", false),
        peg$c13 = "=",
        peg$c14 = peg$literalExpectation("=", false),
        peg$c15 = "*",
        peg$c16 = peg$literalExpectation("*", false),
        peg$c17 = "!",
        peg$c18 = peg$literalExpectation("!", false),
        peg$c19 = "}",
        peg$c20 = peg$literalExpectation("}", false),
        peg$c21 = "{",
        peg$c22 = peg$literalExpectation("{", false),
        peg$c23 = function (head, tail) {
          return tail.reduce(function (result, element) {
            return {
              'col': result[1],
              'act': element[1],
              'exp': element[3]
            };
          }, head);
        },
        peg$c24 = function (chars) {
          return chars.join("");
        },
        peg$c25 = /^[a-zA-Z0-9]/,
        peg$c26 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"]], false, false),
        peg$c27 = /^[ \t\n\r]/,
        peg$c28 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),
        peg$c29 = /^["]/,
        peg$c30 = peg$classExpectation(["\""], false, false),
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

    function peg$parseExpression() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseTerm();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c0) {
            s5 = peg$c0;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c1);
            }
          }
          if (s5 === peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c2) {
              s5 = peg$c2;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c3);
              }
            }
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseTerm();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parse_();
          if (s4 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c0) {
              s5 = peg$c0;
              peg$currPos += 2;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c1);
              }
            }
            if (s5 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c2) {
                s5 = peg$c2;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c3);
                }
              }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parse_();
              if (s6 !== peg$FAILED) {
                s7 = peg$parseTerm();
                if (s7 !== peg$FAILED) {
                  s4 = [s4, s5, s6, s7];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c4(s1, s2);
          s0 = s1;
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
      var s0, s1, s2, s3, s4, s5, s6, s7;

      s0 = peg$currPos;
      s1 = peg$parseColumn();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parse_();
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c5) {
            s5 = peg$c5;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c6);
            }
          }
          if (s5 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 60) {
              s5 = peg$c7;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c8);
              }
            }
            if (s5 === peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c9) {
                s5 = peg$c9;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c10);
                }
              }
              if (s5 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 62) {
                  s5 = peg$c11;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c12);
                  }
                }
                if (s5 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 61) {
                    s5 = peg$c13;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c14);
                    }
                  }
                  if (s5 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 42) {
                      s5 = peg$c15;
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c16);
                      }
                    }
                    if (s5 === peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 33) {
                        s5 = peg$c17;
                        peg$currPos++;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c18);
                        }
                      }
                      if (s5 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 125) {
                          s5 = peg$c19;
                          peg$currPos++;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c20);
                          }
                        }
                        if (s5 === peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 123) {
                            s5 = peg$c21;
                            peg$currPos++;
                          } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$c22);
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
          if (s5 !== peg$FAILED) {
            s6 = peg$parse_();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseWord();
              if (s7 !== peg$FAILED) {
                s4 = [s4, s5, s6, s7];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          while (s3 !== peg$FAILED) {
            s2.push(s3);
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.substr(peg$currPos, 2) === peg$c5) {
                s5 = peg$c5;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c6);
                }
              }
              if (s5 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 60) {
                  s5 = peg$c7;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c8);
                  }
                }
                if (s5 === peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c9) {
                    s5 = peg$c9;
                    peg$currPos += 2;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c10);
                    }
                  }
                  if (s5 === peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 62) {
                      s5 = peg$c11;
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c12);
                      }
                    }
                    if (s5 === peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 61) {
                        s5 = peg$c13;
                        peg$currPos++;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c14);
                        }
                      }
                      if (s5 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 42) {
                          s5 = peg$c15;
                          peg$currPos++;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c16);
                          }
                        }
                        if (s5 === peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 33) {
                            s5 = peg$c17;
                            peg$currPos++;
                          } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$c18);
                            }
                          }
                          if (s5 === peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 125) {
                              s5 = peg$c19;
                              peg$currPos++;
                            } else {
                              s5 = peg$FAILED;
                              if (peg$silentFails === 0) {
                                peg$fail(peg$c20);
                              }
                            }
                            if (s5 === peg$FAILED) {
                              if (input.charCodeAt(peg$currPos) === 123) {
                                s5 = peg$c21;
                                peg$currPos++;
                              } else {
                                s5 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                  peg$fail(peg$c22);
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
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseWord();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          }
        } else {
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c23(s1, s2);
          s0 = s1;
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

    function peg$parseColumn() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseQuote();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseWord();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseQuote();
          if (s3 !== peg$FAILED) {
            s1 = [s1, s2, s3];
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

    function peg$parseWord() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parseLetter();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parseLetter();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c24(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseLetter() {
      var s0;

      if (peg$c25.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c26);
        }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      if (peg$c27.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c28);
        }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c27.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c28);
          }
        }
      }

      return s0;
    }

    function peg$parseQuote() {
      var s0;

      if (peg$c29.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c30);
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
    this.__SEARCH_SYNTAX = {
      '<': (value, expectation) => value < expectation,
      '<=': (value, expectation) => value <= expectation,
      '>': (value, expectation) => value > expectation,
      '>=': (value, expectation) => value >= expectation,
      '=': (value, expectation) => value == expectation,
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

    this.expression = '';
    this.setExpression(lastFilterQuery);
  }

  setExpression(expression) {
    this.expression = expression;
    if (expression.trim().length !== 0) {
      this.__parseExpression(expression.trim());
    }
  }

  __parseExpression(expression) {
    this.lastError = '';
    var lastExpression = this.__parsedExpression;
    try {
      this.__parsedExpression = parser.parse(expression, { 'startRule': 'Expression' });
    } catch (e) {
      this.lastError = e.message;
    }

    if (JSON.stringify(this.__parsedExpression) !== JSON.stringify(lastExpression)) {
      this.__lastSuccessfullExpression = expression;
      this.__parseWasOk(this.__lastSuccessfullExpression);
      this.__markColumns(expression);
    }
  }

  static __isTermValid(term) {
    return term['col'] && term['act'] && term['exp'];
  }

  static __isExpressionValid(expression) {
    return expression['l'] && expression['r'] && expression['op'];
  }

  __reduceTerm(rows, term) {
    let { col: columnName, act: action, exp: expectation } = term;
    return rows.filter(row => {
      let value = row.getValueByColumnName(columnName);
      if (value) {
        return this.__SEARCH_SYNTAX[action](value, expectation);
      }
      return true;
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
  }

  filterRow(rows) {
    if (this.__parsedExpression) {
      return this.__reduceTree(rows, Object.assign({}, this.__parsedExpression));
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
  constructor(columnNames, rows, exportLastFilterQuery, filterQueryForBootstrap) {
    /**
     * @type {{String, Row}}
     */
    this.rows = {};

    /**
     * @type {Array<Column>}
     */
    this.columns = [];

    columnNames.forEach(columnName => {
      this.columns.push(new Column(columnName));
    });

    rows.forEach(row => {
      let rowClass = new Row(row.key, this.columns, row);
      this.rows[rowClass.key] = rowClass;
    });

    this.sorting = {
      'column': null,
      'order': true
    };

    this.filter = new Filter(this.columns, exportLastFilterQuery, filterQueryForBootstrap);
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

  exportSortedRows(rows) {
    if (this.sorting.column) {
      return rows.sort((rowA, rowB) => {
        let valueA = rowA.getValueByColumnName(this.sorting.column);
        let valueB = rowB.getValueByColumnName(this.sorting.column);

        if (this.sorting.order) {
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

  /**
   * @returns Array.<Row>
   */
  exportRows() {
    let rowsArray = Object.keys(this.rows).map(rowKey => this.rows[rowKey]);

    return this.exportSortedRows(this.exportFilteredRows(rowsArray));
  }

  setSorting(columnName, order) {
    this.sorting.column = columnName;
    this.sorting.order = order;
    return this;
  }

  setFilterExpression(expression) {
    this.filter.setExpression(expression);
    return this;
  }

  static empty() {
    return new Table([], [], expression => expression, '');
  }

  getFilterExpression() {
    return this.filter.expression;
  }

  getFilterError() {
    return this.filter.lastError;
  }

}

class ColumnsVisibility extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let { onChange, columns } = this.props;

    return React.createElement(
        "div",
        { className: "form-group col-sm-12 col-md-12 col-lg-12 col-xs-12" },
        React.createElement(
            "label",
            { className: "control-label" },
            "Hide columns"
        ),
        React.createElement("br", null),
        columns.map(column => {
          return React.createElement(
              "label",
              { className: "checkbox-inline", key: column.name },
              React.createElement("input", { type: "checkbox",
                value: "",
                onChange: evt => {
                  onChange(column.name, !evt.target.checked);
                } }),
              column.name
          );
        })
    );
  }
}

class FilterView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let { table, filterHandler, columnsVisibilityHandler } = this.props;

    return React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "h3",
                { className: "panel-title" },
                "Table filtering"
            )
        ),
        React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(QueryInput, { onChange: filterHandler,
              query: table.getFilterExpression(),
              error: table.getFilterError() }),
            React.createElement(ColumnsVisibility, { columns: table.columns,
              onChange: columnsVisibilityHandler })
        )
    );
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  setSorting(columnName, order) {
    this.setState({
      columnName: columnName,
      order: order
    });
  }

  componentWillMount() {
    this.setSorting(null, null);
  }

  toggleSorting(columnName) {
    let order = true;
    if (this.state.columnName !== columnName) {
      this.setSorting(columnName, true);
    } else {
      order = !this.state.order;
      this.setSorting(columnName, order);
    }
    return order;
  }

  sortingIconClass(columnName) {
    if (this.state.columnName !== columnName) {
      return 'glyphicon glyphicon-sort';
    } else if (this.state.columnName === columnName && this.state.order) {
      return 'glyphicon glyphicon-sort-by-attributes';
    } else if (this.state.columnName === columnName && !this.state.order) {
      return 'glyphicon glyphicon-sort-by-attributes-alt';
    } else {
      return 'glyphicon glyphicon-sort';
    }
  }

  render() {

    let { columns, columnSortingHandler } = this.props;

    let style = {
      resize: 'horizontal',
      overflow: 'auto'
    };

    return React.createElement(
        "thead",
        null,
        React.createElement(
            "tr",
            null,
            columns.map(column => {
              if (column.visibility) {
                return React.createElement(
                    "th",
                    { style: style,
                      className: column.inFilterExpression ? 'col-md-1 active' : 'col-md-1',
                      key: column.name },
                    React.createElement(
                        "div",
                        null,
                        React.createElement("span", { className: this.sortingIconClass(column.name),
                          onClick: () => {
                            columnSortingHandler(column.name, this.toggleSorting(column.name));
                          }
                        }),
                        " \xA0",
                        column.name
                    )
                );
              }
            })
        )
    );
  }
}

class QueryInput extends React.Component {
  constructor(props) {
    super(props);
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

  render() {

    let { onChange, query, error } = this.props;
    let hasError = error !== '';

    return React.createElement(
        "div",
        {
          className: QueryInput.addErrorClass('form-group col-sm-12 col-md-12 col-lg-12 col-xs-12', hasError) },
        React.createElement(
            "label",
            { htmlFor: "tableViewFilterQuery" },
            "Filter Query"
        ),
        React.createElement("input", {
          id: "tableViewFilterQuery",
          type: "text",
          className: "form-control",
          onChange: evt => onChange(evt.target.value),
          value: query })
    );
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

    return React.createElement(
        "tr",
        null,
        row.columns.map(column => column.visibility ? React.createElement(
            "td",
            null,
            row.getValue(column)
        ) : null)
    );
  }
}

class TableView extends React.Component {
  constructor(props) {
    super(props);
  }

  filterHandler(expression) {
    this.setState({ td: this.state.td.setFilterExpression(expression) });
  }

  columnsVisibilityHandler(column, value) {
    this.setState({ td: this.state.td.setColumnVisibility(column, value) });
  }

  columnSortingHandler(columnName, order) {
    this.setState({ td: this.state.td.setSorting(columnName, order) });
  }

  bootstrapTable(data, filterQueryExporter, filterQuery) {
    this.setState({
      td: new Table(data.columns, data.rows, filterQueryExporter, filterQuery)
    });
  }

  updateTable(data) {
    this.setState({ td: this.state.td.updateRows(data.rows) });
  }

  componentWillMount() {
    this.setState({ td: Table.empty() });
  }

  componentDidMount() {
    let { socket, eventName, filterQueryExporter = expression => expression, filterQuery = '' } = this.props;
    socket.on(eventName, data => {
      if (data && data.columns && data.rows) {
        this.bootstrapTable(data, filterQueryExporter, filterQuery);
      } else if (data && data.rows) {
        this.updateTable(data);
      }
    });
  }

  render() {

    let { td: table } = this.state;

    return React.createElement(
        "div",
        { className: "container-fluid" },
        React.createElement(FilterView, {
          table: table,
          filterHandler: expr => this.filterHandler(expr),
          columnsVisibilityHandler: (column, value) => this.columnsVisibilityHandler(column, value) }),
        React.createElement(
            "table",
            { className: "table table-bordered" },
            React.createElement(Header, {
              columns: table.columns,
              columnSortingHandler: (columnName, order) => this.columnSortingHandler(columnName, order) }),
            React.createElement(
                "tbody",
                null,
                table.exportRows().map(row => React.createElement(RowView, {
                  key: row.key,
                  row: row }))
            )
        )
    );
  }
}

export default TableView;
