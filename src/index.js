const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require('connect-flash');



// Initializations 
const app = express();

// Settings
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

// Middlewarea

app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Global Variables

app.use((req, res, next) =>{
    app.locals.success = req.flash('success');
    next();
});

// Routes

app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use(require('./routes/ejercicios'));

// Public

app.use(express.static(path.join(__dirname, 'public')));

// Starting the Server

app.listen(app.get('port'), () =>{
    console.log('Server RUN! on port', app.get('port'));
});

