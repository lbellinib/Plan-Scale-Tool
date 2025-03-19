import React, { useRef, useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';

function PlanViewer({ file, onCanvasReady }) {
  const canvasRef = useRef(null);
  const [planDataUrl, setPlanDataUrl] = useState(null);

  useEffect(() => {
    if (!file) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const renderPlan = async () => {
      if (file.type === 'application/pdf') {
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
      } else {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          setPlanDataUrl(canvas.toDataURL());
          onCanvasReady({ canvas, resetCanvas });
        };
        img.src = URL.createObjectURL(file);
        return;
      }
      setPlanDataUrl(canvas.toDataURL());
      onCanvasReady({ canvas, resetCanvas });
    };

    renderPlan();
  }, [file, onCanvasReady]);

  const resetCanvas = () => {
    if (planDataUrl) {
      const img = new Image();
      img.onload = () => {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(img, 0, 0);
      };
      img.src = planDataUrl;
    }
  };

  return <canvas ref={canvasRef} style={{ border: '1px solid black' }} />;
}

export default PlanViewer;
​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
