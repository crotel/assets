var _Which ,
    _Code ,
    _Key ,
    _Location;
var keyCodeViewer = document.getElementById( "id-keyCode" );
var keyCodeAlert = document.getElementById( "id-alert" );
var keyCodeBox = document.getElementById( "id-keyCodeBox" );
var whichViewer = document.getElementById( "id-which" );
var keyViewer = document.getElementById( "id-key" );
var locationViewer = document.getElementById( "id-location" );
var codeViewer = document.getElementById( "id-code" );

keyCodeBox.style.visibility = "hidden";

document.onkeydown = vonkeydown;

//id-keyCode
function vonkeydown( key ) {
  _Which = key.which || key.keyCode;
  _Code = key.code;

  if (_Code == "Space") {
    _Key = "Space";
  } else if (_Code == "Tab") {
    key.preventDefault();
    _Key = key.key;
  } else {
    _Key = key.key;
  }
  _Location = key.location;
  keyCodeAlert.innerHTML = "";
  keyCodeViewer.innerHTML = _Which;
  keyCodeBox.style.visibility = "visible";
  whichViewer.innerHTML = _Which;
  keyViewer.innerHTML = _Key;
  locationViewer.innerHTML = _Location;
  codeViewer.innerHTML = _Code;

  if (_Code == "CapsLock") {
    document.querySelector( `key[data-code="${ _Code }"]` )
            .setAttribute( "style" , "border-color: lime;color: yellow;transform: scale(.9);" );
    document.querySelector( "span.cap" )
            .setAttribute( "style" , "visibility:visible" );
  } else {
    document.querySelector( `key[data-code="${ _Code }"]` )
            .setAttribute( "style" , "border-color: lime;color: yellow;transform: scale(.9);" );
    //box-shadow: inset 0 0 0 transparent, 0 2px 0 -1px #ccc, 0 4px 0 -2px #ddd, 0 4px 12px 0 rgb(0 0 0 / 13%), 0 0 8px 0 rgb(0 0 0 / 13%);border-width: medium;
  }
}

document.onkeyup = vonkeyup;

function vonkeyup( key ) {
  // console.log( key );
  // _Which = key.which || key.keyCode;
  _Code = key.code;
  if (_Code == "CapsLock") {
    document.querySelector( `key[data-code="${ _Code }"]` )
            .setAttribute( "style" , "" );
    document.querySelector( "span.cap" )
            .setAttribute( "style" , "" );
  } else {
    document.querySelector( `key[data-code="${ _Code }"]` )
            .setAttribute( "style" , "" );
  }

}

document.querySelectorAll( "key" )
        .forEach( e => {
          e.onmousedown = () => {
            console.log( e );
            const keydown = new KeyboardEvent( "keydown" , {
              isTrusted : e.getAttribute( "data-isTrusted" ) ,
              altKey : e.getAttribute( "data-altKey" ) ,
              shiftKey : e.getAttribute( "data-shiftKey" ) ,
              ctrlKey : e.getAttribute( "data-ctrlKey" ) ,
              keyCode : e.getAttribute( "data-keyCode" ) ,
              key : e.getAttribute( "data-key" ) ,
              code : e.getAttribute( "data-code" ) ,
              location : e.getAttribute( "data-location" ) ,
            } );

            document.dispatchEvent( keydown );
          };
          e.onmouseup = () => {
            console.log( e );
            const keyup = new KeyboardEvent( "keyup" , {
              isTrusted : e.getAttribute( "data-isTrusted" ) ,
              altKey : false ,
              shiftKey : false ,
              ctrlKey : false ,
              keyCode : e.getAttribute( "data-keyCode" ) ,
              key : e.getAttribute( "data-key" ) ,
              code : e.getAttribute( "data-code" ) ,
              location : e.getAttribute( "data-location" ) ,
            } );
            document.dispatchEvent( keyup );
          };
        } );
