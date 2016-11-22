Expression
  = head:Term tail:(_ ("&&" / "||") _ Term)* {
      return tail.reduce(function(result, element) {
          return {
          	'l': result,
            'r': element[3],
            'op': element[1]
          }
      }, head);
    }

Term
  = head: Column tail:(_ ( "<=" / "<" / ">=" / ">" / "=" / "*" / "!" / "}" / "{") _ Expected)+ {
      return tail.reduce(function(result, element) {
         return {
           'col': result[1],
           'act': element[1],
           'exp': element[3]
         }
      }, head);
    }

Column = Quote Word Quote

Expected = Word

Word = chars:Letter+ {return chars.join("");}

Letter = [a-zA-Z0-9]

_ = [ \t\n\r]*

Quote = [\"]

