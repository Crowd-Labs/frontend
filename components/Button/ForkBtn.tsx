import Image from 'next/image';
// import Logo from "/public/logo.svg"
import Link from 'next/link';
import { NewNFTCreateds } from '@/lib/type';
import { IPFS_GATEWAY_URL } from '@/constants';

function ForkButton(props: { data: NewNFTCreateds }) {
  const { data } = props;
  const paramId = data?.detailJson?.image.replace(`${IPFS_GATEWAY_URL}/`, '');
  return (
    <Link href={`/nft/fork/${data.collectionId}/${data.tokenId}/${paramId}`}>
      <div className="w-16 flex justify-center items-center gap-1 bg-indigo-800 rounded-sm">
        {/* <Image alt='fork' src={Logo} width={16} height={16} /> */}
        <div>Fork</div>
      </div>
    </Link>
  );
}

export default ForkButton;
