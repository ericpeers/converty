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
    var halfsy = new Conversion().convert(1, "bomber");
    expect( function () { halfsy.execute(); } ).toThrow(new Error("Failed to supply a target unit"));
  });

  xit ("should throw an exception when I don't supply a .convert", function () {
  });
  xit ("should throw an exception when I don't supply a .convert or a .to", function () {
  });


});
