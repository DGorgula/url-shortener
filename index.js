const { post } = require("./app");
const app = require("./app");
const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// app.post('/views/api/shorturl/new', (req, res) => {


// })