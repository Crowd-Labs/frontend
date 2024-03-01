import { getUserAsserts } from "@/api/thegraphApi";
import { CreatorRank } from "@/lib/type";
import { useState } from "react";
import { useAccount } from "wagmi";

const Points = () => {

  const [userAssert, setUserAsserts] = useState<CreatorRank>()
  const account = useAccount({
    onConnect: (data) => getUserAsserts(data.address).then(res => setUserAsserts(res)),
    onDisconnect: () => console.log('disconnected'),
  });
  console.log(account);

  if (!account.isConnected) {
    return false
  }
  return (
    <div className="text-white font-bold">
      Points :<span className="text-egg">{Number(userAssert?.itemsNFT ?? 0) * 12 + Number(userAssert?.itemsCollection ?? 0) * 8}</span>
    </div>
  )
}

export default Points