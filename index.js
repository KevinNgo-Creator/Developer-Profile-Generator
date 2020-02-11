const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const pdf = require('html-pdf');
var options = { format: 'Letter' }
const axios = require('axios');

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?"
    },
    {
      type: "input",
      name: "location",
      message: "Where are you from?"
    },
    {
      type: "input",
      name: "hobby",
      message: "What is your favorite hobby?"
    },
    {
      type: "input",
      name: "food",
      message: "What is your favorite food?"
    },
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username"
    },
    {
      type: "input",
      name: "linkedin",
      message: "Enter your LinkedIn URL."
    }
  ]);
}

function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
<style>
</style>
  </head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <img src="${answers.gitPic}"/>
    <h1 class="name">Hi! My name is ${answers.name}</h1>
    <p class="from">I am from ${answers.location}.</p>
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="github">My GitHub username is ${answers.github}</li>
      <li class="linked">LinkedIn: ${answers.linkedin}</li>
    </ul>
  </div>
</div>
</body>
</html>`;
}

promptUser()
  .then(function(answers) {
    return axios.get(`https://api.github.com/users/${answers.github}`)
      .then(function (res) {
        console.log(res.data);
        answers.gitPic = res.data.avatar_url
        return generateHTML(answers);
        // writeFileAsync("index.html", html);
        // var html = fs.readFileSync('./index.html', 'utf8');
        
      })
  })
  .then(function (html) {
    return new Promise((resolve, reject)=>{
      pdf.create(html.toString(), options).toFile('./profile.pdf', function(err, res) {
        if (err) return reject(err);
        resolve(res); // { filename: '/app/businesscard.pdf' }
      })
    });    
  }).then(console.log)
  .catch(function(err) {
    console.log(err);
  });

  // promptUser()
  // .then(function(answers) {
  //   const html = generateHTML(answers);
  //   return writeFileAsync("index.html", html);
  // })
  // .then(function() {
  //   console.log("Successfully wrote to index.html");
  // })
  // .then(function () {
  //   var html = fs.readFileSync('./index.html', 'utf8');
  //   pdf.create(html, options).toFile('./profile.pdf', function(err, res) {
  //     if (err) return console.log(err);
  //     console.log(res); 
  //   })
  // })
  // .catch(function(err) {
  //   console.log(err);
  // });