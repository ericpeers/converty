describe("converty", function () {
  var Conversion = require('../conversion.js');

  it ("should be able to perform an identity conversion", function () {
    var result = new Conversion()
      .convert(1, "meter")
        .to("meter")
        .execute();

    expect(result).toBe(1, "Want the same result out as I put in");

  });

  it("should let me convert inches to feet", function () {
    var result = new Conversion().convert(12, "inches").to("feet").execute();
    expect(result).toBe(1, "Want 1 foot coming out");
  });

  it("should let me convert feet to inches", function () {
    var result = new Conversion().convert(1.5, "feet").to("inch").execute();
    expect(result).toBe(18, "Want 18 inches for 1.5 feet");
  });

  it("should convert like types", function () {
    var weight = new Conversion().convert(4.4, "lbs").to("kilograms").execute();
    expect(weight).toBe(2, "want 2 kilos out");

    var length = new Conversion().convert(24, "inches").to("m").execute();
    expect(length).toBe(0.6, "Want 0.6 meters from 24 inches");

    var beer = new Conversion().convert(2.5, "BOmbers").to("floz").execute();
    expect(beer).toBe(50, "Want 50 fluid ounces from 2.5 20 oz bombers");
  });


  it("should let me put .to first, and convert second", function () {
    var inversion = new Conversion().to("feet").convert(29, "inches").execute();
    expect(inversion).toBe(2.42, "Want it to round and convert");
  });

  it ("should throw an exception when I don't supply a .to", function () {
    //playing with syntax in interrupting the call chain here too.
    var halfsy = new Conversion().convert(1, "bomber");

    //http://stackoverflow.com/questions/4144686/jasmine-how-to-write-a-test-which-expects-an-error-to-be-thrown
    //have to put the item that will generate the exception inside of a function so that it defers the calling.
    expect( function () { halfsy.execute(); } ).toThrow(new Error("Failed to supply a target unit"));
  });

  it ("should throw an exception when I don't supply a .convert", function () {
    expect( function () {
      var cv = new Conversion().to("pints").execute(); //this shouldn't fire unless the other code fails.
    }).toThrow(new Error("Failed to supply a source unit"));
  });

  it ("should throw an exception with a null value", function () {
    expect( function () {
      var cv = new Conversion().convert(null, "feet").to("inch").execute();
      console.log(cv); //this shouldn't fire unless the other code fails.
    }).toThrow(new Error("No source value set"));
  });

  it ("should throw an exception when I don't supply a .convert or a .to", function () {
    expect( function () {
      new Conversion().execute();
    }).toThrow(new TypeError("Failed to supply a source unit"));

  });

  it ("should complain if I convert Frozbozz to Fizbangs... Bad types", function () {
    expect( function () {
      new Conversion().convert(2, "Frozbozz").to("bombers").execute();
    }).toThrow(new SyntaxError("Unit: Frozbozz not valid"));
  });

  it ("should complain if I convert variable types", function () {
    expect( function () {
      new Conversion().convert(10, "bombers").to("feet").execute();
    }).toThrow(new TypeError("Target type != Source type"));
  });


  //do a conversion with long result.
  //also do an identity conversion which will truncate.
  it ("should truncate a super long float to 2 digits of precision", function () {
    var inversion = new Conversion().to("feet").convert(29, "inches").execute();
    expect(inversion).toBe(2.42, "Want it to round and convert long floats");

    var identity = new Conversion().convert(1.999999999, "feet").to("feet").execute();
    expect(identity).toBe(2.00, "Round that identity baby!");
  });


});
