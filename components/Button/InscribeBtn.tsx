import { NewNFTCreateds } from "@/lib/type"

interface InscribeBtnProps extends React.HTMLAttributes<HTMLDivElement>{
    data: NewNFTCreateds
}

const InscribeBtn = (props: InscribeBtnProps) => {
    const { data, ...rest } = props
    return (
        // nested Link will cause some warn
        <div {...rest}>
            <div className='w-24 flex justify-between items-center gap-1 bg-[#404833] rounded-sm px-2 py-1'>
                <div className="w-6 overflow-hidden bg-inscribe bg-no-repeat bg-left -indent-32">inscribe</div>
                <div className="flex-1">inscribe</div>
            </div>
        </div>
    )
}

export default InscribeBtn