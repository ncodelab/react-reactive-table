require('es5-shim');
require('es6-shim');
require('tablefilter');

import React from 'react'
import {render} from 'react-dom'
// import TableView from './components/TableView.jsx'
import TableView from '../../dist/TableViewDist.jsx';
let socket = require('socket.io-client')('http://localhost:3000');

render(
    <div className="container-fluid">
        <TableView
            socket={socket}
            eventName="event"
            filterQuery=''
            filterQueryExporter={(expr) => console.log(expr)}
            pageSize={20}/>
    </div>,
    document.getElementById('application')
);
