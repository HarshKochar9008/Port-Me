import { useEffect, useState } from 'react';
import ShapeBlur from './ShapeBlur';

interface ShapeBlurContainerProps {
  className?: string;
  variation?: number;
  shapeSize?: number;
  roundness?: number;
  borderSize?: number;
  circleSize?: number;
  circleEdge?: number;
}

const ShapeBlurContainer = ({
  className = '',
  variation = 0,
  shapeSize = 0.5,
  roundness = 0.5,
  borderSize = 0.05,
  circleSize = 0.5,
  circleEdge = 1
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
        variation={variation}
        pixelRatioProp={pixelRatio}
        shapeSize={shapeSize}
        roundness={roundness}
        borderSize={borderSize}
        circleSize={circleSize}
        circleEdge={circleEdge}
      />
    </div>
  );
};

export default ShapeBlurContainer; 