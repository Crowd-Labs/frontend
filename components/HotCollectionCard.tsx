
import Image from 'next/image'

const HotCollectionCard = ({collName, pic, cata}) => {
  return (
        <Image src={pic} alt={collName} className='object-fit w-48'/>
  )
}

export default HotCollectionCard