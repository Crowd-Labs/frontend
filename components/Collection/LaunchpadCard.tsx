
import Image from 'next/image'

const LaunchpadCard = ({ collName, pic }) => {
  return (
    <div className="rounded-lg overflow-hidden relative">
      <Image src={pic} alt={collName} className='object-fit w-full' />
    </div>
  )
}

export default LaunchpadCard