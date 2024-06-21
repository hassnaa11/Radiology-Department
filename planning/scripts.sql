CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(80) NOT NULL,
    type VARCHAR(12) NOT NULL, -- admin or patient or doctor or radiologist
    fname VARCHAR(20) NOT NULL,
    mname VARCHAR(20) NOT NULL,
    lname VARCHAR(20) NOT NULL,
    phone_no INT UNIQUE,
    age INT,
    sex VARCHAR(6),
    address VARCHAR(30),
    picture TEXT
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
    job varchar(50),
    salary INT,
    dr_room INT,
    special VARCHAR(40),
    ass_name VARCHAR(40),
    start_shift VARCHAR(20),
    end_shift VARCHAR(20)
);

CREATE TABLE radiologist( -- inherited from users 
    radiologist_id INT PRIMARY KEY REFERENCES users (id),
    salary INT,
    start_shift TIME,
    end_shift TIME
);

CREATE TABLE take_appointment( -- relation between patient and radiologist
    scan_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patient (patient_id),
    radiologist_id INT REFERENCES radiologist (radiologist_id),
    scan_type VARCHAR(20) NOT NULL,
    scan_date TIMESTAMP UNIQUE NOT NULL
);

Create table scans( 
scan_id INT REFERENCES take_appointment (scan_id),
patient_id int references patient(patient_id), 
scan_folder varchar(300) , 
scan_pics text[], 
radiologist_id int references radiologist(radiologist_id), 
dr_id int references doctor(doctor_id), 
unique(scan_folder) 
);

Create table reports( 
report_no bigserial primary key, 
scan_id int references scans(scan_id), 
dr_id int references doctor(doctor_id), 
report_date timestamp, 
radiology_procedure varchar(100), 
case_description  text[] 
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

CREATE TABLE forms( -- form for complains or questions for patients or doctors or radiologists
    form_id bigserial primary key,
    user_email varchar(400) references users(email),
    about varchar(200),
    body text;
    reply text
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



