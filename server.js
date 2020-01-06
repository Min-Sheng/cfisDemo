var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const axios = require('axios');


const { execSync } = require('child_process');
var databaseDir = path.join(__dirname,'public/');
// fs.readdir(databaseDir, function (err, files) {
//     //handling error
//     if (err) {
//         return console.log('Unable to scan directory: ' + err);
//     } 
//     //listing all files using forEach
//     files.forEach(function (file) {
//         // Do whatever you want to do with the file
//         console.log(file); 
//     });
//     return files;
// });

app.use(express.static(databaseDir));
app.use(express.static(path.join(__dirname, 'build')));
app.use(cors())
app.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploaded_imgs')
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' +file.originalname )
    cb(null, file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file');

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })
});
// Handle the fast comparisons
app.post('/comparison',function(req, res) {
  console.log(">>>>> In fast comparison");
  let reqJson = req.body; 
  let uploadedFilename = reqJson.uploadedFilename;
  let filesToCompare = reqJson.filesToCompare;
  console.log(uploadedFilename);
  console.log(filesToCompare);
  filesToCompare = filesToCompare.map((filename)=>
    path.join(databaseDir, "database", filename));
  uploadedFilename = path.join(databaseDir, "uploaded_imgs", uploadedFilename);

  axios.post('http://localhost:5901', {
    params: {
      uploadedFilename: uploadedFilename,
      filesToCompare: filesToCompare,
    }
  })
  .then(response => {
    let file2scores = response.data;
    res.send(file2scores);
  })
  .catch(error => {
    console.log(error);
    console.log('EEEEEEEEEEEEEEEEEE');
  });
});
app.get('/image_list',function(req, res) {
    console.log(databaseDir);
    var filenames = fs.readdirSync(path.join(databaseDir, "database"));
    res.send(filenames);
});
app.get('/comparison',function(req, res) {
  var uploadedFilename = req.query.uploadedFilename;
  var galleryFilename = req.query.galleryFilename;
  console.log(uploadedFilename);
  console.log(galleryFilename);
  var result_file = uploadedFilename.split('.').slice(0, -1).join('.') +"_" + galleryFilename;
  console.log(result_file)
  galleryFilename = path.join(databaseDir, "database", galleryFilename);
  uploadedFilename = path.join(databaseDir, "uploaded_imgs", uploadedFilename);

  console.log(uploadedFilename);
  console.log(galleryFilename);
  axios.get('http://localhost:5901', {
    params: {
      uploadedFilename: uploadedFilename,
      galleryFilename: galleryFilename,
      result_file: result_file
    }
  })
  .then(response => {
    let result_file_base64_string = response.data.result_base64
    
    // Get the score text
    var score_file = result_file.replace(/\.[^/.]+$/, "") + ".txt"
    score_file = path.join(databaseDir, "results", score_file);
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(score_file),
    });
    var lineCounter = 0; var wantedLines = [];
    lineReader.on('line', function (line) {
      lineCounter++;
      wantedLines.push(line);
      if(lineCounter === 1){lineReader.close();}
    });
    lineReader.on('close', function() {
      console.log(wantedLines);
      // process.exit(0);
      var score = wantedLines[0];
      res.send([result_file, score, result_file_base64_string]);
    });
  
  })
  .catch(error => {
    console.log(error);
    console.log('LLLLLLLLLLLLLLLLLLLLLL');
  });
  // stderr is sent to stderr of parent process
  // you can set options.stdio if you want it to go elsewhere
  
  // let stdout = execSync("bash compare.sh " + uploadedFilename + " " + galleryFilename + " " + result_file, {stdio: 'inherit'} )
 
});

app.listen(8000, function() {

    console.log('App running on port 8000');

});