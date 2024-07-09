import { getUserAsserts } from "@/api/thegraphApi";
import { accounts } from "@/constants/taskRewards";
import { Creator } from "@/lib/type";
import { useState } from "react";
import { useAccount } from "wagmi";

const Points = () => {

  const [userAssert, setUserAsserts] = useState<Creator>()
  const account = useAccount({
    onConnect: (data) => getUserAsserts(data.address).then(res => setUserAsserts(res)),
    onDisconnect: () => console.log('disconnected'),
  });

  const accountMap = {};
  accounts.forEach(user => {
      accountMap[user.address.toLowerCase()] = user.count;
  });

  if (!account.isConnected) {
    return false
  }

  function getCompletionCount(address) {
    return accountMap[address] || 0;
  }
  
  return (
    <div className="text-white font-bold">
      Points :<span className="text-egg">{Number(userAssert?.itemsCreateCollection ?? 0) * 20 + Number(userAssert?.itemsNFT ?? 0) * 12 + Number(userAssert?.itemsCollection ?? 0) * 8}</span>
      {"\u00A0\u00A0\u00A0\u00A0"}
      Extra Bitget Points :<span className="text-egg">{Number(getCompletionCount(account.address?.toLocaleLowerCase())) * 50}</span>
    </div>
  )
}

export default Points