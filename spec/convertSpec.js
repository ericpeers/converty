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

  it ("should throw an exception when I don't supply a .to", function () {
    //playing with syntax in interrupting the call chain here too.
    var halfsy = new Conversion().convert(1, "bomber");

    //http://stackoverflow.com/questions/4144686/jasmine-how-to-write-a-test-which-expects-an-error-to-be-thrown
    //have to put the item that will generate the exception inside of a function so that it defers the calling.
    expect( function () { halfsy.execute(); } ).toThrow(new Error("Failed to supply a target unit"));
  });

  it ("should throw an exception when I don't supply a .convert", function () {
    expect( function () {
      var cv = new Conversion().to("pints").execute();
    }).toThrow(new Error("Failed to supply a source unit"))
  });

  it ("should throw an exception with a null value", function () {
    expect( function () {
      var cv = new Conversion().convert(null, "feet").to("inch");
      console.log(cv);
    }).toThrow(new Error("No source value set"))
  });

  it ("should throw an exception when I don't supply a .convert or a .to", function () {
    expect( function () {
      new Conversion().execute();
    }).toThrow(new TypeError("Failed to supply a source unit"))

  });
  xit ("should complain if I convert Frozbozz to Fizbangs... Or variable types");

  //do a conversion with long result.
  //also do an identity conversion which will truncate.
  xit ("should truncate a super long float to 2 digits of precision");

});
