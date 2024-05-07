//We utilized Node.js and Express to handle the backend functionalities,
//while HTML, CSS, and JavaScript were employed for the frontend development.
//Additionally, we integrated a PostgreSQL database to store user details such as:
//email, name, address, picture, and social media accounts.
//Users have the capability to modify all their information,
// and any changes made are reflected in the database.


// importing libraries
const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const initializePassport = require("./passportConfig");
initializePassport(passport);
const PORT = process.env.PORT || 4000;


app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'absolete',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// routes
// profile route
app.get('/profile', (req, res) => {
    res.render("index.ejs", {
        email: req.user.email,
        fname: req.user.fname,
        lname: req.user.lname,
        adress: req.user.adress,
        facebook: req.user.facebook,
        linkedin: req.user.linkedin,
        instgram: req.user.instgram,
        github: req.user.github,
        picture: req.user.picture
    })
});
// sign in route
app.get('/', (req, res) => {
    res.render("login.ejs")
});
// sign up route
app.get('/signup', (req, res) => {
    res.render("signup.ejs")
});
// edit window route
app.get('/edit', (req, res) => {
    res.render("edit.ejs")
});

// POST request when a user edit his/her information
app.post("/edit", async (req, res) => {
    let { fname, address, email, facebook, github, instgram, linkedin, picture } = req.body;
    pool.query(`UPDATE users SET fname=$1 , adress=$2 ,email = $3, facebook=$4, github=$5, instgram=$6, linkedin=$7, picture=$8 WHERE id=$9  `,
        [fname, address, email, facebook, github, instgram, linkedin, picture, req.user.id],
        (err) => {
            if (err) {
                throw err;
            }
            req.flash("success_msg", "your profile has been edited successfully.");
            res.redirect('back')
        }
    );
});

// POST request when a user sign up
app.post("/signup", async (req, res) => {
    let { fname, lname, email, password, confirm_password } = req.body;
    console.log({
        fname,
        lname,
        email,
        password,
        confirm_password
    });

    let errors = [];

    if (!fname || !lname || !email || !password || !confirm_password) {
        errors.push({ message: "Please Enter All Fields" });
    }

    if (password.length < 6) {
        errors.push({ message: "Password should be at least 6 characters" });
    }

    if (password != confirm_password) {
        errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        res.render("signup.ejs", { errors });
    } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        pool.query(
            `SELECT * FROM users
            WHERE email = $1`,
            [email],
            (err, results) => {
                if (err) {
                    throw err;
                }
                if (results.rows.length > 0) {
                    errors.push({ message: "Email already exists" });
                    res.render("signup.ejs", { errors });
                } else {
                    pool.query(
                        `INSERT INTO users (fname, lname, email, password)
                        VALUES($1, $2, $3, $4)
                        RETURNING id, password`,
                        [fname, lname, email, hashedPassword],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            req.flash("success_msg", "you are now registered. please log in");
                            res.redirect("/");
                        }
                    )
                }
            }
        );
    }
});

// POST request when a user logs in
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/",
        failureFlash: true
    }),
    async (req, res) => {
        pool.query(`SELECT * from users WHERE email = $1 `, req.user.email, (err, results) => {
            if (err) {
                throw err;
            }
            if (results.rows.length > 0) {
                let adress = pool.query(`SELECT adress from users WHERE email = $1 `, req.user.email)
                let facebook = pool.query(`SELECT facebook from users WHERE email = $1 `, req.user.email)
                let linkedin = pool.query(`SELECT linkedin from users WHERE email = $1 `, req.user.email)
                let instgram = pool.query(`SELECT instgram from users WHERE email = $1 `, req.user.email)
                let github = pool.query(`SELECT github from users WHERE email = $1 `, req.user.email)
            }
        })
    }
);


app.listen(PORT);
app.use(express.static('public'));