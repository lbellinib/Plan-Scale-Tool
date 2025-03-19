import React, { useState, useEffect } from 'react';

function MeasurementTools({ canvas, scaleFactor, mode }) {
  const [points, setPoints] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!canvas) return;

    const handleClick = (e) => {
      if (mode !== 'distance' && mode !== 'area') return;
      const rect = canvas.getBoundingClientRect();
      const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const newPoints = [...points, point];
      setPoints(newPoints);

      const context = canvas.getContext('2d');
      context.strokeStyle = 'blue';
      context.lineWidth = 1;

      if (mode === 'distance' && newPoints.length === 2) {
        context.beginPath();
        context.moveTo(newPoints[0].x, newPoints[0].y);
        context.lineTo(newPoints[1].x, newPoints[1].y);
        context.stroke();
        const pixelDistance = Math.sqrt(
          (newPoints[1].x - newPoints[0].x) ** 2 + (newPoints[1].y - newPoints[0].y) ** 2
        );
        const inches = pixelDistance * scaleFactor;
        const feet = Math.floor(inches / 12);
        const remainingInches = (inches % 12).toFixed(1);
        setResult(`${feet}' ${remainingInches}"`);
        setPoints([]);
      } else if (mode === 'area' && newPoints.length > 1) {
        context.beginPath();
        context.moveTo(newPoints[newPoints.length - 2].x, newPoints[newPoints.length - 2].y);
        context.lineTo(newPoints[newPoints.length - 1].x, newPoints[newPoints.length - 1].y);
        context.stroke();
      }
    };

    const handleDoubleClick = (e) => {
      if (mode === 'area' && points.length > 2) {
        const context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) context.lineTo(points[i].x, points[i].y);
        context.closePath();
        context.stroke();
        const pixelArea = calculatePolygonArea(points);
        const sqInches = pixelArea * (scaleFactor ** 2);
        const sqFeet = (sqInches / 144).toFixed(2);
        setResult(`${sqFeet} sq ft`);
        setPoints([]);
      }
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('dblclick', handleDoubleClick);
    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [canvas, points, mode, scaleFactor]);

  return <div>{result && <p>Measurement: {result}</p>}</div>;
}

function calculatePolygonArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

export default MeasurementTools;
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
