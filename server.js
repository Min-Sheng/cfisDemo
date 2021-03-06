const express = require('express');
const app = express();
const multer = require('multer')
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const axios = require('axios');


const { execSync } = require('child_process');
const databaseDir = path.join(__dirname,'public/');
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploaded_imgs');
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' +file.originalname )
    cb(null, file.originalname);
  }
})

const upload = multer({
              storage: storage,
              limits:{
                fileSize:1024*1024*100,
              },
              fileFilter: function (req, file, cb) {
                checkFileType(file, cb);
              }
            }).array('file', 25);

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
      return cb(null, true);
  } else {
      cb('Error: Images Only!');
  }
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/upload', function(req, res) {
     
    upload(req, res, function (err) {
      if (err) {
        res.status(500).json(err);
        console.log("Please upload the file smaller than 100M");
      } else {
        //console.log(req.files[0]);
        const filename = path.parse(req.files[0].originalname).name;
        const groupName = (filename.slice(filename.length - 3) === "-q0") ? filename.slice(0, filename.length - 3): filename;
        console.log(groupName);
        const mkdirsync = 'public/uploaded_imgs/' + groupName + '/';
        function mkdirpath(mkdirsync) {
          if (!fs.existsSync(mkdirsync)) {
              try {
                  fs.mkdirSync(mkdirsync);
              }
              catch (e) {
                  mkdirpath(path.dirname(mkdirsync));
                  mkdirpath(mkdirsync);
              }
            }
          }
        mkdirpath(mkdirsync);
        let sourceFile, destFile;
        for (let i = 0; i < req.files.length; i++) {
          sourceFile = './public/uploaded_imgs/' + req.files[i].originalname;
          destFile = mkdirsync + req.files[i].originalname;
          fs.rename(sourceFile, destFile, function (err) {
              if (err) console.log(`ERROR: ${err}`);
          });
          //console.log(req.files[i]);
        }
        res.send("All files are uploaded");
        }
    })
    /*upload(req, res, function (err) {
          if (err instanceof multer.MulterError) {
              res.status(500).json(err);
          } else if (err) {
              res.status(500).json(err);
          } else {
            // Create folder path
            console.log(req.file);
            const groupName = path.parse(req.file.originalname).name;
            const mkdirsync = 'public/uploaded_imgs/' + groupName + '/';
            function mkdirpath(mkdirsync) {
              if (!fs.existsSync(mkdirsync)) {
                  try {
                      fs.mkdirSync(mkdirsync);
                  }
                  catch (e) {
                      mkdirpath(path.dirname(mkdirsync));
                      mkdirpath(mkdirsync);
                  }
                }
              }
            mkdirpath(mkdirsync);
            ley sourceFile = './public/uploaded_imgs/' + req.file.originalname;
            let destFile = mkdirsync + req.file.originalname;
            fs.rename(sourceFile, destFile, function (err) {
                if (err) console.log(`ERROR: ${err}`);
            });
            //console.log(req.file);
            res.status(200).send(req.file);
          }
    })*/
});
/*app.get('/inference',function(req, res) {
  const uploadedFilename = req.query.uploadedFilename;
  const fileFromDB = req.query.fileFromDB;
  const croppedFileNumber = req.query.croppedFileNumber;

  console.log(uploadedFilename);
  console.log(fileFromDB);
  console.log(croppedFileNumber);
  res.send("The information of files is received.");

  axios.post('http://localhost:5901', {
    params: {
      uploadedFilename: uploadedFilename,
      fileFromDB: fileFromDB,
      croppedFileNumber: croppedFileNumber,
    }
  })
  .then(response => {
    const result = response.data;
    console.log(result);
  })
  .catch(error => {
    console.log(error);
    console.log('EEEEEEEEEEEEEEEEEE');
  });
});*/
app.post('/inference', function(req, res) {
  const reqJson = req.body;
  const uploadedFilename = reqJson.uploadedFilename;
  const fileFromDB = reqJson.fileFromDB;
  const croppedFileNumber = reqJson.croppedFileNumber;
  
  //console.log(uploadedFilename);
  //console.log(fileFromDB);
  //console.log(croppedFileNumber);
  //res.send("The information of files is received.");

  axios.post('http://localhost:5901', {
    params: {
      uploadedFilename: uploadedFilename,
      fileFromDB: fileFromDB,
      croppedFileNumber: croppedFileNumber,
    }
  })
  .then(response => {
    const result_file_base64_string = response.data.result_base64;
    res.send(result_file_base64_string);
  })
  .catch(error => {
    console.log(error);
    console.log('EEEEEEEEEEEEEEEEEE');
  });
});
// Handle the fast comparisons
/*app.post('/comparison',function(req, res) {
  console.log(">>>>> In fast comparison");
  const reqJson = req.body; 
  const uploadedFilename = reqJson.uploadedFilename;
  const filesToCompare = reqJson.filesToCompare;
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
    const file2scores = response.data;
    res.send(file2scores);
  })
  .catch(error => {
    console.log(error);
    console.log('EEEEEEEEEEEEEEEEEE');
  });
});*/
app.get('/image_list',function(req, res) {
    console.log(databaseDir);
    const filenames = fs.readdirSync(path.join(databaseDir, "database"));
    res.send(filenames);
});
/*app.get('/comparison',function(req, res) {
  const uploadedFilename = req.query.uploadedFilename;
  const galleryFilename = req.query.galleryFilename;
  console.log(uploadedFilename);
  console.log(galleryFilename);
  const result_file = uploadedFilename.split('.').slice(0, -1).join('.') +"_" + galleryFilename;
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
    const result_file_base64_string = response.data.result_base64
    
    // Get the score text
    const score_file = result_file.replace(/\.[^/.]+$/, "") + ".txt"
    score_file = path.join(databaseDir, "results", score_file);
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(score_file),
    });
    let lineCounter = 0; let wantedLines = [];
    lineReader.on('line', function (line) {
      lineCounter++;
      wantedLines.push(line);
      if(lineCounter === 1){lineReader.close();}
    });
    lineReader.on('close', function() {
      console.log(wantedLines);
      // process.exit(0);
      const score = wantedLines[0];
      res.send([result_file, score, result_file_base64_string]);
    });
  
  })
  .catch(error => {
    console.log(error);
    console.log('LLLLLLLLLLLLLLLLLLLLLL');
  });
  // stderr is sent to stderr of parent process
  // you can set options.stdio if you want it to go elsewhere
  
  // const stdout = execSync("bash compare.sh " + uploadedFilename + " " + galleryFilename + " " + result_file, {stdio: 'inherit'} )
 
});*/

app.listen(8000, function() {

    console.log('App running on port 8000');

});