describe("converty", function () {
  var Conversion = require('../conversion.js');

  it ("should be able to perform an identity conversion", function () {
    var result = new Conversion()
      .convert(1, "meter")
        .to("meter")

    debugger;
    var result2 = result
      .execute();

    expect(result2).toBe(1, "Want the same result out as I put in");

  });

  xit ("should throw an exception when I don't supply a .to", function () {
  });

  xit ("should throw an exception when I don't supply a .convert", function () {
  });
  xit ("should throw an exception when I don't supply a .convert or a .to", function () {
  });


});
