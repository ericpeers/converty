/*
// Conversion Class - for Technical Assessment
//
// This class provides a Fluent Interface (aka chaining) to convert between like units
// of measurement. It will generate a TypeError if the wrong arguments are presented, and a
// TypeError if conflicting arguments (e.g. kg to feet) are presented.
//
// It also throws a Syntax error if you give it something like "Frozbozz" as a type.
//
// Valid conversions are:
//
// Pounds (lb), Kilograms (kg), Ounces (oz)
// Feet (ft), Inches (in), Meters (m)
// Pint (pt), Fluid Ounces (fl oz), Bombers (NO ABBREVIATION ALLOWED BECAUSE THEY ARE BIG)
//
// Example usage:
// var kilograms = new Conversion()
//       .convert(16, "lb")
//       .to("kg")
//       .execute()
//
// Assumptions:
//   * Your conversions will fit within a numeric representation in Node/JS - 51 bits of precision in floats/mantissa!
//   * You are sending down a string as per the original
// Note that the Fluent/chaining functions (convert, to) will return an instance of Conversion, and execute will
//  return a n.2 float, rounded to the neared 100th place.

*/

//JS doesn't have true enumerated types, but they make it easy to convert variable strings into a well understood type
//and then reference that by name.
Conversion.UNIT = {
  POUND:    1,
  KILOGRAM: 2,
  OUNCE:    3,

  FOOT:  4,
  INCH:  5,
  METER: 6,

  PINT:        16, //because we do drink 16 fl oz of beer after all.
  FLUID_OUNCE: 17,
  BOMBER:      20
}

Conversion.TYPE = {
  WEIGHT: 1,
  LENGTH: 2,
  VOLUME: 3
}

// this allows a lookup based on source.destination in a hash to get the conversion constant.
// normally I could just convert from A to B. But a smaller data structure (with less room for
// error) allows me to convert from a A to Z to B. The advantage here is going to a normalized
// unit, and then all I have to do is convert from normalized to my final unit.
//
// This has the expense of one additional multiply vs. smaller storage, and storage that would
// scale with a huge number of conversions. Basically if I had 30 different types of weight, then
// I would need a 30x30 matrix to handle the conversions, and that's starting to be inefficient. I can
// store it in a hash which gives me o(1) lookup, but still...
//
// another interesting issue, which I didn't encounter, but could be an issue with floats, is that if
// I convert using imprecisely represented conversions, then I might somehow say that 24 inches = 1.999999999999 feet.
// there's a trick I employ below to try to avoid this.
Conversion.normalizers = {};
//convert all weight to kilos
Conversion.normalizers[Conversion.UNIT.POUND] = 1.0/2.2;
Conversion.normalizers[Conversion.UNIT.KILOGRAM] = 1;
Conversion.normalizers[Conversion.UNIT.OUNCE] =    1/(2.2 * 16);

//convert all length to meters
Conversion.normalizers[Conversion.UNIT.FOOT] = 0.3;
Conversion.normalizers[Conversion.UNIT.INCH] = 0.3/12;
Conversion.normalizers[Conversion.UNIT.METER] = 1;

//store everything as fluid ounces
Conversion.normalizers[Conversion.UNIT.PINT] = 16;
Conversion.normalizers[Conversion.UNIT.FLUID_OUNCE] = 1;
Conversion.normalizers[Conversion.UNIT.BOMBER] = 20;
//we may also want to add a snifter at smoe point, but I can't recall if they are 8 or 10 oz.


function Conversion () {
  this.sourceUnit = null; //a hash/json of type, unit enums
  this.targetUnit = null; //a hash/json of type/unit enums
  this.sourceValue = null;
  return this;
}

