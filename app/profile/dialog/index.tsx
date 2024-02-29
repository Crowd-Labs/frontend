import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Divider } from '@/components/Footer';
import { Cross2Icon } from '@radix-ui/react-icons';
import Image from '@/components/Image';

interface BitCoinConfirmProps extends Dialog.DialogProps {
  onConfirm: () => void;
}

const BitCoinConfirm = (props: BitCoinConfirmProps) => {
  const { onConfirm, ...rest } = props
  return (
    <Dialog.Root {...rest}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-72 max-h-[85vh] w-[90vw] max-w-[320px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-[#161b10] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-white text-sm font-medium">
            Bitcoin Wallet
          </Dialog.Title>
          <Divider />
          <Dialog.Description className="text-white text-xs leading-normal">
            Choose how you want to connect. If you don't have a wallet, please install first.
          </Dialog.Description>

          <div className="flex flex-col justify-center mt-4 gap-6 text-white">
            <div className='h-9 flex items-center border border-gray-400 cursor-pointer' onClick={onConfirm}>
              <div className='w-8 h-full flex items-center justify-center border-r border-gray-400'>
                <Image src="/icons/unisat.png" alt="" />
              </div>
              <div className='flex-1 text-center'>
                Unisat Wallet
              </div>
            </div>
            <div className='h-9 flex items-center border border-gray-400 cursor-pointer' onClick={onConfirm}>
              <div className='w-8 h-full flex items-center justify-center border-r border-gray-400'>
                <Image src="/icons/okx.png" alt="" />
              </div>
              <div className='flex-1 text-center'>
                OKX Wallet
              </div>
            </div>
          </div>
          <Dialog.Close asChild>
            <button
              className="text-white hover:bg-white/40 focus:shadow-white/70 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

export default BitCoinConfirm;