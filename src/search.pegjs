Query = (Expression / Term)

Expression
  = head:Term _ tail:(LogicAction Term)+  {
      return tail.reduce(function(r, e) {
         return {
           'l': r,
           'r': e[1],
           'op': e[0]
         };
      }, head);
    }

Term =  (NonParametrizedTerm / InterColumnTerm / SimpleTerm)

NonParametrizedTerm
 = _ col: Column _ check:("[empty]" / "[nonempty]") _ {
 	return {
          'col': col,
          'check': check
        }
 }

InterColumnTerm
  = _ col1: Column _ act:SearchAction _ col2:Column _ {
      return {
           'col1':col1,
           'act': act,
           'col2': col2
         }
    }

SimpleTerm
  = _ col: Column _ act:SearchAction _ exp: Expected _ {
      return {
           'col': col,
           'act': act,
           'exp': exp
         }
    }
    
LogicAction = ("&&" / "||")
    
SearchAction = ( "<=" / "<" / ">=" / ">" / "=" / "*" / "!" / "}" / "{")

Column = items:(Quote Word Quote) {return items[1];}

Expected = Word

Word = chars:(Letters+) {return chars.join("");}

Letters = [a-zA-Z0-9<>\.\[\]@#$%^-_+ ]

_ = [ \t\n\r]*

Quote = '"'

