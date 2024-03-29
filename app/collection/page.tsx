import { Tabs, TabsContent } from "@/components/ui/tabs"
import CollectionCards from "./collections";
import { Divider } from "@/components/Footer";
const Collection = () => {
  return (
    <div>
      <Divider className="my-0" />
      <Tabs defaultValue="Collections" className="mt-12">
        {/* <TabsList className="bg-transparent text-xl text-white">
          <TabsTrigger value="Collections">Collections</TabsTrigger>
        </TabsList> */}
        {/* <div className="border-b-2 border-[#D9D9D9] mt-6 mb-16"></div> */}
        <h1 className="h2-heading">Popular Collection</h1>
        <TabsContent value="Collections">
          <CollectionCards />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Collection