var connect = require('connect');
var serveStatic = require('serve-static');

connect()
	.use(serveStatic(__dirname))
	.listen(8082, () => console.log('Server running on 8082...'));


