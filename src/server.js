require('dotenv').config();
//import 'dotenv/config'; // automatically loads your .env file
const app = require('./app');

const port = process.env.PORT || 3000;
console.log("SERVER ROOT:", __dirname);
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
