const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')
const path = require('path');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.post('/addstudent', async (req, res) => {
  const {name, date, status} = req.body
  const peopleRef = db.collection('attendance').doc(date)
  const res2 = await peopleRef.set({
      [name]: {
          "status": status
      }
  }, { merge: true })
  
  res.status(200).send("added")
})

app.get('/getroster', async (req, res) => {

  const { date, status } = req.query;
  const dateRef = db.collection("attendance").doc(date);
  const doc = await dataRef.get();
  const students = [];

  if (!doc.exists) {
      return res.sendStatus(400)
  }

  const data = doc.data();

  for (let k in data) {
   if (data[k]["status"] == status) {
       students.push(k);
   }
  }

  res.status(200).send(students)
})


  app.get('/roster', (req, res) => {
    res.sendFile(path.join(__dirname, 'roster.html'));
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'student.html'));
  });

  app.get('/attendance', (req, res) => {
    res.sendFile(path.join(__dirname, 'attendance.html'));
  });

  app.get('/entries', (req, res) => {
    res.sendFile(path.join(__dirname, 'entries.html'));
  });




app.listen(port, () => console.log(`Server has started on port: ${port}`))