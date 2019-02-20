const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
// const http = require('http');
require('locus');

/* initialize Express and necessary tools */
const app = express();

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

/* change how json stringifies */
app.set('json replacer', '---'); // property transformation rules
app.set('json spaces', 4); 

/* Fix CORS */
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'x-auth-token,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/search', (req, res) => {
  console.log('in the api: ');
  
  let term = encodeURI('term=' + req.body.term);
  
  axios.get('https://itunes.apple.com/search?' + term)
  .then(function (response) {
    // handle success
    // console.log("search: ", response.data);
    
    let data = {
      count: response.data.resultCount,
      kinds: {}
    };
    
    response.data.results.forEach((el, i)=> {
      let obj = {
        id: el.trackId,
        kind: el.kind,
        artistName: el.artistName,
        trackName: el.trackName,
        collectionName: el.collectionName,
        artistViewUrl: el.artistViewUrl,
        primaryGenreName: el.primaryGenreName,
        contentAdvisoryRating: el.contentAdvisoryRating,
        trackExplicitness: el.trackExplicitness,
        trackTimeMillis: el.trackTimeMillis,
        releaseDate: el.releaseDate,
        trackViewUrl: el.trackViewUrl,
        previewUrl: el.previewUrl,
        artworkUrl100: el.artworkUrl100
      };
      
      if (!data.kinds[obj.kind]) data.kinds[obj.kind] = [];

      data.kinds[obj.kind].push(obj);
    });
    
    // let data_s = JSON.stringify(data);
    // eval(locus);
    res.send(data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
});

const port = 3002;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = server;