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
const bodyParser = require('body-parser');


app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'absolete',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
// profile route
// app.get('/profile', (req, res) => {
//     res.render("index.ejs", {
//         type: req.user.type,
//         email: req.user.email,
//         fname: req.user.fname,
//         lname: req.user.lname,
//         adress: req.user.adress,
//         facebook: req.user.facebook,
//         linkedin: req.user.linkedin,
//         instgram: req.user.instgram,
//         github: req.user.github,
//         picture: req.user.picture
//     })
// });
// visitors page route
app.get('/', (req, res) => {
    res.render("visitors.ejs")
});
// sign in route
app.get('/login', (req, res) => {
    res.render("login.ejs")
});
// sign up route
app.get('/signup', (req, res) => {
    res.render("signup.ejs")
});
// patient window route
app.get('/patient', (req, res) => {
    res.render("patient.ejs")
});
// radiologist window route
app.get('/radiologist', (req, res) => {
    res.render("radiologist.ejs", {
        type: req.user.type,
        email: req.user.email,
        fname: req.user.fname,
        lname: req.user.lname,
        address: req.user.address,
        age: req.user.age,
        sex: req.user.sex,
        phone_no: req.user.phone_no,
        salary: req.user.salary,
        start_shift: req.user.start_shift,
        end_shift: req.user.end_shift,
        password: req.user.password,
        picture: req.user.picture
    })
});

// admin home window route
app.get('/admin', (req, res) => {
    res.render("admin.ejs")
});
// engineers_admin window route
app.get('/engineers_admin', (req, res) => {
    res.render("engineers_admin.ejs")
});
// doctors_admin window route
app.get('/doctors_admin', (req, res) => {
    res.render("doctors_admin.ejs")
});
// radiologists_admin window route
app.get('/radiologists_admin', (req, res) => {
    res.render("radiologists_admin.ejs")
});
// add_radiologist window route
app.get('/add_radiologist', (req, res) => {
    res.render("add_radiologist.ejs")
});
// add_doctor window route
app.get('/add_doctor', (req, res) => {
    res.render("add_doctor.ejs")
});
// form window route
app.get('/forms', (req, res) => {
    res.render("forms.ejs")
});
app.get('/patient_report', (req, res) => {
    res.render("patient_report.ejs")
});
app.get('/doctor', (req, res) => {
    res.render("doctor.ejs")
});

// POST request of radiologist profile
app.post("/rad_profile", async (req, res) => {
    let { email, fullName, address, age, sex, phone_no, salary, start_shift, end_shift, password, picture } = req.body;
    console.log({
        fullName,
        email,
        age,
        picture
    });

    age = parseInt(age)
    salary = parseInt(salary)
    phone_no = parseInt(phone_no)
    start_shift = parseInt(start_shift)
    end_shift = parseInt(end_shift)
    if (isNaN(age)) {
        age = null;
    }
    if (isNaN(salary)) {
        salary = null;
    }
    if (isNaN(phone_no)) {
        phone_no = null;
    }
    if (isNaN(start_shift)) {
        start_shift = null;
    }
    if (isNaN(end_shift)) {
        end_shift = null;
    }

    let nameParts = fullName.split(' ');
    let fname = '';
    let lname = '';
    if (nameParts.length > 0) { fname = nameParts[0]; }
    if (nameParts.length > 1) { lname = nameParts[1]; }
    console.log("pass: ", password);
    let hashedPassword = '';

    if (password === '') {
        const oldPasswordResult = await pool.query(`SELECT password FROM users WHERE users.id = $1`, [req.user.id]);
        hashedPassword = oldPasswordResult.rows[0].password;
    } else {
        hashedPassword = await bcrypt.hash(password, 10);
    }
    pool.query(`UPDATE users SET fname=$1, lname=$2, email=$3, address=$4, age=$5, sex=$6, phone_no=$7, password=$8,  picture=$9 WHERE users.id = $10`,
        [fname, lname, email, address, age, sex, phone_no, hashedPassword, picture, req.user.id],
        (err) => {
            if (err) {
                throw err;
            }
            else {
                pool.query(
                    `UPDATE radiologist SET salary=$1, start_shift=$2, end_shift=$3 WHERE radiologist_id = $4`,
                    [salary, start_shift, end_shift, req.user.id],
                    (err) => {
                        if (err) {
                            throw err;
                        }
                        res.redirect('back')
                    }
                );
            }
        }
    );
});

// POST request when a user sign up
app.post("/signup", async (req, res) => {
    let { fname, lname, email, password, confirm_password } = req.body;
    let type = 'patient'
    console.log({
        fname,
        lname,
        email,
        password,
        confirm_password,
        type
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
        console.log(hashedPassword);
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
                        `INSERT INTO users (email, fname, lname, password,type)
                        VALUES($1, $2, $3, $4,$5)
                        RETURNING id, password`,
                        [email, fname, lname, hashedPassword, type],
                        (err, results) => {
                            if (err) {
                                throw err;
                            } else {
                                const userId = results.rows[0].id;
                                pool.query(
                                    `INSERT INTO patient (patient_id) VALUES ($1)`,
                                    [userId],
                                    (err, result) => {
                                        if (err) {
                                            console.error('Error executing second query', err.stack);
                                        } else {
                                            req.flash("success_msg", "you are now registered. please log in");
                                            res.redirect("/login");
                                        }
                                    }
                                );
                            }
                        }
                    )
                }
            }
        );
    }
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true
}), (req, res) => {
    if (req.user.type === 'admin') {
        res.redirect('/admin');
    } else if (req.user.type === 'doctor') {
        res.redirect('/doctor');
    }
    else if (req.user.type === 'patient') {
        res.redirect('/patient');
    }
    else if (req.user.type === 'radiologist') {
        res.redirect('/radiologist');
    }
    else {
        res.redirect('/login');
    }
});
app.listen(PORT);
app.use(express.static('public'));