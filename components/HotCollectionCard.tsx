
import Image, { StaticImageData } from 'next/image'

type HotColltionProps = {
  collName: string,
  pic: StaticImageData,
  cata: string
}

const HotCollectionCard = ({collName, pic, cata}: HotColltionProps) => {
  return (
        <Image src={pic} alt={collName} className='object-fit w-full'/>
  )
}

export default HotCollectionCard