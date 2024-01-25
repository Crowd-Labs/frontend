
import Image, { StaticImageData } from 'next/image'

type LaunchpadProps = {
  collName: string,
  pic: StaticImageData
}

const LaunchpadCard = ({ collName, pic }: LaunchpadProps) => {
  return (
    <div className="rounded-lg overflow-hidden relative">
      <Image src={pic} alt={collName} className='object-fit w-full' />
    </div>
  )
}

export default LaunchpadCard