import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const AddEntryForm = ({ onAddEntry, language }) => {
  const [step, setStep] = useState(1);

  // State variables for form fields
  const [date, setDate] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [microcycle, setMicrocycle] = useState('');
  const [objective1, setObjective1] = useState('');
  const [objective2, setObjective2] = useState('');
  const [exerciseData, setExerciseData] = useState([]); // State for exercises
  const [volume, setVolume] = useState('');
  const [intensity, setIntensity] = useState('');
  const [complexity, setComplexity] = useState('');

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      date,
      sessionType,
      microcycle,
      objective1,
      objective2,
      exercises: exerciseData, // Include exercises in the final submission
      volume,
      intensity,
      complexity,
    };
    onAddEntry(entry);

    // Reset form after submission
    setDate('');
    setSessionType('');
    setMicrocycle('');
    setObjective1('');
    setObjective2('');
    setExerciseData([]); // Clear exercises
    setVolume('');
    setIntensity('');
    setComplexity('');
    setStep(1);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.stepNav}>
        <div
          style={{
            ...styles.stepNavItem,
            borderBottom: step === 1 ? '2px solid #000' : '2px solid #ddd',
          }}
          onClick={() => setStep(1)}
        >
          {language === 'EN' ? 'Step 1' : 'Krok 1'}
        </div>
        <div
          style={{
            ...styles.stepNavItem,
            borderBottom: step === 2 ? '2px solid #000' : '2px solid #ddd',
          }}
          onClick={() => setStep(2)}
        >
          {language === 'EN' ? 'Step 2' : 'Krok 2'}
        </div>
        <div
          style={{
            ...styles.stepNavItem,
            borderBottom: step === 3 ? '2px solid #000' : '2px solid #ddd',
          }}
          onClick={() => setStep(3)}
        >
          {language === 'EN' ? 'Step 3' : 'Krok 3'}
        </div>
      </div>

      {step === 1 && (
        <Step1
          date={date}
          setDate={setDate}
          sessionType={sessionType}
          setSessionType={setSessionType}
          microcycle={microcycle}
          setMicrocycle={setMicrocycle}
          objective1={objective1}
          setObjective1={setObjective1}
          objective2={objective2}
          setObjective2={setObjective2}
          handleNext={handleNext}
          language={language} // Pass the language prop
        />
      )}

      {step === 2 && (
        <Step2
          exerciseData={exerciseData}
          setExerciseData={setExerciseData}
          handleNext={handleNext}
          handlePrev={handlePrev}
          language={language} // Pass the language prop
        />
      )}

      {step === 3 && (
        <Step3
          volume={volume}
          setVolume={setVolume}
          intensity={intensity}
          setIntensity={setIntensity}
          complexity={complexity}
          setComplexity={setComplexity}
          exerciseData={exerciseData}  // Pass exercise data to Step 3
          handlePrev={handlePrev}
          handleSubmit={handleSubmit}
          language={language} // Pass the language prop
        />
      )}
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px', // Consistent spacing between fields
    maxWidth: '600px',
    margin: '0 auto',
  },
  stepNav: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '24px', // Spacing between the pagination and the form fields
    borderBottom: '1px solid #ddd',
  },
  stepNavItem: {
    flex: 1,
    padding: '14px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '0 10px', // Spacing between each step item
  },
};

export default AddEntryForm;





