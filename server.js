const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000; // Use the PORT environment variable or default to 5000

// CORS configuration
app.use(cors({
  origin: 'https://71361e57-5621-4ce9-a477-742aef29fe22-00-23dssehx19ldy.kirk.replit.dev/' 
}));

// Middleware
app.use(express.json());

// Initialize the SQLite database
const db = new sqlite3.Database(process.env.DATABASE_URL || './dashboard.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    db.serialize(() => {
      // Create the `entries` table
      db.run(`CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        sessionType TEXT NOT NULL,
        microcycle INTEGER NOT NULL,
        objective1 TEXT,
        objective2 TEXT,
        volume INTEGER NOT NULL,
        intensity INTEGER NOT NULL,
        complexity INTEGER
      )`, (err) => {
        if (err) {
          console.error('Error creating entries table', err.message);
        } else {
          console.log('Table "entries" created or already exists.');
        }
      });

      // Create the `exercises` table
      db.run(`CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entryId INTEGER NOT NULL,
        goal TEXT NOT NULL,
        exerciseType TEXT NOT NULL,
        focus TEXT NOT NULL,
        description TEXT,
        duration INTEGER NOT NULL,
        fitnessIndicator TEXT,
        FOREIGN KEY (entryId) REFERENCES entries(id) ON DELETE CASCADE
      )`, (err) => {
        if (err) {
          console.error('Error creating exercises table', err.message);
        } else {
          console.log('Table "exercises" created or already exists.');
        }
      });

      // Check if entries table is empty and insert dummy data if it is
      db.get('SELECT COUNT(*) AS count FROM entries', (err, row) => {
        if (err) {
          console.error('Error checking entries table:', err.message);
        } else if (row.count === 0) {
          console.log('Entries table is empty. Inserting dummy data...');

          const insertEntry = db.prepare(`INSERT INTO entries 
            (date, sessionType, microcycle, objective1, objective2, volume, intensity, complexity) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

          const insertExercise = db.prepare(`INSERT INTO exercises 
            (entryId, goal, exerciseType, focus, description, duration, fitnessIndicator) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`);

          // First dummy entry
          insertEntry.run(
            '2024-08-14', 'Training', 1, 'Increase endurance', 'Improve speed', 90, 80, 3, 
            function(err) {
              if (err) {
                console.error('Error inserting dummy data into entries:', err.message);
              } else {
                const entryId = this.lastID;
                insertExercise.run([entryId, 'HT', 'PC', 'HCJ', 'Warm-up drill', 15, 'R']);
                insertExercise.run([entryId, 'HN', 'HC', 'HK', 'Main drill', 60, 'S'], finalizeExercises);
              }
            });

          // Second dummy entry
          insertEntry.run(
            '2024-08-15', 'Recovery', 2, 'Muscle recovery', 'Flexibility improvement', 60, 50, 2, 
            function(err) {
              if (err) {
                console.error('Error inserting dummy data into entries:', err.message);
              } else {
                const entryId = this.lastID;
                insertExercise.run([entryId, 'RC', 'PH', 'HS', 'Stretching and cool down', 30, 'Koo']);
                insertExercise.run([entryId, 'NP', 'VH', 'SHS', 'Hydration and rest', 30, 'V'], finalizeExercises);
              }
            });

          // Third dummy entry
          insertEntry.run(
            '2024-08-16', 'Match', 3, 'Tactical play', 'Team coordination', 120, 90, 4, 
            function(err) {
              if (err) {
                console.error('Error inserting dummy data into entries:', err.message);
              } else {
                const entryId = this.lastID;
                insertExercise.run([entryId, 'KT', 'PC', 'HS', 'Opening strategy', 20, 'S']);
                insertExercise.run([entryId, 'RC', 'HC', 'HK', 'Mid-game strategy', 50, 'R']);
                insertExercise.run([entryId, 'NP', 'VH', 'HCJ', 'End-game tactics', 50, 'Koo'], finalizeExercises);
              }
            });

          // Finalize all inserts
          const finalizeExercises = () => {
            insertExercise.finalize(() => {
              console.log('Dummy data insertion complete.');
            });
          };

          insertEntry.finalize();
        }
      });
    });
  }
});

// API endpoint to get all entries along with exercises
app.get('/api/entries', (req, res) => {
  db.all('SELECT * FROM entries', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    const entriesWithExercises = rows.map(entry => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM exercises WHERE entryId = ?', [entry.id], (err, exercises) => {
          if (err) {
            reject(err);
          } else {
            entry.exercises = exercises;
            resolve(entry);
          }
        });
      });
    });

    Promise.all(entriesWithExercises)
      .then(results => res.json({ entries: results }))
      .catch(error => res.status(500).json({ error: error.message }));
  });
});

// API endpoint to add a new entry along with exercises
app.post('/api/entries', (req, res) => {
  const { date, sessionType, microcycle, objective1, objective2, volume, intensity, complexity, exercises } = req.body;

  db.run(`INSERT INTO entries (date, sessionType, microcycle, objective1, objective2, volume, intensity, complexity) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
          [date, sessionType, microcycle, objective1, objective2, volume, intensity, complexity], 
          function(err) {
    if (err) {
      console.error('Error inserting data into entries:', err.message);
      res.status(400).json({ error: err.message });
      return;
    }

    const entryId = this.lastID;

    if (exercises && exercises.length > 0) {
      const insertExercise = db.prepare('INSERT INTO exercises (entryId, goal, exerciseType, focus, description, duration, fitnessIndicator) VALUES (?, ?, ?, ?, ?, ?, ?)');

      exercises.forEach((exercise) => {
        insertExercise.run(
          [entryId, exercise.goal, exercise.exerciseType, exercise.focus, exercise.description, exercise.duration, exercise.fitnessIndicator],
          (err) => {
            if (err) {
              console.error('Error inserting data into exercises:', err.message);
            }
          }
        );
      });

      insertExercise.finalize(() => {
        console.log('All exercises inserted for entry ID:', entryId);
        res.json({ id: entryId });
      });
    } else {
      return res.json({ id: entryId });
    }
  });
});

// Ping endpoint to keep the server alive
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




















