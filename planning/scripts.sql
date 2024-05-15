CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(20) NOT NULL,
    type VARCHAR(10) NOT NULL, -- admin or patient or doctor or radiologist
    fname VARCHAR(20) NOT NULL,
    mname VARCHAR(20) NOT NULL,
    lname VARCHAR(20) NOT NULL,
    phone_no INT[] UNIQUE,
    age INT,
    sex VARCHAR(6),
    address VARCHAR(30)
);

CREATE TABLE admin( -- can access everything and edit. inherited from users 
    admin_id INT PRIMARY KEY REFERENCES users (id)
);

CREATE TABLE patient( -- inherited from users 
    patient_id INT PRIMARY KEY REFERENCES users (id),
    emergency_phone INT[],
    medical_history TEXT
);

CREATE TABLE doctor( -- inherited from users 
    doctor_id INT PRIMARY KEY REFERENCES users (id),
    salary INT,
    room_no INT,
    specialization VARCHAR(40),
    assistant_name VARCHAR(40),
    start_shift TIME,
    end_shift TIME
);

CREATE TABLE radiologist( -- inherited from users 
    radiologist_id INT PRIMARY KEY REFERENCES users (id),
    salary INT,
    start_shift TIME,
    end_shift TIME,
    radiation_index INT
);

CREATE TABLE report( 
    report_no SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctor (doctor_id),
    patient_id INT REFERENCES patient (patient_id),
    radiologist_id INT REFERENCES radiologist (radiologist_id),
    scan_folder TEXT UNIQUE,
    report_date TIMESTAMP,
    case_description TEXT,
    radiology_procedure VARCHAR(20)
);

CREATE TABLE scans( -- table contains scan folder path, array of pictures paths in the folder and report number 
    scan_folder TEXT PRIMARY KEY REFERENCES report (scan_folder),
    scan_pics TEXT[],
    report_no INT REFERENCES report (report_no)
);

CREATE TABLE billing( -- some information about billing for patient 
    bill_no SERIAL PRIMARY KEY,
    payment_amount INT,
    payment_method VARCHAR(20) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    insurance_no INT,
    patient_id INT REFERENCES patient (patient_id)
);

CREATE TABLE machine( -- some information about each machine
    code VARCHAR(30) PRIMARY KEY,
    seller_company VARCHAR(20),
    cost INT,
    installation_eng VARCHAR(20),
    installation_date DATE,
    upcoming_maintenance_date DATE,
    last_maintenance_date DATE
);

CREATE TABLE technician_engineer( -- some information about engineers
    eng_id SERIAL PRIMARY KEY,
    fname VARCHAR(20) NOT NULL,
    lname VARCHAR(20) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    sex VARCHAR(6),
    address VARCHAR(30),
    salary INT,
    phone_no INT[] UNIQUE,
    start_shift TIME,
    end_shift TIME
);

CREATE TABLE contact_form( -- form for complains or questions for patients or doctors or radiologists 
    form_no SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id),
    form_type VARCHAR(20) NOT NULL,
    user_type VARCHAR(10) NOT NULL,
    form_description TEXT NOT NULL
);

CREATE TABLE patient_has_doctor( -- relation between patient and doctor 
    doctor_id INT REFERENCES doctor (doctor_id),
    patient_id INT REFERENCES patient (patient_id)
);

CREATE TABLE operate( -- relation between radiologist and machine 
    machine_code VARCHAR(30) REFERENCES machine (code),
    radiologist_id INT REFERENCES radiologist (radiologist_id)
);

CREATE TABLE works_on( -- relation between engineer and machine
    machine_code VARCHAR(30) REFERENCES machine (code),
    eng_id INT REFERENCES technician_engineer (eng_id)
);

CREATE TABLE take_appointment( -- relation between patient and radiologist
    patient_id INT REFERENCES patient (patient_id),
    radiologist_id INT REFERENCES radiologist (radiologist_id),
    scan_type VARCHAR(20) NOT NULL,
    scan_date TIMESTAMP UNIQUE NOT NULL
);