import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from '@/components/Image';

export type UploadProps = React.HTMLAttributes<HTMLDivElement> & {
  onChange?: (value?: File) => void;
  value?: File;
  accept?: string;
  showTip?: boolean
};
// export interface UploadProps extends InputProps {
//   children?: React.ReactNode;
//   onChange: (value: File) => void;
// }
const defaultAccept = 'image/*';

const Upload = React.forwardRef<HTMLInputElement, UploadProps>(
  ({
    className, value, showTip = false, accept = defaultAccept, onChange, ...props
  }, ref) => {
    const handleFileOnChange: React.ChangeEventHandler<HTMLInputElement> = (
      event,
    ) => {
      const file = event.target.files?.[0];
      onChange?.(file);
    };


    return (
      <div className="flex items-center">
        <div className="flex flex-col w-full items-center border border-gray-500 rounded-sm p-2">
          <div className="flex items-center justify-center h-48 w-full relative">
            <Input
              type="file"
              className={cn(
                'absolute w-full h-full opacity-0 cursor-pointer',
                className,
              )}
              ref={ref}
              {...props}
              accept={accept}
              onChange={handleFileOnChange}
            />
            {value ? (
              <Image className="h-48 pointer-events-none aspect-auto" src={URL.createObjectURL(value)} alt="" />
            ) : (
              <Image src={"/images/holder.png"} className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-20 h-20 pointer-events-none" />
            )}
          </div>
          {showTip && <div className='text-lg text-white/40'>Recommended size: 350 x 350</div>}
        </div>
        {accept !== defaultAccept && value ? value.name : ''}
        {props.children}
      </div>
    );
  },
);
Upload.displayName = 'Upload';
export default Upload;
