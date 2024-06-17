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
const path = require('path');
const ROOT_DIR = path.resolve(__dirname);

app.set('view engine', 'ejs');
app.set('views', path.join(ROOT_DIR, 'views'));


app.use(express.urlencoded({ extended: true }));
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
app.get('/profile', (req, res) => {
    res.render("index.ejs", {
        type: req.user.type,
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
    const patientScans = req.session.patient || [];
    res.render("patient.ejs",{
        // job: patient.type,
        // email: patient.email,
        // fname: patient.fname,
        // adress: patient.adress,
        // picture: patient.picture,
        scans: patientScans
    })
});
// radiologist window route
app.get('/radiologist', (req, res) => {
    res.render("radiologist.ejs")
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
app.get('/forms', async(req, res) => {
    try{
        const result = await pool.query('SELECT * FROM forms');
        const forms = result.rows;
        res.render('forms', { forms });
        }catch(err){
            throw(err)
        }
});
app.get('/patient_report', (req, res) => {
    const { scan_id, pic_index } = req.query;
    pool.query(
        'SELECT scans.scan_pics, reports.case_description FROM scans JOIN reports ON scans.scan_id = reports.scan_id WHERE scans.scan_id = $1',
        [scan_id],
        (err, result) => {
        
        if (result.rows.length > 0) {
            const scanPics = result.rows[0].scan_pics;
            const caseDescriptions = result.rows[0].case_description;
            const selectedPic = scanPics[pic_index];
            const selectedReport = caseDescriptions[pic_index];
            res.render('patient_report', { selectedPic, selectedReport });
}else{
    throw(err)
}
})
});
app.get('/doctor_scan',async (req, res) => {
    const { scan_id, pic_index } = req.query;
    const result = await pool.query(
        'SELECT scan_pics FROM scans WHERE scan_id = $1',
        [scan_id]);
        if (result.rows.length > 0) {
            const scanPics = result.rows[0].scan_pics;
            const selectedPic = scanPics[pic_index];
            console.log(selectedPic)
            res.render('doctor_scan', { selectedPic });
        } else {
            res.status(404).send('Scan not found');
        }
    
});
app.get('/doctor', (req, res) => {
    const user = req.session.user;
    const scans = req.session.doctorScans;
    // const formEmail = req.session.formEmail;
        res.render("doctor.ejs",{
            job: user.type,
            email: user.email,
            fname: user.fname,
            adress: user.adress,
            picture: user.picture,
            salary: user.salary,
            age: user.age,
            ass_name: user.ass_name,
            phone_no: user.phone_no,
            dr_room: user.dr_room,
            special: user.special,
            start_time: user.start_time,
            end_time: user.end_time,
            scans: scans,
            // formEmail : formEmail
        })
    });
    app.post("/contact_form", async(req, res) =>{
        const{user_email, why, body}=req.body;
    console.log(user_email)
    console.log(why)
    console.log(body)
    pool.query(
        'insert into forms (user_email, about, body) values($1,$2,$3)',
        [user_email,why,body],
        (err, contact_form_res) => {
            if (err) {
                throw err;
            }
        
        }

    )
            // req.session.formEmail = res.rows[0];
            // console.log(req.session.formEmail)
        
    });

    app.post("/update", async(req, res) =>{
        const{fname, email, adress, job, salary, age, ass_name, phone_no, special, dr_room, start_time ,end_time, picture2}= req.body;
        let newage = parseInt(age)
        let newsalary = parseInt(salary)
        let newphone_no = parseInt(phone_no)
        let newdr_room = parseInt(dr_room)
        const userId = req.user.id;
        pool.query(
            'update users set fname=$1 , email=$2 , adress=$3 , picture=$4 where id=$5',
            [fname, email, adress, picture2 ,userId],
            (err) =>{
                if(err){
                    throw err;
                }});
    
        pool.query(
            'update doctors set job=$1 , salary=$2 , age=$3 , ass_name=$4, phone_no=$5, special=$6, dr_room=$7, start_time=$8, end_time=$9 where doctor_id=$10',
            [job, newsalary, newage, ass_name, newphone_no, special, newdr_room, start_time, end_time, userId],
            (err) =>{
                    if(err){
                        throw err;
                    }});
    
                        const user = req.session.user;
                        user.type = job,
                        user.email = email,
                        user.fname = fname,
                        user.adress = adress,
                        user.picture = picture2,
                        user.salary = salary,
                        user.age = age,
                        user.ass_name = ass_name,
                        user.phone_no = phone_no,
                        user.dr_room = dr_room,
                        user.special = special,
                        user.start_time = start_time,
                        user.end_time = end_time
                        res.redirect('/doctor');
                    });
    
                    app.post("/write_report",async(req,res)=>{
                        const { scan_id, dr_id, picIndex, report } = req.body;
                    
                        try {
                            const result = await pool.query(
                                'SELECT case_description FROM reports WHERE scan_id = $1 AND dr_id = $2',
                                [scan_id, dr_id]
                            );
                    
                            let caseDescriptions = result.rows.length ? result.rows[0].case_description : [];
                            console.log(caseDescriptions)
                    
                            // Ensure the caseDescriptions array is long enough
                            while (caseDescriptions.length <= picIndex) {
                                caseDescriptions.push(null);
                            }
                            console.log(picIndex)
                            console.log(dr_id)
                            console.log(scan_id)
                
                    
                            // Update the report at the specific index
                            caseDescriptions[picIndex] = report;
                    
                            if (result.rows.length) {
                                // Update existing report
                                await pool.query(
                                    'UPDATE reports SET case_description = $1 WHERE scan_id = $2 AND dr_id = $3',
                                    [caseDescriptions, scan_id, dr_id]
                                );
                            console.log(caseDescriptions)
                
                            } else {
                                // Insert new report
                                await pool.query(
                                    'INSERT INTO reports (scan_id, dr_id, case_description) VALUES ($1, $2, $3)',
                                    [scan_id, dr_id, caseDescriptions]
                                );
                            console.log(caseDescriptions)
                
                            }
                    
                            res.redirect('/doctor');
                        } catch (err) {
                            console.error('Error during report submission:', err);
                            res.status(500).send('Server error');
                        }
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

    if (!fname || !lname || !email || !password || !confirm_password || !type) {
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
                        `INSERT INTO users (fname, lname, email, password,type)
                        VALUES($1, $2, $3, $4,$5)
                        RETURNING id, password`,
                        [fname, lname, email, hashedPassword, type],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                            req.flash("success_msg", "you are now registered. please log in");
                            res.redirect("/login");
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
    const userId = req.user.id;
    pool.query(
        'select users.* , doctors.* from users join doctors on users.id = doctors.doctor_id where users.id=$1', 
        [userId],
        (err,results) => {
            if(err){
                throw err;
            }
            const user = results.rows[0];
            req.session.user = user;

            pool.query(
                'SELECT * FROM scans WHERE dr_id = $1',
                [userId],
                (err, scanResults) => {
                    if (err) {
                        throw err;
                    }
                    req.session.doctorScans = scanResults.rows;
                    console.log(req.session.doctorScans)
                    pool.query(
                        `SELECT users.*, patients.*, scans.*, reports.*
                         FROM users
                        JOIN patients ON users.id = patients.patient_id
                        JOIN scans ON patients.patient_id = scans.patient_id
                        JOIN reports ON scans.scan_id = reports.scan_id
                         WHERE users.id = $1`,
                        [userId],
                        (err, results) => {
                            if (err) {
                                throw err;
                            }
                
                            req.session.patient = results.rows[0];
                            console.log(req.session.patient);
    
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
    }
    );
});
});
});

app.listen(PORT);
app.use(express.static('public'));