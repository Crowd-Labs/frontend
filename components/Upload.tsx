import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type UploadProps = React.HTMLAttributes<HTMLDivElement> & {
  onChange?: (value?: File) => void;
  value?: File;
  accept?: string;
};
// export interface UploadProps extends InputProps {
//   children?: React.ReactNode;
//   onChange: (value: File) => void;
// }
const defaultAccept = 'image/*';

const Upload = React.forwardRef<HTMLInputElement, UploadProps>(
  ({
    className, value, accept = defaultAccept, onChange, ...props
  }, ref) => {
    const handleFileOnChange: React.ChangeEventHandler<HTMLInputElement> = (
      event,
    ) => {
      const file = event.target.files?.[0];
      onChange?.(file);
    };


    return (
      <div className="flex flex-row items-center">
        <div className="flex border border-gray-500 w-full h-48 relative rounded-sm justify-center p-2">
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
            <img className="h-full pointer-events-none aspect-auto" src={URL.createObjectURL(value)} alt="" />
          ) : (
            <img src={"/images/holder.png"} className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-20 h-20 pointer-events-none" />
          )}
        </div>
        {accept !== defaultAccept && value ? value.name : ''}
        {props.children}
      </div>
    );
  },
);
Upload.displayName = 'Upload';
export default Upload;
