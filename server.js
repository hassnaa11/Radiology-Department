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
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported files type'), false);
    }
};

const upload = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 20
    // },
    fileFilter: fileFilter
}).array('scan_folder');


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
let msg = '';
let count = 0;
app.get('/radiologist', async (req, res) => {
    if (count == 1) {
        msg = '';
        count--;
    }
    if (msg != '') {
        count++;
    }
    let salary = await pool.query(
        'SELECT salary FROM radiologist WHERE radiologist_id = $1',
        [req.user.id]
    );
    let start_shift = await pool.query(
        'SELECT start_shift FROM radiologist WHERE radiologist_id = $1',
        [req.user.id]
    );
    let end_shift = await pool.query(
        'SELECT end_shift FROM radiologist WHERE radiologist_id = $1',
        [req.user.id]
    );
    salary = salary.rows[0].salary
    start_shift = start_shift.rows[0].start_shift
    end_shift = end_shift.rows[0].end_shift

    let patients_id = await pool.query(
        'SELECT patient_id FROM take_appointment WHERE radiologist_id = $1',
        [req.user.id]
    );
    let scans_type = await pool.query(
        'SELECT scan_type FROM take_appointment WHERE radiologist_id = $1 ',
        [req.user.id]
    );
    let scans_date = await pool.query(
        'SELECT scan_date FROM take_appointment WHERE radiologist_id = $1 ',
        [req.user.id]
    );
    let scans_id = await pool.query(
        'SELECT scan_id FROM take_appointment WHERE radiologist_id = $1 ',
        [req.user.id]
    );
    patients_id = patients_id.rows;
    scans_type = scans_type.rows;
    scans_date = scans_date.rows;
    scans_id = scans_id.rows;
    let num_of_appointments = patients_id.length;
    for (let i = num_of_appointments; i > 0; i--) {
        const now = new Date();
        if (now > scans_date[i - 1].scan_date) {
            pool.query(
                'INSERT INTO scans (scan_id, radiologist_id) ' +
                'SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM scans WHERE scan_id = $1)',
                [scans_id[i - 1].scan_id, req.user.id]);
        }
    }
    let scans_no = await pool.query(
        'SELECT scan_id FROM scans WHERE radiologist_id = $1 AND dr_id IS NULL',
        [req.user.id]
    );
    scans_no = scans_no.rows;
    console.log(scans_no);

    let scan_pics = await pool.query('SELECT scan_pics FROM scans WHERE radiologist_id = $1 AND dr_id IS NULL', [req.user.id]);
    scan_pics = scan_pics.rows;
    console.log(scan_pics.rows);

    res.render("radiologist.ejs", {
        type: req.user.type,
        email: req.user.email,
        fname: req.user.fname,
        lname: req.user.lname,
        address: req.user.address,
        age: req.user.age,
        sex: req.user.sex,
        phone_no: req.user.phone_no,
        salary,
        start_shift,
        end_shift,
        password: req.user.password,
        picture: req.user.picture,
        patients_id,
        scans_type,
        scans_date,
        scans_no,
        scan_pics,
        msg
    })
});
app.get('/radiologist_scan', async (req, res) => {
    let scan_pics = await pool.query('SELECT scan_pics FROM scans WHERE radiologist_id = $1 AND dr_id IS NULL', [req.user.id]);
    console.log(scan_pics.rows);
    scan_pics = scan_pics.rows;
    res.render("radiologist_scan.ejs", scan_pics)
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
app.get('/doctor_scan', (req, res) => {
    res.render("doctor_scan.ejs")
});
app.get('/doctor', (req, res) => {
    const user = req.session.user;
    const scans = req.session.doctorScans;
    res.render("doctor.ejs", {
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
        scans: scans
    })
});
app.post("/update", async (req, res) => {
    const { fname, email, adress, job, salary, age, ass_name, phone_no, special, dr_room, start_time, end_time, picture2 } = req.body;
    let newage = parseInt(age)
    let newsalary = parseInt(salary)
    let newphone_no = parseInt(phone_no)
    let newdr_room = parseInt(dr_room)
    const userId = req.user.id;
    pool.query(
        'update users set fname=$1 , email=$2 , adress=$3 , picture=$4 where id=$5',
        [fname, email, adress, picture2, userId],
        (err) => {
            if (err) {
                throw err;
            }
        });

    pool.query(
        'update doctors set job=$1 , salary=$2 , age=$3 , ass_name=$4, phone_no=$5, special=$6, dr_room=$7, start_time=$8, end_time=$9 where doctor_id=$10',
        [job, newsalary, newage, ass_name, newphone_no, special, newdr_room, start_time, end_time, userId],
        (err) => {
            if (err) {
                throw err;
            }
        });

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

app.post("/write_report", async (req, res) => {
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

app.post("/upload_scan", async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log("Upload error: ", err.message);
            return res.redirect('back');
        }
        let { scan_id } = req.body;
        console.log("scan_id:): ", scan_id);
        let scan_pics = [];
        let scans_no = await pool.query(
            'SELECT scan_id FROM scans WHERE radiologist_id = $1 AND dr_id IS NULL',
            [req.user.id]
        );
        scans_no = scans_no.rows
        console.log("scans_no:<< ", scans_no);
        let cond = false;
        for (let i = 0; i < scans_no.length; i++) {
            console.log("here: ");
            console.log(scans_no[i].scan_id);
            if (scan_id == scans_no[i].scan_id) {
                cond = true;
            }
        }
        if (!cond) {
            msg = 'Error: Incorrect Scan ID!';
        }

        req.files.forEach(file => {
            scan_pics.push(file.path);
        });
        console.log(scan_pics);
        pool.query(
            'UPDATE scans SET scan_pics = $1 WHERE scan_id = $2',
            [scan_pics, scan_id],
            (err) => {
                if (err) {
                    throw err;
                } else {
                    res.redirect('back');
                }
            }
        );
    })
});

app.post("/send_to_doctor", async (req, res) => {
    let { doc_email, scan_to_doc } = req.body;
    console.log({
        doc_email,
        scan_to_doc
    });
    let doc_id = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND type = $2 ',
        [doc_email, 'doctor']
    );
    let patient_id = await pool.query(
        'SELECT patient_id FROM take_appointment WHERE scan_id = $1 ',
        [scan_to_doc]
    );
    doc_id = doc_id.rows[0].id
    patient_id = patient_id.rows[0].patient_id
    console.log(doc_id, "  ", patient_id);
    pool.query(`UPDATE scans SET dr_id = $1, patient_id = $2 WHERE scan_id = $3`,
        [doc_id, patient_id, scan_to_doc], (err) => {
            if (err) {
                throw err;
            }
            res.redirect('back')
        }
    );
});

app.post("/rad_send_form", async (req, res) => {
    let { email, why, body } = req.body;
    console.log({
        email, why, body
    })
    pool.query(
        `insert into forms (user_email,about,body) values ($1,$2,$3)`,
        [req.user.email, why, body],
        (err, results) => {
            if (err) {
                throw err;
            } else {
                res.redirect('back');
            }
        }
    )

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