import * as React from 'react';
import { PlusIcon } from '@radix-ui/react-icons';
import { Input, InputProps } from '@/components/ui/input';
import { cn, getBase64 } from '@/lib/utils';

import Image from 'next/image';

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
    const [base64, setBase64] = React.useState('');
    React.useEffect(() => {
      if (value && accept === defaultAccept) {
        getBase64(value).then(setBase64);
      }
    }, [value, accept]);

    return (
      <div className="flex flex-row items-center">
        <div className="border w-full h-40 relative">
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
          {base64 ? (
            <Image className=" w-full h-full" src={base64} alt="" />
          ) : (
            <PlusIcon className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-20 h-20" />
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
