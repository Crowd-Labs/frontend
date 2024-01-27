import { Separator } from "@/components/ui/separator";

export default function ForkNFT({ params }: { params: { id: string, nftId: string, paramId: string } }) {
  const { id, nftId, paramId } = params
  return (
    <div className="var-dark">
      <Separator className="my-6" />
      <div className="flex-1 text-white text-2xl mt-8">
        canvas
      </div>
    </div>
  );
}
