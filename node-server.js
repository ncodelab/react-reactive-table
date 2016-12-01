var io = require('socket.io')();

var createRow = function (key, values) {
  var result = {
    'key': key,
  };

  values.forEach(function (val) {
    result[val.column] = val.value;
  });

  return result;
};

var random = function (from, to) {
  return Math.floor(Math.random() * (from - to + 1)) + to;
};


var getName = function () {
  var names = [
    "first name",
    "sevond name",
    "third name",
    "fourth name",
    "fifth_name",
    "sixth_name",
    "mmmmmmm_name",
    "meh",
    "loldlold",
  ];
  return names[random(0, names.length - 1)];
};

var getPrice = function () {
  return random(100, 110);
};

var getAmount = function () {
  return random(100, 110);
};

var getWeight = function () {
  return (random(1, 1000) / 10) + " kg";
};

var getHeight = function () {
  return random(20, 200);
};

var columns = [
    'item',
  'price',
  // 'price with VAT',
  'amount',
  'weight',
  // 'height',
  // 'width',
  // 'x', 'y', 'z'
];

var intervalMin = 1;
var intervalMax = 147;

var randomRow = function(key) {
  return createRow(key, columns.map(function (column) {
    switch (column) {
      case 'item':
        return {'column': column, 'value': getName()};
      case 'price':
        return {'column': column, 'value': getPrice()== 104 ? '': getPrice()};
      case 'price with VAT':
        return {'column': column, 'value': getPrice() == 104 ? '': getPrice()};
      case 'amount':
        return {'column': column, 'value': getAmount()};
      case 'weight':
        return {'column': column, 'value': getWeight()};
      case 'height':
        return {'column': column, 'value': getHeight()};
      case 'width':
        return {'column': column, 'value': getHeight()};
      case 'x':
        return {'column': column, 'value': random(0, 10)};
      case 'y':
        return {'column': column, 'value': random(0, 10)};
      case 'z':
        return {'column': column, 'value': random(0, 10)};

    }
  }));
};

var getData = function () {
  var result = {
    'columns': columns,
    'rows': []
  };

  for (var key = intervalMin; key <= intervalMax; key++) {
    result.rows.push(randomRow(key));
  }

  return result;
};
console.log('pre-getData');
var data = getData();
console.log('post-getData');


var sender = function (client) {
  var forUpdate = random(10, 50);

  var updateData ={'rows': []};
  for(var key = 1; key < forUpdate; key++) {
    updateData.rows.push(randomRow(random(intervalMin, intervalMax)))
  }
  client.emit('event', updateData);
  setTimeout(function () {
    sender(client);
  }, 500);
};

io.on('connection', function (client) {
  console.log('client');
  setTimeout(function () {
    client.emit('event', data);
    // setTimeout(function() {
      // client.emit('event', {columns:['a','b','c','d']})
    // }, 2000);
    // setTimeout(function () {
    //   sender(client);
    // }, 500);
  }, 1000)


});
console.log('pre-start');
io.listen(3000);
