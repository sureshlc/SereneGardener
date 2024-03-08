var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer'); // Import multer for handling file uploads
const OpenAI = require("openai");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Set up multer to handle file uploads
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Set upload destination
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Set unique filename
  }
});

var upload = multer({ storage: storage });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Handle form submission
app.post('/discover', upload.single('file'), async function (req, res, next) {
  // Handle the form submission and file upload here
  const options = req.body.options; // Get selected options from the form
  const file = req.body.file; // Uploaded file

  // Process the uploaded file and options here (e.g., generate AI-generated image)
  // For example:
  // Call a function to generate AI-generated image passing options and file
  const aiGeneratedImage = await generateAIGeneratedImage(options, file);

  // Then send the response back to the client
  res.redirect(aiGeneratedImage);
});

// Import any required libraries or modules here

// Define the function to generate the AI-generated image
async function generateAIGeneratedImage(options, file) {
  const openai = new OpenAI({apiKey: "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"});

  // Replace with your desired prompt and other options
  const num_images = 1;
  
  // For demonstration purposes, let's just return a message with the options and filename
  const generatedImage = `AI-generated image created with options: ${options} and file: ${file}`;
 
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: options.toString(),
      n: num_images,
      size: "1024x1024",
    });
    
    // Access generated image data from response.data[0].url
    console.log("Generated image URL:", response.data[0].url);
    return response.data[0].url;
    // You can also save the image to a file using libraries like fs
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
}

// Export the function to make it accessible from other modules
module.exports = {
  generateAIGeneratedImage
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
