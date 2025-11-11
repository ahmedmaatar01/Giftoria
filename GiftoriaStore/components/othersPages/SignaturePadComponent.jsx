import React, { useRef, useEffect, useLayoutEffect } from "react";
import SignaturePad from "signature_pad";

export default function SignaturePadComponent({ value, onChange }) {
  const canvasRef = useRef(null);
  const sigPadRef = useRef(null);
  const onChangeRef = useRef(onChange);

  console.log('🎨 SignaturePadComponent rendered with value:', value ? value.substring(0, 30) + '...' : 'empty');
  
  // Keep onChangeRef updated with the latest onChange callback
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Initialize signature pad
  useLayoutEffect(() => {
    console.log('📝 useLayoutEffect called - initializing SignaturePad');
    
    const canvas = canvasRef.current;
    console.log('📝 Canvas element:', canvas);
    
    if (!canvas) {
      console.error('❌ Canvas ref is null!');
      return;
    }
    
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    
    console.log('📝 Canvas dimensions:', { width: canvas.width, height: canvas.height, ratio });
    
    const signaturePad = new SignaturePad(canvas, {
      onBegin: () => {
        console.log('🎯 onBegin: User started drawing');
      },
      onEnd: () => {
        console.log('🎯 onEnd: User finished drawing stroke');
        const dataURL = signaturePad.isEmpty() ? "" : signaturePad.toDataURL();
        console.log('🖊️ Signature drawn, calling onChange with:', {
          isEmpty: signaturePad.isEmpty(),
          dataURLLength: dataURL.length,
          dataURLPreview: dataURL.substring(0, 50)
        });
        // Use onChangeRef.current to always call the latest onChange callback
        onChangeRef.current(dataURL);
      },
      minWidth: 1,
      maxWidth: 2.5,
      penColor: "#222"
    });
    
    sigPadRef.current = signaturePad;
    
    console.log('✅ SignaturePad initialized successfully');
    console.log('✅ SignaturePad instance:', signaturePad);
    console.log('✅ Event listeners attached');
    
    // DEBUG: Add manual mouse event listener to verify canvas is receiving events
    const testMouseDown = (e) => {
      console.log('🖱️ MANUAL mousedown detected on canvas at:', e.clientX, e.clientY);
    };
    canvas.addEventListener('mousedown', testMouseDown);
    canvas.addEventListener('touchstart', (e) => {
      console.log('👆 MANUAL touchstart detected on canvas');
    });
    
    // Restore existing signature if any
    if (value && value.startsWith("data:image")) {
      console.log('🔄 Restoring existing signature');
      const img = new window.Image();
      img.onload = () => {
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
      };
      img.src = value;
    }
    
    return () => {
      console.log('🧹 Cleanup: Removing SignaturePad event listeners');
      canvas.removeEventListener('mousedown', testMouseDown);
      signaturePad.off();
    };
  }, []); // Empty deps - only run on mount/unmount
  
  // Update canvas when value changes externally (e.g., when clearing)
  useEffect(() => {
    if (!sigPadRef.current) return;
    
    if (!value || value === "") {
      sigPadRef.current.clear();
    } else if (value.startsWith("data:image")) {
      const canvas = canvasRef.current;
      const img = new window.Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
      };
      img.src = value;
    }
  }, [value]);

  // Clear button
  const handleClear = () => {
    sigPadRef.current.clear();
    // Use onChangeRef.current to always call the latest onChange callback
    onChangeRef.current("");
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: 8, width: "100%", height: 120, background: "#fff" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: 120, display: "block", touchAction: "none" }}
        />
      </div>
      <button type="button" className="btn btn-sm btn-outline-secondary mt-2" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
}
