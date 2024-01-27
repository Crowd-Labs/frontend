import React from 'react';
import Image from 'next/image';
import footer_logo from '/public/icons/footer_logo.png';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { BRCROWD_DOC, TWITTER_ADDRESS } from '@/constants';


export const Divider = (props: { className?: string }) => {
  return <div className={cn("border-t-2 border-[#9BA885] my-4", props.className)} />
}

function Footer() {
  return (
    <footer className="py-8 w-full text-white text-xl">
      <Divider />
      <div className="flex mt-20 gap-40 items-end">
        <div className="flex-1">
          <Image src={footer_logo} width={100} height={100} alt="" />
          <div className="mt-10">
            The first co-creation platform for user to make their idea
            come true with linked-minded people. Co-Creation, Earn, Buy
            and sell digital items.
          </div>
        </div>

        <div className="flex-1 flex justify-end gap">
          <div className="flex-1">
            <div className="text-2xl font-bold">Resources</div>
            <div className="flex flex-col gap-2 mt-4">
              <div>Blog</div>
              <div>Learn</div>
              <Link target="_blank" href={BRCROWD_DOC!}>
                Doc
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold">Community</div>
            <div className="flex flex-col gap-2 mt-4">
              <Link target="_blank" href={TWITTER_ADDRESS!}>
                Twitter
              </Link>
              <div>Discord</div>
              <div>Telegram</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