//to make this extensible, we could create either a regexp engine or create a set of hashes that convert, and then
//just lookup the result directly. Might be a simpler routine. But frankly, KISS for right now and don't use indirection when
//the problem isn't large. Deal with that sort of refactor when you need it.
Conversion.prototype.validateUnit = function(unitStr) {
  var self = this;

  //at some later date it might be nice to allow units as the enumerated types above.

  unit = unitStr.toLowerCase(); //see how we converted that camelcase? ;)
  switch (unit) {
    //weight types
  case "lb": case "lbs": case "pounds": case "pound": //I hate how my editor doesn't indent case here...
    return {
      "type": Conversion.TYPE.WEIGHT,
      "unit": Conversion.UNIT.POUND
    }
    break;

  case "kg": case "kilogram": case "kilo": case "kilos": case "kilograms":
    return {
      "type": Conversion.TYPE.WEIGHT,
      "unit": Conversion.UNIT.KILOGRAM
    };
    break;

  case "oz": case "ounce": case "ounces":
    return {
      "type": Conversion.TYPE.WEIGHT,
      "unit": Conversion.UNIT.KILOGRAM
    };
    break;

    //Length types
  case "ft": case "foot": case "feet":
    return {
      "type": Conversion.TYPE.LENGTH,
      "unit": Conversion.UNIT.FOOT
    };
    break;

  case "in": case "inch": case "inches":
    return {
      "type": Conversion.TYPE.LENGTH,
      "unit": Conversion.UNIT.INCH
    };
    break;

  case "m": case "meter": case "meters":
    return {
      "type": Conversion.TYPE.LENGTH,
      "unit": Conversion.UNIT.METER
    };
    break;

    //volume types
  case "pt": case "pint": case "pints":
    return {
      "type": Conversion.TYPE.VOLUME,
      "unit": Conversion.UNIT.PINT
    }
    break;

  case "floz": case "fl oz": case "fluid ounce": case "fluid ounces": case "fluidounce": case "fluid ounce":
    return {
      "type": Conversion.TYPE.VOLUME,
      "unit": Conversion.UNIT.FLUID_OUNCE
    };
    break;

  case "bomber": case "bombers":
    return {
      "type": Conversion.TYPE.VOLUME,
      "unit": Conversion.UNIT.BOMBER
    };
    break;


  default:
    throw new SyntaxError("Unit: " + unitStr + " not valid");
  }

}


Conversion.prototype.convert = function(amount, unitStr) {
  //add argument checks here. I can add a type of for amount and unitstr to ensure float/str respectively.
  var self = this;
  self.sourceUnit = self.validateUnit(unitStr);
  self.sourceValue = amount;
  return self;
}

Conversion.prototype.to = function(unitStr) {
  var self = this;
  self.targetUnit = self.validateUnit(unitStr);
  return self;
}

Conversion.prototype.execute = function() {
  var self = this;

  //perform a few checks.
  if (self.sourceUnit == null) {
    throw new TypeError("Failed to supply a source unit");
    return null;
  } else if (self.targetUnit == null) {
    throw new TypeError("Failed to supply a target unit");
    return null;
  } else if (self.sourceValue == null) {
    //this should never happen, but let's cover it in case someone manually sets a variable.
    throw new TypeError("No source value set");
    return null;
  } else if (self.targetUnit.type != self.sourceUnit.type) {
    throw new TypeError("Target type != Source type");
    return null;


  } else {
    //do the actual conversion.


    /* note - original implementation did this - but it could cause imprecision in floats. Instead, I'll create a conversion ratio.

      //convert the item into the our "metric" equivalent, and then invert that to the target of interest.
      var intermediate = Conversion.normalizers[self.sourceUnit.unit] * self.sourceValue;
      return intermediate / Conversion.normalizers[self.targetUnit.unit];
    */

    var conversion_ratio = Conversion.normalizers[self.sourceUnit.unit] / Conversion.normalizers[self.targetUnit.unit];
    var result = self.sourceValue * conversion_ratio;

    // I'd prefer to send the full float down, so somebody else consuming it can retain whatever precision I still have
    // and make a final decision. But it's in the
    // requirements, so we're doing it. I'd actually go back to product/redefine the requirements in real life, but F'ake la vie.
    // http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places
    var rounded = +result.toFixed(2);
    return rounded;
  }
}


module.exports= Conversion;
