/* Kept this below if just want some javascript test. */
const originalConsoleLog = console.log;function consoleLogProxy() { originalConsoleLog.apply( console , arguments ); document.getElementById( "container" ).innerHTML = `${ Array.prototype.slice.apply( arguments , [] ) .join( " " ) }<br>${ document.getElementById( "container" ).innerHTML }`; };console.log = consoleLogProxy;
/* Kept this above if just want some javascript test. */

console.log( "hello world" ); // for test.