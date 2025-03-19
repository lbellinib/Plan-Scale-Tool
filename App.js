import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import PlanViewer from './components/PlanViewer';
import Calibration from './components/Calibration';
import MeasurementTools from './components/MeasurementTools';
import './styles.css';

function App() {
  const [file, setFile] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [resetCanvas, setResetCanvas] = useState(null);
  const [scaleFactor, setScaleFactor] = useState(null);
  const [mode, setMode] = useState('calibrate'); // 'calibrate', 'distance', 'area'

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setScaleFactor(null);
    setMode('calibrate');
  };

  const handleCanvasReady = ({ canvas, resetCanvas }) => {
    setCanvas(canvas);
    setResetCanvas(() => resetCanvas);
  };

  const setMeasurementMode = (newMode) => {
    if (resetCanvas) resetCanvas();
    setMode(newMode);
  };

  return (
    <div className="container">
      <h1>Plan-Scale-Tool</h1>
      <FileUpload onFileSelect={handleFileSelect} />
      {file && (
        <div>
          <PlanViewer file={file} onCanvasReady={handleCanvasReady} />
          {canvas && mode === 'calibrate' && (
            <Calibration
              canvas={canvas}
              setScaleFactor={setScaleFactor}
              onCalibrationComplete={resetCanvas}
            />
          )}
          {scaleFactor && (
            <div>
              <button onClick={() => setMeasurementMode('distance')}>
                Measure Distance
              </button>
              <button onClick={() => setMeasurementMode('area')}>
                Measure Area
              </button>
              <button onClick={resetCanvas}>Clear Measurements</button>
              {mode !== 'calibrate' && (
                <MeasurementTools
                  canvas={canvas}
                  scaleFactor={scaleFactor}
                  mode={mode}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
