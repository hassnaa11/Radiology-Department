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
    fileFilter: fileFilter
}).array('scan_folder');

const upload_profile_img = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20
    },
    fileFilter: fileFilter
}).single('picture');

const path = require('path');
const { log } = require("console");
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


app.get('/patient', async (req, res) => {
    const patientScans = req.session.patient || [];
    let scans_type = await pool.query(
        'SELECT scan_type FROM take_appointment WHERE patient_id = $1 ',
        [req.user.id]
    );
    let scans_date = await pool.query(
        'SELECT scan_date FROM take_appointment WHERE patient_id = $1 ',
        [req.user.id]
    );
    let scans_id = await pool.query(
        'SELECT scan_id FROM take_appointment WHERE patient_id = $1 ',
        [req.user.id]
    );

    scans_type = scans_type.rows;
    scans_date = scans_date.rows;
    scans_id = scans_id.rows;

    console.log(scans_type);
    console.log(scans_date);
    console.log(scans_id);
    let num_of_appointments = scans_id.length;
    for (let i = num_of_appointments; i > 0; i--) {
        const now = new Date();
        if (now > scans_date[i - 1].scan_date) {
            pool.query(
                'INSERT INTO reports (report_no) ' +
                'SELECT $1 WHERE NOT EXISTS (SELECT 1 FROM reports WHERE report_no = $1)',
                [scans_id[i - 1].scan_id]);
        }
    }

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const fname = capitalize(req.user.fname);
    const lname = capitalize(req.user.lname);

    res.render("patient.ejs", {
        type: req.user.type,
        email: req.user.email,
        fname: fname,
        lname: lname,
        address: req.user.address,
        age: req.user.age,
        sex: req.user.sex,
        phone_no: req.user.phone_no,
        salary: req.user.salary,
        start_shift: req.user.start_shift,
        end_shift: req.user.end_shift,
        password: req.user.password,
        picture: req.user.picture,
        scans_type,
        scans_date,
        scans_id,
        //reports_no,
        scans: patientScans
    })
});


