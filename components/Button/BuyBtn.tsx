import Link from "next/link"
import { ELEMENT_MARKET } from "@/constants"

const BuyButton = (props: { data: any }) => { //NewNFTCreateds | NewCollectionCreateds
    const { data } = props
    return (
        <Link href={`${ELEMENT_MARKET}/assets/blast_testnet/${data?.derivedCollectionAddr}/${data.tokenId || ''}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            <div className='w-16 flex justify-center items-center gap-1 bg-[#CFF800A6] text-black rounded-sm'>
                <div className="w-4 overflow-x-hidden bg-element bg-no-repeat bg-[length:66px_16px] bg-left -indent-32">element</div>
                <div className="w-8">Buy</div>
            </div>
        </Link>
    )
}

export default BuyButton