import React, { useState, useEffect } from 'react';

function Calibration({ canvas, setScaleFactor, onCalibrationComplete }) {
  const [points, setPoints] = useState([]);
  const [realFeet, setRealFeet] = useState(0);
  const [realInches, setRealInches] = useState(0);

  useEffect(() => {
    if (!canvas) return;

    const handleClick = (e) => {
      if (points.length >= 2) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newPoints = [...points, { x, y }];
      setPoints(newPoints);

      if (newPoints.length === 2) {
        const context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(newPoints[0].x, newPoints[0].y);
        context.lineTo(newPoints[1].x, newPoints[1].y);
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.stroke();
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [canvas, points]);

  const calculateScale = () => {
    if (points.length === 2) {
      const pixelDistance = Math.sqrt(
        (points[1].x - points[0].x) ** 2 + (points[1].y - points[0].y) ** 2
      );
      const realDistance = realFeet * 12 + parseFloat(realInches || 0);
      setScaleFactor(realDistance / pixelDistance); // inches per pixel
      setPoints([]);
      if (onCalibrationComplete) onCalibrationComplete();
    }
  };

  return (
    <div>
      <p>Click two points on a known distance, then enter the real length.</p>
      <input
        type="number"
        min="0"
        value={realFeet}
        onChange={(e) => setRealFeet(e.target.value)}
        placeholder="Feet"
      />
      <input
        type="number"
        min="0"
        step="0.1"
        value={realInches}
        onChange={(e) => setRealInches(e.target.value)}
        placeholder="Inches"
      />
      <button onClick={calculateScale} disabled={points.length !== 2}>
        Set Scale
      </button>
    </div>
  );
}

export default Calibration;
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
