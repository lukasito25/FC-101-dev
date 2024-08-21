import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const Step2 = ({ exerciseData = [], setExerciseData, handleNext, handlePrev, language }) => {
  const [exerciseGoal, setExerciseGoal] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [focus, setFocus] = useState('');
  const [description, setDescription] = useState('');
  const [fitnessIndicator, setFitnessIndicator] = useState('');
  const [duration, setDuration] = useState('');

  const handleAddExercise = () => {
    const newExercise = {
      id: exerciseData.length + 1,
      goal: exerciseGoal,
      type: exerciseType,
      focus: focus,
      description: description,
      fitnessIndicator: fitnessIndicator,
      duration: duration,
    };

    setExerciseData([...exerciseData, newExercise]);

    // Reset fields
    setExerciseGoal('');
    setExerciseType('');
    setFocus('');
    setDescription('');
    setFitnessIndicator('');
    setDuration('');
  };

  const handleRemoveExercise = (id) => {
    const updatedExercises = exerciseData.filter((exercise) => exercise.id !== id);
    setExerciseData(updatedExercises);
  };

  return (
    <div>
      <div style={styles.formGroup}>
        <label style={styles.label}>{language === 'EN' ? 'Exercise Goal' : 'Cieľ cvičenia'}:</label>
        <select value={exerciseGoal} onChange={(e) => setExerciseGoal(e.target.value)} style={styles.select}>
          <option value="">{language === 'EN' ? 'Select Goal' : 'Vyberte cieľ'}</option>
          <option value="HT">HT</option>
          <option value="HN">HN</option>
          <option value="KT">KT</option>
          <option value="NP">NP</option>
          <option value="KC">KC</option>
          <option value="RC">RC</option>
          <option value="RZ">RZ</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>{language === 'EN' ? 'Exercise Type' : 'Typ cvičenia'}:</label>
        <select value={exerciseType} onChange={(e) => setExerciseType(e.target.value)} style={styles.select}>
          <option value="">{language === 'EN' ? 'Select Type' : 'Vyberte typ'}</option>
          <option value="PC">PC</option>
          <option value="HC">HC</option>
          <option value="PH">PH</option>
          <option value="VH">VH</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>{language === 'EN' ? 'Focus' : 'Zameranie'}:</label>
        <select value={focus} onChange={(e) => setFocus(e.target.value)} style={styles.select}>
          <option value="">{language === 'EN' ? 'Select Focus' : 'Vyberte zameranie'}</option>
          <option value="HCJ">HCJ</option>
          <option value="HK">HK</option>
          <option value="HS">HS</option>
          <option value="SHS">SHS</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>{language === 'EN' ? 'Description' : 'Popis'}:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>{language === 'EN' ? 'Fitness Indicator' : 'Indikátor kondície'}:</label>
        <select value={fitnessIndicator} onChange={(e) => setFitnessIndicator(e.target.value)} style={styles.select}>
          <option value="">{language === 'EN' ? 'Select Indicator' : 'Vyberte indikátor'}</option>
          <option value="R">R</option>
          <option value="S">S</option>
          <option value="V">V</option>
          <option value="Koo">Koo</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>{language === 'EN' ? 'Duration (minutes)' : 'Trvanie (minúty)'}:</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={styles.input}
          min="1"
        />
      </div>

      <div style={styles.buttonGroupRight}>
        <button type="button" onClick={handleAddExercise} style={styles.addButton}>
          {language === 'EN' ? 'Add Exercise' : 'Pridať cvičenie'}
        </button>
      </div>

      <h3 style={styles.addedExercisesTitle}>{language === 'EN' ? 'Added Exercises' : 'Pridané cvičenia'}</h3>
      <div style={styles.exerciseTable}>
        <div style={styles.exerciseTableHeader}>
          <div style={styles.attribute}>ID</div>
          <div style={styles.attribute}>{language === 'EN' ? 'Goal' : 'Cieľ'}</div>
          <div style={styles.attribute}>{language === 'EN' ? 'Duration' : 'Trvanie'}</div>
        </div>
        {exerciseData.map((exercise) => (
          <div key={exercise.id} style={styles.exerciseTableRow}>
            <div style={styles.data}>{exercise.id}</div>
            <div style={styles.data}>{exercise.goal}</div>
            <div style={styles.data}>
              {exercise.duration} min
              <FaTrash
                style={styles.trashIcon}
                onClick={() => handleRemoveExercise(exercise.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={styles.buttonGroup}>
        <button type="button" onClick={handlePrev} style={styles.button}>
          {language === 'EN' ? 'Previous' : 'Predchádzajúci'}
        </button>
        <button type="button" onClick={handleNext} style={styles.button}>
          {language === 'EN' ? 'Next' : 'Ďalej'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#333',
  },
  select: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
    transition: 'border 0.3s ease',
  },
  textarea: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
    transition: 'border 0.3s ease',
    minHeight: '100px',
    resize: 'vertical',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
    transition: 'border 0.3s ease',
  },
  addButton: {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  addedExercisesTitle: {
    marginTop: '32px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  exerciseTable: {
    marginTop: '16px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  exerciseTableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#e9e9e9',
    fontWeight: '600',
  },
  exerciseTableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderTop: '1px solid #ddd',
  },
  attribute: {
    flex: 1,
    fontWeight: '500',
    fontSize: '14px',
    color: '#333',
  },
  data: {
    flex: 1,
    fontSize: '14px',
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trashIcon: {
    color: '#dc3545',
    marginLeft: '10px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
  },
  buttonGroupRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#000',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default Step2;








