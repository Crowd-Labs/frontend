import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';


interface DialogConfirm extends Dialog.DialogProps {
  onConfirm: () => void;
}

const DialogConfirm = (props: DialogConfirm) => {
  const { onConfirm, ...rest } = props
  return (
    <Dialog.Root {...rest}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#161b10] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-white my-8 text-2xl font-medium text-center">
            Are you sure to pay <span className='text-egg'>0.X Eth</span> to co-create this collection?<br/>
            Nft will display after TX confirm on blockchain(less than one min)
          </Dialog.Title>
          <div className="my-10 flex justify-center gap-20">
            <Button variant="green" onClick={onConfirm} className='text-2xl'>Stake & Create</Button>
            <Dialog.Close asChild>
              <Button variant="green" className='text-2xl'>Cancel</Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

export default DialogConfirm;