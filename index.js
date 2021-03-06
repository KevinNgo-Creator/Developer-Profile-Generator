const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const pdf = require('html-pdf');
var options = { format: 'Letter' }
const axios = require('axios');
const writeFileAsync = util.promisify(fs.writeFile);

const colors = {
  green: {
    wrapperBackground: "#E6E1C3",
    headerBackground: "#C1C72C",
    headerColor: "black",
    photoBorderColor: "#black"
  },
  blue: {
    wrapperBackground: "#5F64D3",
    headerBackground: "#26175A",
    headerColor: "white",
    photoBorderColor: "#73448C"
  },
  pink: {
    wrapperBackground: "#879CDF",
    headerBackground: "#FF8374",
    headerColor: "white",
    photoBorderColor: "#FEE24C"
  },
  red: {
    wrapperBackground: "#DE9967",
    headerBackground: "#870603",
    headerColor: "white",
    photoBorderColor: "white"
  }
};

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
      name: "color",
      message: "What is your favorite Color?"
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
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
    <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
    <title>My Developer Page</title>
    </head>
  <style>
    @page {
      margin: 0;
    }
   *,
   *::after,
   *::before {
   box-sizing: border-box;
   }
   html, body {
   padding: 0;
   margin: 0;
   }
   html, body, .wrapper {
   height: 100%;
   }
   .wrapper {
   background-color: ${colors[answers.color].wrapperBackground};
   padding-top: 100px;
   }
   .wrapper2 {
    background-color: ${colors[answers.color].wrapperBackground};
    padding-top: 100px;
    height: 340px;
    }
   body {
   background-color: white;
   -webkit-print-color-adjust: exact !important;
   font-family: 'Cabin', sans-serif;
   }
   main {
   background-color: #E9EDEE;
   height: auto;
   padding-top: 30px;
   }
   h1, h2, h3, h4, h5, h6 {
   font-family: 'BioRhyme', serif;
   margin: 0;
   }
   h1 {
   font-size: 3em;
   }
   h2 {
   font-size: 2.5em;
   }
   h3 {
   font-size: 2em;
   }
   h4 {
   font-size: 1.5em;
   }
   h5 {
   font-size: 1.3em;
   }
   h6 {
   font-size: 1.2em;
   }
   .photo-header {
   position: relative;
   margin: 0 auto;
   margin-bottom: -50px;
   display: flex;
   justify-content: center;
   flex-wrap: wrap;
   background-color: ${colors[answers.color].headerBackground};
   color: ${colors[answers.color].headerColor};
   padding: 10px;
   width: 95%;
   border-radius: 6px;
   }
   .photo-header img {
   width: 250px;
   height: 250px;
   border-radius: 50%;
   object-fit: cover;
   margin-top: -75px;
   border: 6px solid ${colors[answers.color].photoBorderColor};
   box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
   }
   .photo-header h1, .photo-header h2 {
   width: 100%;
   text-align: center;
   }
   .photo-header h1 {
   margin-top: 10px;
   }
   .links-nav {
   width: 100%;
   text-align: center;
   padding: 20px 0;
   font-size: 1.1em;
   }
   .nav-link {
   display: inline-block;
   margin: 5px 10px;
   }
   .workExp-date {
   font-style: italic;
   font-size: .7em;
   text-align: right;
   margin-top: 10px;
   }
   .container {
   }
   .row {
     display: flex;
     flex-wrap: wrap;
     justify-content: space-between;
     margin-top: 20px;
     margin-bottom: 20px;
   }
   .card {
     padding: 20px;
     border-radius: 6px;
     background-color: ${colors[answers.color].headerBackground};
     color: ${colors[answers.color].headerColor};
     margin: 20px;
     width: 36%;
     height: 100px;
   }
   .col {
   flex: 1;
   text-align: center;
   }
   .smallHeader {
     text-align: center;
   }
   .big {
    font-size: 2.0em;
   }
   a, a:hover {
   text-decoration: none;
   color: inherit;
   font-weight: bold;
   }
   @media print { 
    body { 
      zoom: .75; 
    } 
   }
  </style>
  <body>
  <div class="container">
  <div class="wrapper">
  <div class="photo-header">
  <div class="links-nav">
      <img src="${answers.gitPic}" width="250px" height="250px"/>
      <h1 class="name">Hi! My name is ${answers.name}</h1>
      <h3 class="links-nav">I am from ${answers.location}.</=h3>
      <h3 class="from smallHeader">Github: ${answers.giturl}.</h3>
    <span class="nav-link links-nav">
      <p class="github">My GitHub username is ${answers.github}</p>
      <p class="linked">LinkedIn: ${answers.linkedin}</p>
      <div class="links-nav">
      <a href="https://github.com/${answers.github}">
          <img src="data:image/png;base64,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" style="height: 50px;width: 100px;padding: 0px;"> 
      </a>
      <a href="${answers.linkedin}"> 
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR8AAACvCAMAAADzNCq+AAAA3lBMVEX///8AAAABd7X8/Px5eXmHh4f+//0AeLQAbrK40OOLs9T29vZpaWkAdrWZmZnk7PJZWVkAarAEdbfX19fu8/aNjY3o6Oi1tbXv7+/Nzc3f398dHR1yo8v+/fqBgYFPT0++vr4Aea9hYWGhoaEeHh4WFhZBQUEAabSpqanDw8MAcq5ycnIAcbw3NzcqKiqgv9jf7fFbqc8AZ6kAgbGmz+IigLo/jL/C3e6BtNP4//eexeyUwNva7fv0/v9Ql8S02Odpqcxmmsxil857td4ghMPR6PF0ocbE1+Q+mczQ7PzMospRAAAGpUlEQVR4nO2aDVfiOBSGQ6NNxxKVoIWiVYqCil+Miso6zurO1+7//0N7b1qgQFFmz8yxrO8zStOQdtrn3NwkrUIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb4r8BS1sGylcEUn5KLY2xvQ2JuDdRU5XQPIum+ukXMCQlLaJjFzp9j5eVa6uTMXz+GcCr3t0dH3zq6/8NyBnd3IcyMzvQmeVLgXRpedoYxztOI4xRjljlNKGPuTCJ3wrZG559qoTOYvdDbVyXfaz1tXaKGO0juOuM4EiQ/qq/jPOC0E9CHgzfc1yavs6LHNNKxLTv+1rKrCSEdp0KbKOCq8mrBHpVXLmqJbbneO8htzuZLFz+sfUNqQYEmtdip3bu97dR0+PcOyHw8q8wvs5LRF+uiNFsMn7J5lENLwDrt9f7JwBt93jI9fOtO5/E5Hbu3aUGXct/qROpyuF97OS9UNRwrulFhfl6MPC9ZtTB8+5uzq3XeXSWsVx7uVADMQfXSf1Y6hfEbZc/PiZ9tMe+RmS3sKMn0xGkpN1wdiPis29/zh4FA/dOJ7IznazZPEjRX2f95s5oZEXPyKZEk2TjR+l+59EJB5vu8P+xWrUsvoRjVapU8trOMdPHpn46VKW+fznp7snTw2nP7Z7pZ1tufzYniL9id4y2snxM2+anYmfWMfq7Dq+9hSVyAsNXkYrHtqX0A/TqBIUAvRZF/XwuNzaPrETopGferWatKFSbbV1WqsOD28c7B8ebq5XM37OyMjn5+fn75SV/3re3e3r/u6X+/unz46mOdDy5WfR4n0h1umz1ijb0ax0zjISP1L4SeWqkGH6dWmlag8Nz5Pd9nq2fylvi0sV5fH/cvvxzirpPRhK3Wr5/JTHflb20/svteTYz2qiRIrjneHXpU6VvggvSlkSP7To8ja4VHG8rciNvmzRwlXQwl5+MbFZwv6V8TOmXRv1r3SCFIgw+cbOB0qn1BfLE4fk+RGDgaR1WSTcgRB3X5VZvvnhlJ+L/aTPbA/9hDZo9gMhWczOarW+bcPmRJwkB5RPN+f6obmAdB+/fdsSbuT6z7SAX+r+RVrCoHqe8dNKpkdtyjdNLuzxEbbpqdyz4pqUtWtz4ydyRe+p33/YklEkvjvL7uecr34946djW5eaabu2HdgCdnbhcxgdNu05TuflH4qfe8+Y/l3kSrGrzBKsT1/yc8AVQcZPaaRH2EA63GFspR3Ty8mJGnP7VxR97TrKuYmoZpfGtkpmkVdMVS/5aXLFjB8e7aU4n8zGiZ+95Cbrc/zwUzNDEx/nxhVjP1OLt4Ix6UdO+GlwVdbPYcdGCd9IJ9+PZV78sIGKY5S55Jpx/BSZl+Jnxs9mknrXqZpHqXZoZ9INnnP79nubkMT23PihrbZ+5ISfvEVuQbB+Ar+e8JqfpHkpFOJglKBEjdezvk1I62y6Wsrzk86jPfLjTfjxfT/3yorBykQvedVPMtx3giTH7BxQ8By0S3t1Ia2w0mYYHrQzfnQ2fviJvad1TH6EO/TTaNaajYImHzHl5+JVP+LYNlzx0xnSeccK22yIxlRGGsaPk/rRNL7TzLlCy/fUj1Hkp34SBuFJ/S0VvMjP+pGJhtrUeqKa9jhLu2z98PPnrlZHG64c9i93UNGxqlza8cv6aVRr60EYFDZ+TrN3eTixfs/4WR0/nw/aqRC5fTj00bIL+Fq6QG0f8NrMjmVrxlFHPZ7tpOt3jh/jXVIkiaeuYyoiCGt+M+S8XkxDx3sZtpP9FVo+8MaORvUVKlIG5g3nY9nkki2G2+X98055zz5vpNurr++1Nk+3Q1Fd4UM4fjxHmZsfhKe9D3arHGO+c+mz5vgRYbURhsV081+QE0W/EVbraTmZGgZ+dj7M+cd4RFfFmjaVLg1osaP5dfyZE6sjWnE0wsbUq5JCMfN+efpip9/PZ140D98r8r/MTNhuOcWItQq/ZKcYUtoYyjxG89Pn2D5d1Y4azQ8L6iaPzEPnPFNy6i38xF90yMzRbvL+NFb8rlSRIatFKc0P6nVsHAojbeTC7/T/b0SuG7m9v6+oV9keNgPVqoe3vsq3Q9rX+f98eIkfRZ45/2ZsQuJxPE1FM+TXvhuofwnJfYx/ZokG/CdU79iRy88IXZHYyPme7ETR+0zNCW4k+VXOnGcXZEe86/h5DXYDPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAED8C239gEeKDLxbAAAAAElFTkSuQmCC" style="height: 50px;width: 100px;padding: 0px;">
      </a>
      </div>
    </span>
  </div>
  </div>
  </div>
  <main>
  <div class="row">
  <div class="col">
      <p class="smallHeader big">I love to build things and teaching people how to code.</p>
      <div class="card nav-link big">Public Repositories ${answers.gitRepo} </div>
      <div class="card nav-link big">Followers ${answers.gitFollowing} </div>
      <div class="card nav-link big">Public Gists ${answers.gitgists} </div>
      <div class="card nav-link big">Following ${answers.gitFollowing} </div>
    </div>
  </div><br><br>
  </main>
  <div class="wrapper2">
  </div>
  </div>
</body>
  </html>`
}
promptUser()
  .then(function(answers) {
    return axios.get(`https://api.github.com/users/${answers.github}`)
      .then(function (res) {
        console.log(res.data);
        answers.gitPic = res.data.avatar_url;
        answers.giturl = res.data.html_url;
        answers.gitFollow = res.data.followers;
        answers.gitFollowing = res.data.following;
        answers.gitRepo = res.data.public_repos;
        answers.gitgists = res.data.public_gists;
        return generateHTML(answers);
      })
  })
  .then(function (html) {
    return new Promise((resolve, reject)=>{
      pdf.create(html.toString(), options).toFile('./profile.pdf', function(err, res) {
        if (err) return reject(err);
        resolve(res);
      })
    });    
  }).then(console.log)
  .catch(function(err) {
    console.log(err);
  });