import React, { useEffect, useState } from 'react';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from 'docx';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';
import FilterBar from './FilterBar';
import AddEntryForm from './AddEntryForm';

const REPLIT_BACKEND_URL = 'https://5926c511-4ef0-4546-9b83-d40341db4663-00-2cag66hardsfm.janeway.replit.dev:3000';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [metrics, setMetrics] = useState({
    sessions: 0,
    minutes: 0,
  });
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  const calculateMetrics = (data) => {
    const sessions = data.length;
    const minutes = data.reduce((total, entry) => total + (entry.volume || 0), 0);
    setMetrics({ sessions, minutes });
  };

  useEffect(() => {
    fetch(`${REPLIT_BACKEND_URL}/api/entries`)
      .then((response) => response.json())
      .then((data) => {
        setEntries(data.entries);
        setFilteredEntries(data.entries);
        calculateMetrics(data.entries);
      })
      .catch((error) => console.error('Error fetching entries:', error));
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = entries;

    if (filters.sessionType) {
      filtered = filtered.filter(entry => entry.sessionType === filters.sessionType);
    }

    if (filters.microcycle) {
      filtered = filtered.filter(entry => entry.microcycle === parseInt(filters.microcycle, 10));
    }

    if (filters.objective) {
      filtered = filtered.filter(entry => 
        (entry.objective1 && entry.objective1.toLowerCase().includes(filters.objective.toLowerCase())) ||
        (entry.objective2 && entry.objective2.toLowerCase().includes(filters.objective.toLowerCase()))
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(entry => new Date(entry.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(entry => new Date(entry.date) <= new Date(filters.endDate));
    }

    setFilteredEntries(filtered);
    calculateMetrics(filtered);
  };

  const handleExportEntry = (entry) => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: `Training Session on ${entry.date}`,
              heading: 'Title',
            }),
            new Paragraph({
              text: `Microcycle: ${entry.microcycle}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Session Type: ${entry.sessionType}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Volume: ${entry.volume}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Intensity: ${entry.intensity}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Objective 1: ${entry.objective1}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Objective 2: ${entry.objective2 || 'N/A'}`,
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: 'Exercises',
              heading: 'Heading1',
              spacing: { after: 400 },
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Goal')] }),
                    new TableCell({ children: [new Paragraph('Type')] }),
                    new TableCell({ children: [new Paragraph('Focus')] }),
                    new TableCell({ children: [new Paragraph('Description')] }),
                    new TableCell({ children: [new Paragraph('Duration')] }),
                    new TableCell({ children: [new Paragraph('Fitness Indicator')] }),
                  ],
                }),
                ...entry.exercises.map(exercise => new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(exercise.goal)] }),
                    new TableCell({ children: [new Paragraph(exercise.exerciseType)] }),
                    new TableCell({ children: [new Paragraph(exercise.focus)] }),
                    new TableCell({ children: [new Paragraph(exercise.description)] }),
                    new TableCell({ children: [new Paragraph(`${exercise.duration} minutes`)] }),
                    new TableCell({ children: [new Paragraph(exercise.fitnessIndicator)] }),
                  ],
                })),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `Training_Session_${entry.date}.docx`);
    });
  };

  const handleAddEntry = (entry) => {
    fetch(`${REPLIT_BACKEND_URL}/api/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => { throw new Error(err.message); });
      }
      return response.json();
    })
    .then((data) => {
      const updatedEntries = [...entries, { ...entry, id: data.id }];
      setEntries(updatedEntries);
      setFilteredEntries(updatedEntries);
      calculateMetrics(updatedEntries);
    })
    .catch((error) => console.error('Error adding entry:', error));
  };

  const toggleExpandSession = (id) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  return (
    <div style={styles.container}>
      <Header />
      <FilterBar onFilterChange={handleFilterChange} />

      <div style={styles.metricsContainer}>
        <div style={styles.metricBox}>
          <span style={styles.metricNumber}>{metrics.sessions}</span>
          <span style={styles.metricLabel}>Sessions</span>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricNumber}>{metrics.minutes}</span>
          <span style={styles.metricLabel}>Minutes</span>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.heading}>Add a New Training Session</h2>
        <AddEntryForm onAddEntry={handleAddEntry} />
        <h2 style={styles.heading}>Training Sessions</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Microcycle</th>
                <th style={styles.th}>Session Type</th>
                <th style={styles.th}>Volume</th>
                <th style={styles.th}>Intensity</th>
                <th style={styles.th}>Goal</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <React.Fragment key={entry.id}>
                  <tr style={styles.row} onClick={() => toggleExpandSession(entry.id)}>
                    <td style={styles.td}>{entry.date}</td>
                    <td style={styles.td}>{entry.microcycle}</td>
                    <td style={styles.td}>{entry.sessionType}</td>
                    <td style={styles.td}>{entry.volume}</td>
                    <td style={styles.td}>{entry.intensity}</td>
                    <td style={styles.td}>{entry.objective1}</td>
                  </tr>
                  {expandedSessionId === entry.id && (
                    <tr>
                      <td style={styles.expandedRow} colSpan="6">
                        <div style={styles.expandedContent}>
                          <div style={styles.exportIconContainer}>
                            <FontAwesomeIcon
                              icon={faDownload}
                              style={styles.exportIcon}
                              onClick={() => handleExportEntry(entry)}
                              title="Export to Word"
                            />
                          </div>
                          <h3>Additional Details</h3>
                          <p><strong>Objective 2:</strong> {entry.objective2}</p>
                          <h4>Exercises:</h4>
                          <table style={styles.exerciseTable}>
                            <thead>
                              <tr>
                                <th style={styles.exerciseTableHeader}>Goal</th>
                                <th style={styles.exerciseTableHeader}>Type</th>
                                <th style={styles.exerciseTableHeader}>Focus</th>
                                <th style={styles.exerciseTableHeader}>Description</th>
                                <th style={styles.exerciseTableHeader}>Duration</th>
                                <th style={styles.exerciseTableHeader}>Fitness Indicator</th>
                              </tr>
                            </thead>
                            <tbody>
                              {entry.exercises.map(exercise => (
                                <tr key={exercise.id}>
                                  <td style={styles.exerciseTableCell}>{exercise.goal}</td>
                                  <td style={styles.exerciseTableCell}>{exercise.exerciseType}</td>
                                  <td style={styles.exerciseTableCell}>{exercise.focus}</td>
                                  <td style={styles.exerciseTableCell}>{exercise.description}</td>
                                  <td style={styles.exerciseTableCell}>{exercise.duration}</td>
                                  <td style={styles.exerciseTableCell}>{exercise.fitnessIndicator}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'San Francisco, Arial, sans-serif',
    color: '#333',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    padding: '20px',
  },
  metricsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    padding: '10px 0',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
  },
  metricBox: {
    flex: 1,
    textAlign: 'center',
    padding: '20px',
    borderRight: '1px solid #e6e6e6',
    fontSize: '14px',
  },
  metricNumber: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '600',
    color: '#000',
  },
  metricLabel: {
    display: 'block',
    marginTop: '5px',
    color: '#555',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'left',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    fontSize: '16px',
    minWidth: '600px',
  },
  th: {
    padding: '12px 15px',
    backgroundColor: '#f1f1f1',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #e6e6e6',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #e6e6e6',
    color: '#555',
  },
  row: {
    cursor: 'pointer',
  },
  expandedRow: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
  },
  expandedContent: {
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  exportIconContainer: {
    position: 'absolute',
    right: '10px',
    top: '10px',
  },
  exportIcon: {
    fontSize: '24px',
    color: '#4CAF50',
    cursor: 'pointer',
  },
  exerciseTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  exerciseTableHeader: {
    padding: '8px 10px',
    backgroundColor: '#e1e1e1',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
  },
  exerciseTableCell: {
    padding: '8px 10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'left',
  },
  '@media (max-width: 768px)': {
    metricsContainer: {
      flexDirection: 'column',
    },
    metricBox: {
      borderBottom: '1px solid #e6e6e6',
      borderRight: 'none',
      marginBottom: '10px',
    },
    table: {
      fontSize: '14px',
    },
    th: {
      padding: '8px 10px',
    },
    td: {
      padding: '8px 10px',
    },
  },
};

export default Dashboard;














