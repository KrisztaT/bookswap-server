// Import the configured items from the server file:
var {app, PORT, HOST} = require('./app');

// Run the server
app.listen(PORT, HOST, () => {
    console.log(`Server listening on port ${PORT}`)
});
