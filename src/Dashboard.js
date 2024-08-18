import React, { useEffect, useState } from 'react';
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

  const handleExport = () => {
    // Implement export functionality here
    console.log('Exporting filtered data:', filteredEntries);
  };

  const handleAddEntry = (entry) => {
    fetch(`${REPLIT_BACKEND_URL}/api/entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),  // Ensure entry is correctly formatted
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

  return (
    <div style={styles.container}>
      <Header />
      <FilterBar onFilterChange={handleFilterChange} onExport={handleExport} />

      {/* Top Metrics Section */}
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
                <tr key={entry.id}>
                  <td style={styles.td}>{entry.date}</td><td style={styles.td}>{entry.microcycle}</td><td style={styles.td}>{entry.sessionType}</td><td style={styles.td}>{entry.volume}</td><td style={styles.td}>{entry.intensity}</td><td style={styles.td}>{entry.objective1}</td>
                </tr>
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





