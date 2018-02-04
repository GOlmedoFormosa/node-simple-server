const http = require( 'http' );
const url = require( 'url' );
const path = require( 'path' );
const fs = require( 'fs' );

const mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
};

http.createServer( ( req, res) => {

  // I'm parsing the URL string to an URL object, and I'm getting the name after the / (slash)
  const uri = url.parse( req.url ).pathname;

  // process.cwd returns the current working directory.
  // the decodeURI() function decodes a Uniform Resource Identifier (URI) previously created 
  // fileName will store the exac path to the html files inside the public folder.
  const fileName = path.join( process.cwd(), '\\public\\', decodeURI( uri ) );
  let stats;

  try {
    stats = fs.lstatSync( fileName );
  } catch (error) {
    res.writeHead( 404, { 'Content-type': 'text/plain' } );
    res.write( '404 Not Found\n' );
    res.end();
    return;
  }

  if( stats.isFile() ) {

    // fileName will be the complete path
    // extname will return .html
    // split will convert into an array separating by . (dot) ['','html']
    // reverse will reverse the array (?) ['html', '']
    // then I'll access the mimeTypes with the first elemente of my array ('html' in this example)
    // Ill pass "html" for the key and mimeTypes will return "text/html".
    const mimeType = mimeTypes[ path.extname( fileName ).split( "." ).reverse()[ 0 ] ];
    
    res.writeHead( 200, { 'Content-type': mimeType } );

    const fileStream = fs.createReadStream( fileName );
    fileStream.pipe( res );

  } else if( stats.isDirectory() ) {

    res.writeHead( 302, {
      'Location': 'index.html'
    } );
    res.end();

  } else {

    res.writeHead( 500, { 'Content-type': 'text/plain' } );
    res.write( '500 Internal Error\n' );
    res.end();

  }

} ).listen(1337);