import React from 'react';
import Image from 'next/image';

interface HorizontalImgProps {
  src: string;
  alt: string;
  width?: string;
}

export const HorizontalImg: React.FC<HorizontalImgProps> = ({
  src,
  alt,
  width = '100%',
}) => {
  if (width === '100%') {
    return (
      <div className="flex items-center justify-center">
        <Image
          src={src}
          alt={alt}
          style={{ width: '100%', height: 'auto' }}
          width={1200}
          height={800}
        />
      </div>
    );
  }

  // convert px to number
  const numericWidth =
    width && width.endsWith('px') ? parseInt(width) : undefined;

  return (
    <div className="flex items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={numericWidth}
        height={800}
        style={{ height: 'auto' }}
      />
    </div>
  );
};
