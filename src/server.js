// Import the configured items from the server file:
var {app, PORT} = require('./app');

// Run the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});