app.post("/take_appointment", async (req, res) => {
    const patientId = req.user.id; // Assuming `req.user.id` contains the patient's ID
    const { scanType, date, time } = req.body;

    console.log(scanType, date, time);

    let errors = [];

    // Validate the input
    if (!scanType || !date || !time) {
        errors.push({ message: "Please fill in all fields" });
    }

    if (errors.length > 0) {
        return res.render("take_appointment", { errors });
    }

    try {
        // Combine date and time into a single timestamp string
        const scanDate = `${date} ${time}:00`;

        // Check if the scan type, date, and time are already reserved
        const result = await pool.query(
            `SELECT * FROM take_appointment WHERE scan_type = $1 AND scan_date = $2`,
            [scanType, scanDate]
        );

        if (result.rows.length > 0) {
            errors.push({ message: "This time slot is already reserved for the selected scan type" });
            return res.render("take_appointment", { errors });
        }

        // Find an available radiologist
        const radiologistResult = await pool.query(
            `SELECT r.radiologist_id 
             FROM radiologist r
             JOIN users u ON r.radiologist_id = u.id
             WHERE $1::time >= r.start_shift AND $1::time < r.end_shift
             AND NOT EXISTS (
                 SELECT 1 FROM take_appointment ta
                 WHERE ta.radiologist_id = r.radiologist_id AND ta.scan_date = $2
             )
             LIMIT 1`,
            [time, scanDate]
        );

        if (radiologistResult.rows.length === 0) {
            errors.push({ message: "No available radiologist found for the selected time" });
            return res.render("take_appointment", { errors });
        }

        const radiologistId = radiologistResult.rows[0].radiologist_id;

        // Insert the new reservation
        await pool.query(
            `INSERT INTO take_appointment (patient_id, radiologist_id, scan_type, scan_date) VALUES ($1, $2, $3, $4)`,
            [patientId, radiologistId, scanType, scanDate]
        );

        req.flash("success_msg", "Your reservation was successful");
        res.redirect("/take_appointment");
    } catch (err) {
        console.error(err);
        errors.push({ message: "Server error" });
        res.render("take_appointment", { errors });
    }
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
    // console.log(scans_no);

    let scan_pics = await pool.query('SELECT scan_pics FROM scans WHERE radiologist_id = $1 AND dr_id IS NULL', [req.user.id]);
    scan_pics = scan_pics.rows;
    // console.log(scan_pics.rows);

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

// admin home window route
app.get('/admin', (req, res) => {
    res.render("admin.ejs")
});
// engineers_admin window route
app.get('/engineers_admin', (req, res) => {
    res.render("engineers_admin.ejs")
});
// doctors_admin window route
app.get('/doctors_admin', async(req, res) => {
    try {
        // SQL query to select all data from adminDoctors table joined with users table
        let result = await pool.query(`
            SELECT 
                doctor.*, 
                users.fname,
                users.lname, 
                users.email, 
                users.address, 
                users.phone_no,
                users.age,
                users.sex,
                users.password,
                users.type
            FROM 
                doctor 
            JOIN 
                users 
            ON 
                doctor.doctor_id = users.id
        `);
        // Get the rows from the result
        const doctors = result.rows;
        // Render the doctors view with the fetched data
        res.render("doctors_admin.ejs", { doctors });
    } catch (err) {
        // Log detailed error information to the console
        console.error('Error retrieving doctors data:', err.message, err.stack);
        // Send an error message to the client
        res.send('Error retrieving doctors data');
    }
    
});
// radiologists_admin window route
app.get('/radiologists_admin', async (req, res) => {
    try {
        const radiologistsResult = await pool.query(`
            SELECT 
                r.*, 
                u.fname, 
                u.lname,
                u.email, 
                u.address, 
                u.phone_no,
                u.age,
                u.sex,
                u.type,
                u.password,
                u.picture,
                s.scan_id,
                s.scan_folder,
                s.scan_pics
            FROM 
                radiologist r
            JOIN 
                users u ON r.radiologist_id = u.id
            LEFT JOIN
                scans s ON r.radiologist_id = s.radiologist_id
        `);

        // Group scans by radiologist
        const radiologists = radiologistsResult.rows.reduce((acc, row) => {
            const {
                radiologist_id,
                fname,
                lname,
                email,
                address,
                phone_no,
                age,
                sex,
                type,
                password,
                salary,
                start_shift,
                end_shift,
                scan_id,
                scan_folder,
                scan_pics
            } = row;

            // Check if radiologist already exists in the accumulator
            let radiologist = acc.find(r => r.radiologist_id === radiologist_id);
            if (!radiologist) {
                radiologist = {
                    radiologist_id,
                    fname,
                    lname,
                    email,
                    address,
                    phone_no,
                    age,
                    sex,
                    type,
                    password,
                    salary,
                    start_shift,
                    end_shift,
                    scans: []
                };
                acc.push(radiologist);
            }

            // Push scans to the radiologist's scans array
            if (scan_id) {
                radiologist.scans.push({
                    scan_id,
                    scan_folder,
                    scan_pics
                });
            }

            return acc;
        }, []);

        // Render the view with radiologists data
        res.render('radiologists_admin.ejs', { radiologists });
    } catch (err) {
        console.error('Error retrieving radiologist data:', err.message, err.stack);
        res.send('Error retrieving radiologist data');
    }
});
app.get('/scan_img', async (req, res) => {
    const { scan_id, pic_index } = req.query;

    // Validate query parameters
    if (!scan_id || !pic_index) {
        return res.status(400).send('Missing scan_id or pic_index');
    }

    if (isNaN(scan_id) || isNaN(pic_index)) {
        return res.status(400).send('Invalid scan_id or pic_index');
    }

    try {
        const result = await pool.query(
            'SELECT scan_folder, scan_pics FROM scans WHERE scan_id = $1',
            [scan_id]
        );

        if (result.rows.length > 0) {
            const { scan_folder, scan_pics } = result.rows[0];

            if (pic_index < 0 || pic_index >= scan_pics.length) {
                return res.status(400).send('Invalid pic_index');
            }

            const selectedPic = scan_pics[pic_index];
            console.log(selectedPic);
            res.render('scan_img', { scan_folder, selectedPic });
        } else {
            res.status(404).send('Scan not found');
        }
    } catch (error) {
        console.error('Error retrieving scan details:', error.message);
        res.status(500).send('Error retrieving scan details');
    }
});
// add_radiologist window route
app.get('/add_radiologist', (req, res) => {
    res.render("add_radiologist.ejs")
});

app.post('/add_radiologist', async (req, res) => {
    let { name, password, address, email, start_shift, end_shift, sex, age, major, salary, phone_no, picture } = req.body;
    let type = 'radiologist'
    console.log({
        name,
        email,
        type,
        start_shift,
        end_shift,
        major,
        salary
    });
    

    
    const [fname, mname, lname] = name.split(' ');
    let hashedPassword = await bcrypt.hash(password, 10);

    pool.query(
        `INSERT INTO users (fname, mname, lname, email, password, type, address, age, sex, phone_no, picture) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id`,
        [fname, mname, lname, email, hashedPassword, type, address, age, sex, phone_no, picture],
        (err, results) => {
            if (err) {
                throw err;
            }

            const userId = results.rows[0].id;

            pool.query(
                `INSERT INTO radiologist (radiologist_id, salary, start_shift, end_shift)
                VALUES ($1, $2, $3, $4)`,
                [userId, salary, start_shift, end_shift],
                (err) => {
                    if (err) {
                        throw err;
                    }
                    req.flash('success_msg', 'Doctor added successfully.');
                    res.redirect('/doctors_admin');
                }
            );
        }
    );
});

// add_doctor window route
app.get('/add_doctor', (req, res) => {
    res.render("add_doctor.ejs")
});

app.post('/add_doctor', async (req, res) => {
    let { name, password, adress, email, asisName, start, end_shift, room, sex, age, salary, major, picture, phone_no } = req.body;
    let type = 'doctor';

    // Initialize an array to hold error messages
    let errors = [];

    // Split the name into parts and check if it contains at least three parts
    const nameParts = name.split(' ');
    
    if (nameParts.length < 3) {
        errors.push({ message: 'Please enter your full name (first, middle, and last name).' });
    }
    const [fname, mname, lname] = nameParts;

    try {
        // Check for existing email and phone number in the users table
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            errors.push({ message: "This email is already in use." });
        }

        const phoneCheck = await pool.query('SELECT * FROM users WHERE phone_no = $1', [phone_no]);
        if (phoneCheck.rows.length > 0) {
            errors.push({ message: "This phone number is already in use." });
        }



        if (errors.length > 0) {
            res.render("add_doctor.ejs", { errors });
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        // Insert the new user
        const result = await pool.query(
            `INSERT INTO users (fname, mname, lname, email, password, type, address, age, sex, picture, phone_no) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id`,
            [fname, mname, lname, email, hashedPassword, type, adress, age, sex, picture, phone_no]
        );

        const userId = result.rows[0].id;
        

        // Insert into doctor table
        await pool.query(
            `INSERT INTO doctor (doctor_id, ass_name, start_shift, end_shift, dr_room, special, salary)
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [userId, asisName, start, end_shift, room, major, salary]
            
        );

        req.flash("success_msg", "Doctor added successfully.");
        res.redirect("");
        
    } catch (err) {
        console.error('Error adding doctor:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// form window route
app.get('/forms', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM forms');
        const forms = result.rows;
        res.render('forms', { forms });
    } catch (err) {
        throw (err)
    }
});

app.post('/forms', async (req, res) => {
    const { remail, write } = req.body;

    try {
        const result = await pool.query(
            'UPDATE forms SET reply = $1 WHERE user_email = $2 RETURNING *',
            [write, remail]
        );

        if (result.rowCount > 0) {
            req.flash('success_msg', 'Reply added successfully');
        } else {
            req.flash('error_msg', 'No form found for the given email');
        }

        res.redirect('/forms');
    } catch (err) {
        console.error('Error adding reply:', err);
        req.flash('error_msg', 'Failed to add reply. Please try again later.');
        res.redirect('/forms');
    }
    
});

app.get('/replies', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM forms where user_email=$1 and reply IS NOT NULL', [req.user.email]);
        const replies = result.rows;
        res.render('replies', { replies });
    } catch (err) {
        throw (err)
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
            } else {
                throw (err)
            }
        })
});
app.get('/doctor_scan', async (req, res) => {
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
    const scansNo = req.session.scansNo;
    res.render("doctor.ejs", {
        password: user.password,
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
        scansNo: scansNo
    })
});
app.post("/contact_form", async (req, res) => {
    const user = req.session.user;
    const { why, body } = req.body;
    // console.log(user_email)
    console.log(why)
    console.log(body)
    pool.query(
        'insert into forms (user_email, about, body) values($1,$2,$3)',
        [user.email, why, body],
        (err, contact_form_res) => {
            if (err) {
                throw err;
            }

        })
});

app.post("/update", async (req, res) => {
    // upload_profile_img(req, res, async (err) => {
    //     let picture2 = req.file;
    //     console.log(picture2)
    //     console.log("hey ")

    //     picture2 = picture2.path
    //     console.log(picture2)
    //     if (picture2 != null) {
    //         picture2 = picture2.replace(/\\/g, '/');
    //         picture2 = picture2.replace('public', '');
    //         }
    const { fname, email, adress, password, salary, age, ass_name, phone_no, special, dr_room, start_time, end_time, picture2} = req.body;
    console.log(picture2)
    let newage = parseInt(age)
    let newsalary = parseInt(salary)
    let newphone_no = parseInt(phone_no)
    let newdr_room = parseInt(dr_room)
    const userId = req.user.id;
    console.log(req.body);
    let hashedPassword = '';
        if (password === '') {
            const oldPasswordResult = await pool.query(`SELECT password FROM users WHERE users.id = $1`, [userId]);
            hashedPassword = oldPasswordResult.rows[0].password;
        } else {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        let picture = ''
        if(picture2 === undefined){
           const oldPicture = await pool.query(`SELECT picture FROM users WHERE users.id = $1`, [userId]);
           picture = oldPicture.rows[0].picture;
           console.log(picture)
        } else{
             picture = picture2
        }
    pool.query(
        'update users set fname=$1 , email=$2 , adress=$3 , picture=$4 , age=$5 , phone_no=$6, password=$7 where id=$8',
        [fname, email, adress, picture, newage, newphone_no,hashedPassword, userId],
        (err) => {
            if (err) {
                throw err;
            }
        });

    pool.query(
        'update doctor set salary=$1 ,ass_name=$2, special=$3, dr_room=$4, start_time=$5, end_time=$6 where doctor_id=$7',
        [newsalary, ass_name, special, newdr_room, start_time, end_time, userId],
        (err) => {
            if (err) {
                throw err;
            }
        });

        const user = req.session.user;
        user.password = password,
        user.email = email,
        user.fname = fname,
        user.adress = adress,
        user.picture = picture,
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
// });

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
    upload_profile_img(req, res, async (err) => {
        let picture = req.file;
        console.log(picture)
        picture = picture.path
        console.log(picture)
        if (picture != null) {
            picture = picture.replace(/\\/g, '/');
            picture = picture.replace('public', '');
        }
        console.log(picture)
        let { email, fullName, address, age, sex, phone_no, password } = req.body;
        // console.log({
        //     fullName,
        //     email,
        //     age,
        //     picture
        // });

        age = parseInt(age)
        phone_no = parseInt(phone_no)
        if (isNaN(age)) {
            age = null;
        }
        if (isNaN(phone_no)) {
            phone_no = null;
        }

        let nameParts = fullName.split(' ');
        let fname = '';
        let lname = '';
        if (nameParts.length > 0) { fname = nameParts[0]; }
        if (nameParts.length > 1) { lname = nameParts[1]; }
        // console.log("pass: ", password);
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
                    res.redirect('back')
                }
            }
        );

    })
});

app.post("/upload_scan", async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            // console.log("Upload error: ", err.message);
            return res.redirect('back');
        }
        let { scan_id } = req.body;
        // console.log("scan_id:): ", scan_id);
        let scan_pics = [];
        let scans_no = await pool.query(
            'SELECT scan_id FROM scans WHERE radiologist_id = $1 AND dr_id IS NULL',
            [req.user.id]
        );
        scans_no = scans_no.rows
        // console.log("scans_no:<< ", scans_no);
        let cond = false;
        for (let i = 0; i < scans_no.length; i++) {
            // console.log("here: ");
            // console.log(scans_no[i].scan_id);
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
        // console.log(scan_pics);
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
    // console.log({
    //     doc_email,
    //     scan_to_doc
    // });
    // let is_pics;
    let doc_id = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND type = $2 ',
        [doc_email, 'doctor']
    );
    let patient_id = await pool.query(
        'SELECT patient_id FROM take_appointment WHERE scan_id = $1 ',
        [scan_to_doc]
    );
    // console.log("doc b: ", doc_id)
    // console.log("pat b: ", patient_id)
    if (doc_id.rows.length === 0) {
        // console.log("err doc ", doc_id.rows.length);
        msg = 'Error: Incorrect Doctor Email !';
        res.redirect('back');
    } else if (patient_id.rows.length === 0) {
        // console.log("err pat ", patient_id.rows.length);
        msg = 'Error: Incorrect Scan ID !';
        res.redirect('back');
    } else {
        // console.log("pass2")
        doc_id = doc_id.rows[0].id
        patient_id = patient_id.rows[0].patient_id
        // console.log(doc_id, "  ", patient_id);

        let is_pics = await pool.query(`select scan_pics from scans where scan_id = $1`,
            [scan_to_doc]
        )
        // console.log("is pics: ", is_pics)

        if (is_pics.rows[0].scan_pics == null) {
            msg = 'Error: Scan pictures does not exist !';
            res.redirect('back');
        }
        else {
            is_pics = is_pics.rows[0].scan_pics
            // console.log("is pics2: ", is_pics)
            pool.query(`UPDATE scans SET dr_id = $1, patient_id = $2 WHERE scan_id = $3`,
                [doc_id, patient_id, scan_to_doc], (err) => {
                    if (err) {
                        throw err;
                    }
                    res.redirect('back')
                }
            );
        }
    }
});

app.post("/rad_send_form", async (req, res) => {
    let { why, body } = req.body;
    // console.log({
    //     why, body
    // })
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
    const userId = req.user.id;
    pool.query(
        'select users.* , doctor.* from users join doctor on users.id = doctor.doctor_id where users.id=$1',
        [userId],
        (err, results) => {
            if (err) {
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
                    req.session.scansNo= scanResults.rows.length;
                    req.session.doctorScans = scanResults.rows;
                    console.log(req.session.doctorScans)
                    pool.query(
                        `SELECT users.*, patient.*, scans.*, reports.*
                         FROM users
                        JOIN patient ON users.id = patient.patient_id
                        JOIN scans ON patient.patient_id = scans.patient_id
                        JOIN reports ON scans.scan_id = reports.scan_id
                         WHERE users.id = $1`,
                        [userId],
                        (err, results) => {
                            if(err){
                                throw err;
                            }

                            req.session.patient = results.rows;
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
                        });
                });
        });
});

app.listen(PORT);
app.use(express.static('public'));