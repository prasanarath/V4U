const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Signup Route
app.post('/signup', (req, res) => {
  const { name, email, username, password, location, role } = req.body;
  const filePath = role === 'user' ? 'users.json' : 'volunteer.json';

  fs.readFile(filePath, 'utf-8', (err, data) => {
    let users = [];
    if (!err) {
      try {
        users = JSON.parse(data).users || [];
      } catch {
        return res.status(500).json({ error: 'Invalid JSON format in file.' });
      }
    }

    // Check if the username already exists
    if (users.some(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    // Add the new user to the list
    users.push({ name, email, username, password, location });

    // Save the updated user list back to the file
    fs.writeFile(filePath, JSON.stringify({ users }, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error saving user data.' });
      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});

// Login Route (Checks Both Files)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const checkLogin = (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return resolve(null);
        try {
          const users = JSON.parse(data).users || [];
          resolve(users.find(u => u.username === username && u.password === password));
        } catch {
          resolve(null);
        }
      });
    });
  };

  Promise.all([checkLogin('users.json'), checkLogin('volunteer.json')])
    .then(([user, volunteer]) => {
      if (user || volunteer) {
        req.session.username = user ? user.username : volunteer.username;
        res.json({ username: req.session.username });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
});

// Logout Route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Error logging out' });
    res.json({ message: 'Logged out successfully' });
  });
});

// Check Session Route
app.get('/check-session', (req, res) => {
  req.session.username ? res.json({ loggedIn: true, username: req.session.username }) : res.json({ loggedIn: false });
});


//storeRequirement
// Store Requirement Route
app.post('/storeRequirement', (req, res) => {
  const { name, mobile, gender, location } = req.body;

  // Create the requirement data object
  const requirementData = {
    name, 
    mobile, 
    gender, 
    location
  };

  const filePath = './requirement.json';

  // Clear the existing requirement.json file and store the new data
  fs.writeFile(filePath, JSON.stringify([requirementData], null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error saving requirement data.' });
    }
    res.status(200).json({ message: 'Requirement data saved successfully!' });
  });
})




//send mail to volunter 
const nodemailer = require('nodemailer');

// Send email to matching volunteers
app.post('/sendMail', (req, res) => {
  const { message } = req.body;

  // Read the requirement and volunteer data from the respective JSON files
  fs.readFile('./requirement.json', 'utf-8', (err, reqData) => {
    if (err) return res.status(500).json({ error: 'Error reading requirement data.' });

    const requirement = JSON.parse(reqData)[0]; // Assuming there's only one requirement object
    const { name: reqName, mobile: reqMobile, location: reqLocation } = requirement;

    fs.readFile('./volunteer.json', 'utf-8', (err, volData) => {
      if (err) return res.status(500).json({ error: 'Error reading volunteer data.' });

      const volunteers = JSON.parse(volData).users || [];
      const matchingVolunteers = volunteers.filter(volunteer => volunteer.location.toLowerCase() === reqLocation.toLowerCase());

      if (matchingVolunteers.length === 0) {
        return res.status(200).json({ message: 'No matching volunteers found for this location.' });
      }

      // Configure nodemailer transporter (use Gmail here as an example, but you can configure other providers)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'iampkr519@gmail.com', // Replace with your email address
          pass: 'oeyu tuys xovz kywh'    // Replace with your email password
        }
      });

      const emailPromises = matchingVolunteers.map(volunteer => {
        const mailOptions = {
          from: 'iampkr519@gmail.com', // Sender address
          to: volunteer.email,          // Recipient email (volunteer)
          subject: 'Your Help Matters,We Need You!', // Subject line
          text: `${message}\n\nPerson Details:\nName: ${reqName}\nMobile number: ${reqMobile}\nLocation: ${reqLocation}`, // Message body
          text: `BE SOMEONE'S WE ----V4U` 
        };

        return transporter.sendMail(mailOptions);
      });

      // Send emails to all matching volunteers
      Promise.all(emailPromises)
        .then(() => {
          res.status(200).json({ message: 'Emails sent successfully to matching volunteers.' });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Error sending emails.' });
        });
    });
  });
});


// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
