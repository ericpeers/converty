var Conversion = require('./conversion.js');

var cv = new Conversion().convert(2, "feet").to("inch").execute();
console.log(cv);
