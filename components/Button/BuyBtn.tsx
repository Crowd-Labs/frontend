import Image from "next/image"
import opensealogo from "/public/images/opensealogo.png"
import Link from "next/link"
import { TESTNET_OPENSEA } from "@/constants"

const BuyButton = (props: { data: any}) => { //NewNFTCreateds | NewCollectionCreateds
    const { data } = props
    return (
        <Link href={`${TESTNET_OPENSEA}/assets/base-goerli/${data?.derivedCollectionAddr}/${data.tokenId||''}`} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()}>
            <div className='w-16 flex justify-center items-center gap-1 bg-[#CFF800A6] text-black rounded-sm'>
                <Image alt='buy' src={opensealogo} width={16} height={16} />
                <div>Buy</div>
            </div>
        </Link>
    )
}

export default BuyButton