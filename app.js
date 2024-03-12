const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us22.api.mailchimp.com/3.0/lists/d45bac6809";
  const options = {
    method: "POST",
    auth: "notdecided:9ffc3bb23e643f81f5854a24d237e502-us22",
  };

  const requests = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  requests.write(jsonData);
  requests.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port || 3000, function () {
  console.log("Running on port %d", port);
});
