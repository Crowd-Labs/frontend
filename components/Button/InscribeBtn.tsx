import { toast } from "@/components/ui/use-toast"

const InscribeBtn = (props: { data: any }) => {
    const { data } = props
    return (
        // nested Link will cause some warn
        <div onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            
            toast({
                title: 'coming soon...',
            });
        }}>
            <div className='w-24 flex justify-between items-center gap-1 bg-[#404833] rounded-sm px-2 py-1'>
                <div className="w-6 overflow-hidden bg-inscribe bg-no-repeat bg-left -indent-32">inscribe</div>
                <div className="flex-1">inscribe</div>
            </div>
        </div>
    )
}

export default InscribeBtn