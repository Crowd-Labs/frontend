import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { BsPlusLg, } from 'react-icons/bs';
import { toast } from '@/components/ui/use-toast';

export const DEFAULT_PIX_GRID_NUMBER = 32;
const MIN = 16;
const MAX = 128;
const options = [1, 2, 4, 5, 8, 10, 16, 20, 32, 40, 64]
const getClosetNumerDivdBy640 = (number: number) => {
  const cloest = options.find(num => num >= number) ?? DEFAULT_PIX_GRID_NUMBER
  return cloest
}

export default function PixDialogForm(props: { onConfirm: (info: number) => void }) {

  const [value, setValue] = useState<number>(DEFAULT_PIX_GRID_NUMBER)

  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-white px-16 my-8 text-2xl font-medium text-center">
        <div
          className="flex flex-col items-center justify-center w-48 h-48 mt-4 text-white/40 rounded-md border border-gray-500 p-2 text-lg"
        >
          <img src={"/images/holder.png"} className="w-20 h-20 mb-2" />
          Initial Ancestor NFT
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[55vh] w-[45vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#161b10] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-white my-8 text-2xl font-medium text-center">
            Select the Dimensions Of The Grid
          </Dialog.Title>
          <div className="text-white my-8 text-[15px] leading-normal text-center">
            <div className='my-10 flex justify-center gap-12 text-2xl items-center'>
              <div className='flex items-center gap-2'>
                <div>W:</div>
                <Input type="number" className='w-20' min={MIN} max={MAX} value={value} onChange={(e) => {
                  const newValue = Number(e.target.value);
                  setValue(newValue)
                }} />
              </div>
              <div className='text-yellow'>X</div>
              <div className='flex items-center gap-2'>
                <div className='flex'>H:</div>
                <Input type="number" className='w-20' readOnly min={MIN} max={MAX} value={value} />
              </div>
            </div>
            <div className='my-10 flex justify-center gap-20'>
              <Button variant="green" onClick={() => {
                if (value > MAX) {
                  toast({
                    title: 'warning',
                    description: `the max number of the dimensions is ${MAX} ,please change`
                  });
                  return
                } else if (value < MIN) {
                  toast({
                    title: 'warning',
                    description: `the min number of the dimensions is ${MIN} ,please change`
                  });
                  return
                }
                // const newValue = getClosetNumerDivdBy640(value)
                props.onConfirm(value);
              }} className='text-2xl'>Confirm</Button>
              <Dialog.Close asChild>
                <Button variant="green" className='text-2xl'>Cancel</Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};