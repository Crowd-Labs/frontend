"use client";
import React from 'react'
import { hamburger, logo } from "../../public/icons";
import { GITHUB_ADDRESS, TWITTER_ADDRESS, navLinks } from "@/constants";
import Image from 'next/image';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '../ui/button';
import { BsFillPersonLinesFill, BsGithub, BsTwitter } from "react-icons/bs";

const Header = () => {
  return (
    <header className='py-8'>
      <nav className='flex-between'>
        <div className='flex gap-16'>
          <a href='/'>
            <Image
              src={logo}
              alt='logo'
              width={137.8}
              height={23.5}
            />
          </a>
          <ul className='flex-center flex-1 gap-12 max-md:hidden'>
            {
              navLinks.map((item) => (
                <Link key={item.label} href={item.href}
                  className=' nav-link' >
                  {item.label}
                </Link>
              ))
            }
          </ul>
        </div>
        <div className="flex gap-6 items-center">
          <Link target="_blank" href={TWITTER_ADDRESS}>
            <BsTwitter size={26} color='grey' />
          </Link>
          <Link target="_blank" href={GITHUB_ADDRESS}>
            <BsGithub size={26} color='grey' />
          </Link>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              // Note: If your app doesn't use authentication, you
              // can remove all 'authenticationStatus' checks
              const connected = mounted && account && chain;
              return (
                <div
                  {...(!mounted && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button
                          onClick={openConnectModal}
                          className="bg-[#FCFC03] font-bold text-[#9BA885]"
                        >
                          Connect Web3
                        </Button>
                      );
                    }
                    if (chain.unsupported) {
                      return (
                        <Button onClick={openChainModal} className='text-[#9BA885] font-bold'>Wrong network</Button>
                      );
                    }
                    return (
                      <div className="flex gap-3 text-yellow items-center">
                        <Button
                          onClick={openAccountModal}
                          className="flex items-center text-[#9BA885] font-semibold"
                          variant={"outline"}
                        >
                          {account.displayName}
                        </Button>
                        <Link href={"/User"}>
                          <BsFillPersonLinesFill className="text-3xl cursor-pointer" />
                        </Link>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
        <div className='hidden max-md:block'>
          <Image src={hamburger} alt='hamburger icon' width={25} height={25} />
        </div>
      </nav>
    </header>
  )
}

export default Header