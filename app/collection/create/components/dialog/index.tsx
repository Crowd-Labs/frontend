import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { ethers } from 'ethers';

interface DialogConfirm extends Dialog.DialogProps {
  stakeEthAmount: number;
  onConfirm: () => void;
}

const DialogConfirm = (props: DialogConfirm) => {
  const { stakeEthAmount, onConfirm, ...rest } = props
  return (
    <Dialog.Root {...rest}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#161b10] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-white my-8 text-2xl font-medium text-center">
            Are you sure to stake <span className='text-egg'>{ethers.formatEther(BigInt(stakeEthAmount??0))} Eth</span>  to create a collection for free?
          </Dialog.Title>
          <Dialog.Description className="text-white mt-8 text-[15px] leading-normal text-center">
            You can get back your staked Eth(<span className='text-egg'>From Blast</span>) back after 7 days!
          </Dialog.Description>
          <Dialog.Description className="text-white text-[15px] leading-normal text-center">
            You can view your collection after transaction confirmed on blockchain(about one minute).
          </Dialog.Description>

          <div className="my-10 flex justify-center gap-20">
            <Button variant="green" onClick={onConfirm} className='text-2xl'>Stake & Create</Button>
            <Dialog.Close asChild>
              <Button variant="green" className='text-2xl'>Cancel</Button>
            </Dialog.Close>
          </div>

          {/* <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close> */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

export default DialogConfirm;