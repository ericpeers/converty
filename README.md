# Conversion Class - for a technical assesment

## Installation:
```
   your prompt> npm install
```   

   this is really just to get the jasmine requirements for test running.  
   
## Example Usage:

   **debug.js:**
```javascript
   require("./conversion.js");
   var cv = new Conversion().convert(2, "feet").to("inch").execute()
   console.log(cv);
```
Then go type:
```
your prompt> node debug.js
```
   

## Running tests:
   There are a number of tests in specs/convertSpec.js. To run them:  

```
   your prompt> node_modules/.bin/jasmine
```

## Assumptions
   * Your conversions will fit within a numeric represntation in Node/JS.
   * You are sending down a string for units. Eventually I could support both enum and string by checking type.
   * Floats will work reasonably nicely. Maybe I should test further.
   * You, like me, like beer.

