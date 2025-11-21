import { useEffect, useState } from 'react';
import ShapeBlur from './ShapeBlur';

interface ShapeBlurContainerProps {
  className?: string;
  shapeSize?: number;
  shapeWidth?: number;
  shapeHeight?: number;
  roundness?: number;
  borderSize?: number;
}

const ShapeBlurContainer = ({
  className = '',
  shapeSize = 0.5,
  shapeWidth = 2.5,
  shapeHeight = 0.8,
  roundness = 0.3,
  borderSize = 0.01
}: ShapeBlurContainerProps) => {
  const [pixelRatio, setPixelRatio] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPixelRatio(window.devicePixelRatio || 1);
    }
  }, []);

  return (
    <div className={`absolute inset-0 w-full h-full z-0 overflow-hidden  ${className}`}>
      <ShapeBlur
        pixelRatioProp={pixelRatio}
        shapeSize={shapeSize}
        shapeWidth={shapeWidth}
        shapeHeight={shapeHeight}
        roundness={roundness}
        borderSize={borderSize}
      />
    </div>
  );
};

export default ShapeBlurContainer; 