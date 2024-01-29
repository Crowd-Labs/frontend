import { cn } from '@/lib/utils';
import Image from 'next/image';

interface IntroItemType {
  title: string;
  content: string;
  icon: string
}
const intros: IntroItemType[] = [
  {
    title: 'Stake to initial collection',
    content: 'Stake some eth to initial your collection for free.Get back your funds after a fixed time',
    icon: '/icons/icon0.png',
  },
  {
    title: 'Share yield & gas fee',
    content: 'All stake eth yield & gas fee from Blast_L2 will share with community ',
    icon: '/icons/icon1.png',
  },
  {
    title: 'Share Blast airdrop',
    content: 'Share blast airdrop with platform users',
    icon: '/icons/icon2.png',
  },
  {
    title: 'Share royalty fee',
    content: 'All creators can share the royalty fee from your co-create collection',
    icon: '/icons/icon3.png',
  },
];

function IntroItem(props: { data: IntroItemType, className?: string }) {
  const { data, className } = props;
  return (
    <div className={cn('flex gap-4 text-white w-[440px] text-2xl', className)}>
      <Image src={data.icon} width={50} height={50} alt="" className="object-none self-start" />
      <div className="flex-1">
        <div className="text-3xl text-yellow">
          {data.title}
        </div>
        <div className="mt-8">
          {data.content}
        </div>
      </div>
    </div>
  );
}

function Intros() {
  return (
    <section>
      <div className="text-center h1-heading mt-10">
        We will share
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-10 justify-between mt-12 [&>*:nth-child(2n)]:justify-self-end">
        {intros?.map((intro, index) => <IntroItem data={intro} key={intro.title} />)}
      </div>
    </section>
  );
}

export default Intros;
