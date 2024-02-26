import { cn, sanitizeDStorageUrl } from '@/lib/utils';
import React from "react";
import Image from '@/components/Image';

interface CardProps {
  src: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void
}

// Generate by stable_diffusion
export function NFTCard(props: CardProps) {
  const { src, className, ...rest } = props;
  return (
    <div
      className={cn('w-[16.625rem] h-80 relative flex flex-col', className)}
      {...rest}
    >
      <div className='flex-1'>
        {/* <Image src={src} alt="card" className="w-full h-full image-rendering-pixelated" width={242} height={300}/> */}
        <Image src={src} alt="card" className="w-full h-full image-rendering-pixelated" width={200} height={200} />
      </div>
      {props.children}
    </div>
  );
}
