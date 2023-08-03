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
  const doc = await dateRef.get();
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
app.get('/data', (req, res) => {
    db.collection("attendance")
      .get()
      .then(function(querySnapshot) {
        var data = [];
        querySnapshot.forEach(function(doc) {
          data.push([doc.id,doc.data()]);
          
        });
        console.log(data);
        res.send(data);
      })
      .catch(function(error) {
        console.log('Error getting Firestore data: ', error);
        res.status(500).send('Error retrieving Firestore data');
      });
  });
  app.get('/getstudent', async (req, res) => {
    
    const name = req.query.name
    var dict = {};
    const datesRef = db.collection('attendance');
  const snapshot = await datesRef.orderBy(name).get();
  if (snapshot.empty) {
    res.status(200).send("We could not find " + name + " in our database")
    return;
  }

snapshot.forEach(doc => {
  var date = doc.id 
  const data = doc.data()
  dict[date] = data[name]["status"]
});
  
res.status(200).send(dict)
    
  });


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