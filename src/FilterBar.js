import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const FilterBar = ({ onFilterChange, entries }) => {
  const [sessionType, setSessionType] = useState('');
  const [microcycle, setMicrocycle] = useState('');
  const [objective, setObjective] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availableMicrocycles, setAvailableMicrocycles] = useState([]);

  useEffect(() => {
    // Dynamically generate microcycle options based on the entries
    const microcycles = Array.from(new Set(entries.map(entry => entry.microcycle))).sort((a, b) => a - b);
    setAvailableMicrocycles(microcycles);
  }, [entries]);

  const handleFilterChange = () => {
    onFilterChange({
      sessionType,
      microcycle,
      objective,
      startDate,
      endDate
    });
  };

  const handleExport = () => {
    if (!microcycle) {
      alert('Please select a microcycle to export.');
      return;
    }

    if (!entries || entries.length === 0) {
      alert('No entries available to export.');
      return;
    }

    const microcycleEntries = entries.filter(entry => entry.microcycle === parseInt(microcycle, 10));

    const totalVolume = microcycleEntries.reduce((sum, entry) => sum + (entry.volume || 0), 0);
    const totalIntensity = microcycleEntries.reduce((sum, entry) => sum + (entry.intensity || 0), 0);
    const totalComplexity = microcycleEntries.reduce((sum, entry) => sum + (entry.complexity || 0), 0);

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: `Training Microcycle ${microcycle}`,
              heading: 'Title',
            }),
            ...microcycleEntries.map(entry => new Paragraph({
              children: [
                new TextRun({ text: `Date: ${entry.date}`, bold: true }),
                new TextRun(`\nSession Type: ${entry.sessionType}`),
                new TextRun(`\nVolume: ${entry.volume}`),
                new TextRun(`\nIntensity: ${entry.intensity}`),
                new TextRun(`\nComplexity: ${entry.complexity}`),
                new TextRun(`\nObjective 1: ${entry.objective1}`),
                new TextRun(`\nObjective 2: ${entry.objective2 || 'N/A'}`),
                new TextRun(`\nExercises:`),
                ...entry.exercises.map(exercise => new Paragraph({
                  children: [
                    new TextRun(`\n  - Goal: ${exercise.goal}`),
                    new TextRun(`\n  - Type: ${exercise.exerciseType}`),
                    new TextRun(`\n  - Focus: ${exercise.focus}`),
                    new TextRun(`\n  - Description: ${exercise.description}`),
                    new TextRun(`\n  - Duration: ${exercise.duration} minutes`),
                    new TextRun(`\n  - Fitness Indicator: ${exercise.fitnessIndicator}`),
                  ],
                })),
              ],
            })),
            new Paragraph({
              text: `Summary for Microcycle ${microcycle}`,
              heading: 'Heading1',
              spacing: { after: 400 },
            }),
            new Paragraph(`Total Volume: ${totalVolume} minutes`),
            new Paragraph(`Total Intensity: ${totalIntensity}%`),
            new Paragraph(`Total Complexity: ${totalComplexity}`),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Training_Microcycle_${microcycle}.docx`);
    });
  };

  return (
    <div style={styles.filterBar}>
      <div style={styles.filterItem}>
        <label style={styles.label}>Session Type:</label>
        <select
          value={sessionType}
          onChange={(e) => {
            setSessionType(e.target.value);
            handleFilterChange();
          }}
          style={styles.select}
        >
          <option value="">All Types</option>
          <option value="Training">Training</option>
          <option value="Match">Match</option>
          <option value="Recovery">Recovery</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div style={styles.filterItem}>
        <label style={styles.label}>Microcycle:</label>
        <select
          value={microcycle}
          onChange={(e) => {
            setMicrocycle(e.target.value);
            handleFilterChange();
          }}
          style={styles.select}
        >
          <option value="">All Microcycles</option>
          {availableMicrocycles.map(mc => (
            <option key={mc} value={mc}>Microcycle {mc}</option>
          ))}
        </select>
      </div>

      <div style={styles.filterItem}>
        <label style={styles.label}>Objective:</label>
        <input
          type="text"
          value={objective}
          onChange={(e) => {
            setObjective(e.target.value);
            handleFilterChange();
          }}
          placeholder="Enter objective"
          style={styles.input}
        />
      </div>

      <div style={styles.filterItem}>
        <label style={styles.label}>From Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            handleFilterChange();
          }}
          style={styles.input}
        />
      </div>

      <div style={styles.filterItem}>
        <label style={styles.label}>To Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            handleFilterChange();
          }}
          style={styles.input}
        />
      </div>

      <button onClick={handleExport} style={styles.exportButton}>Export</button>
    </div>
  );
};

const styles = {
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filterItem: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 10px',
    minWidth: '150px',
    flex: '1 1 150px',
  },
  label: {
    marginBottom: '5px',
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    outline: 'none',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
    transition: 'border 0.3s ease',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    outline: 'none',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
    transition: 'border 0.3s ease',
  },
  exportButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#000',
    color: 'white',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
    width: '100%',
  },
  '@media (max-width: 768px)': {
    filterBar: {
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: '10px',
    },
    filterItem: {
      margin: '10px 0',
    },
    exportButton: {
      width: '100%',
    },
  },
};

export default FilterBar;











