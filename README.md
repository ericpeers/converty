# Conversion Class - for a technical assesment

## Example Usage:

   **debug.js:**
```javascript
   require(./conversion.js");
   var cv = new Conversion().convert(2, "feet").to("inch").execute()
   console.log(cv);
```
   your prompt> node debug.js
   
## Installation:
   npm install
   

## Assumptions
   * Your conversions will fit within a numeric represntation in Node/JS.
   * You are sending down a string for units. Eventually I could support both enum and string by checking type.
   * Floats will work reasonably nicely. Maybe I should test further.
   * You, like me, like beer.

