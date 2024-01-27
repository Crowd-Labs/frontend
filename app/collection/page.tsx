import { Tabs, TabsContent} from "@/components/ui/tabs"
import CollectionCards from "./collections";
const AiWork = () => {
  return (
    <div>
      <div className="border-b-2 border-[#D9D9D9] mt-7"></div>
      <Tabs defaultValue="Collections" className="mt-12">
        {/* <TabsList className="bg-transparent text-xl text-white">
          <TabsTrigger value="Collections">Collections</TabsTrigger>
        </TabsList> */}
        {/* <div className="border-b-2 border-[#D9D9D9] mt-6 mb-16"></div> */}
        <h1 className="h2-heading">Poprlar Collection</h1>
        <TabsContent value="Collections">
          <CollectionCards />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AiWork