var Conversion = require('./conversion.js');

var result = new Conversion()
    .convert(1, "meter")
    .to("meter")

debugger;
var result2 = result
    .execute();
