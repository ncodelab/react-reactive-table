#TableView

##Usage

```
import TableView from './TableViewDist.jsx'

<TableView
            socket={socket}
            eventName='event'
            filterQuery=''
            filterQueryExporter={(expr) => console.log(expr)}/>
```

Where

* `socket` - instance of socker.io client. For example `let socket = require('socket.io-client')('http://localhost:3000');`
* `eventName` - name of event to subscribe. Will be used as argument for `socket.on()`
* `filterQuery` - query which will be used on initial rendering
* `filterQueryExporter` - callback with signature `funciton(string)` which will be called on successful filter query parsing.



##Filtering
You could use syntax from [TableFilter](https://github.com/koalyptus/TableFilter/wiki/4.-Filter-operators) without `:rgx`

###Examples
```
"{ColumnName}" *Filter Operator* {Value}

"Price" > 200
"Weight" < 100
"Name" { Alex

"{ColumnName}" *Filter Operator* "{ColumnName}"

"DiscountedPrice" = "Price"
```

##Chaining
Filter rules could be chained with `&&`  and `||`

For example
```
#FilteringExpression *Logic Operator* #FilteringExpression

"Price" > 100 && "Price" < 300 //find all rows where price between 100 and 300

"Price" > 100 && "Price" < 300 || "Amount" = 10 //find all rows where price between 100 and 300 and add rows with amount equals to 10

```
