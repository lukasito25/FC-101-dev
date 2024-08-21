import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const FilterBar = ({ onFilterChange, entries, language }) => {
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
      alert(language === 'EN' ? 'Please select a microcycle to export.' : 'Vyberte mikrocyklus na export.');
      return;
    }

    if (!entries || entries.length === 0) {
      alert(language === 'EN' ? 'No entries available to export.' : 'Žiadne položky na export.');
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
              text: language === 'EN' ? `Training Microcycle ${microcycle}` : `Tréningový mikrocyklus ${microcycle}`,
              heading: 'Title',
            }),
            ...microcycleEntries.map(entry => new Paragraph({
              children: [
                new TextRun({ text: `${language === 'EN' ? 'Date' : 'Dátum'}: ${entry.date}`, bold: true }),
                new TextRun(`\n${language === 'EN' ? 'Session Type' : 'Typ tréningu'}: ${entry.sessionType}`),
                new TextRun(`\n${language === 'EN' ? 'Volume' : 'Objem'}: ${entry.volume}`),
                new TextRun(`\n${language === 'EN' ? 'Intensity' : 'Intenzita'}: ${entry.intensity}`),
                new TextRun(`\n${language === 'EN' ? 'Complexity' : 'Zložitosť'}: ${entry.complexity}`),
                new TextRun(`\n${language === 'EN' ? 'Objective 1' : 'Cieľ 1'}: ${entry.objective1}`),
                new TextRun(`\n${language === 'EN' ? 'Objective 2' : 'Cieľ 2'}: ${entry.objective2 || 'N/A'}`),
                new TextRun(`\n${language === 'EN' ? 'Exercises' : 'Cvičenia'}:`),
                ...entry.exercises.map(exercise => new Paragraph({
                  children: [
                    new TextRun(`\n  - ${language === 'EN' ? 'Goal' : 'Cieľ'}: ${exercise.goal}`),
                    new TextRun(`\n  - ${language === 'EN' ? 'Type' : 'Typ'}: ${exercise.exerciseType}`),
                    new TextRun(`\n  - ${language === 'EN' ? 'Focus' : 'Zameranie'}: ${exercise.focus}`),
                    new TextRun(`\n  - ${language === 'EN' ? 'Description' : 'Popis'}: ${exercise.description}`),
                    new TextRun(`\n  - ${language === 'EN' ? 'Duration' : 'Trvanie'}: ${exercise.duration} minutes`),
                    new TextRun(`\n  - ${language === 'EN' ? 'Fitness Indicator' : 'Kondičný Indikátor'}: ${exercise.fitnessIndicator}`),
                  ],
                })),
              ],
            })),
            new Paragraph({
              text: language === 'EN' ? `Summary for Microcycle ${microcycle}` : `Zhrnutie pre mikrocyklus ${microcycle}`,
              heading: 'Heading1',
              spacing: { after: 400 },
            }),
            new Paragraph(`${language === 'EN' ? 'Total Volume' : 'Celkový objem'}: ${totalVolume} minutes`),
            new Paragraph(`${language === 'EN' ? 'Total Intensity' : 'Celková intenzita'}: ${totalIntensity}%`),
            new Paragraph(`${language === 'EN' ? 'Total Complexity' : 'Celková zložitosť'}: ${totalComplexity}`),
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
        <label style={styles.label}>{language === 'EN' ? 'Session Type' : 'Typ tréningu'}:</label>
        <select
          value={sessionType}
          onChange={(e) => {
            setSessionType(e.target.value);
            handleFilterChange();
          }}
          style={styles.select}
        >
          <option value="">{language === 'EN' ? 'All Types' : 'Všetky typy'}</option>
          <option value="Training">{language === 'EN' ? 'Training' : 'Tréning'}</option>
          <option value="Match">{language === 'EN' ? 'Match' : 'Zápas'}</option>
          <option value="Recovery">{language === 'EN' ? 'Recovery' : 'Regenerácia'}</option>
          <option value="Other">{language === 'EN' ? 'Other' : 'Iné'}</option>
        </select>
      </div>

      <div style={styles.filterItem}>
        <label style={styles.label}>{language === 'EN' ? 'Microcycle' : 'Mikrocyklus'}:</label>
        <select
          value={microcycle}
          onChange={(e) => {
            setMicrocycle(e.target.value);
            handleFilterChange();
          }}
          style={styles.select}
        >
          <option value="">{language === 'EN' ? 'All Microcycles' : 'Všetky mikrocykly'}</option>
          {availableMicrocycles.map(mc => (
            <option key={mc} value={mc}>{language === 'EN' ? 'Microcycle' : 'Mikrocyklus'} {mc}</option>
          ))}
        </select>
      </div>

      <div style={styles.filterItem}>
        <label style={styles.label}>{language === 'EN' ? 'Objective' : 'Cieľ'}:</label>
        <input
          type="text"
          value={objective}
          onChange={(e) => {
            setObjective(e.target.value);
            handleFilterChange();
          }}
          placeholder={language === 'EN' ? 'Enter objective' : 'Zadajte cieľ'}
          style={styles.input}
        />
      </div>

      <div style={styles.filterItem}>
        <label style={styles.label}>{language === 'EN' ? 'From Date' : 'Od dátumu'}:</label>
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
        <label style={styles.label}>{language === 'EN' ? 'To Date' : 'Do dátumu'}:</label>
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

      <button onClick={handleExport} style={styles.exportButton}>
        {language === 'EN' ? 'Export' : 'Exportovať'}
      </button>
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












