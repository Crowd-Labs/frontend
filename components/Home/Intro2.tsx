import { cn } from '@/lib/utils';
import Image from 'next/image';

interface IntroItemType {
  title: string;
  content: string;
  icon: string
}
const intros: IntroItemType[] = [
  {
    title: 'START WITH A SMALL IDEA',
    content: `You just need provide a idea, 
        and set the rule, all guys who
        interested will help to make it
        come true.`,
    icon: '/icons/icon4.png',
  },
  {
    title: 'NFT STANDARD',
    content: `Fully compliant with the
        NFT721 standard, can be 
        traded on any NFT
        marketplace.`,
    icon: '/icons/icon5.png',
  },
  {
    title: 'ERC404',
    content: `Supporting ERC404 to enhance the liquidity of NFTs.
        For each minted NFT, a corresponding quantity of ERC20 
        tokens is also minted.`,
    icon: '/icons/icon6.png',
  },
  {
    title: 'Co-Creation',
    content: 'Each collection is created by different individuals with diverse creative ideas',
    icon: '/icons/icon7.png',
  },
  {
    title: 'Ordinals',
    content: `User can inscribe his work 
        to bitcoin network as ordinals NFT.`,
    icon: '/icons/icon8.png',
  },
  {
    title: 'Community',
    content: `Build community with 
        Linked-mined people.`,
    icon: '/icons/icon9.png',
  },
];

function IntroItem(props: { data: IntroItemType, className?: string }) {
  const { data, className } = props;
  return (
    <div className={cn('flex gap-2 text-white text-2xl', className)}>
      <Image src={data.icon} width={45} height={45} alt="" className="self-start" />
      <div className="flex-1">
        <div className="text-2xl text-yellow">
          {data.title}
        </div>
        <div className="mt-8 text-xl">
          {data.content}
        </div>
      </div>
    </div>
  );
}

function Intros2() {
  return (
    <section className="mt-32">
      <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-1 justify-between mt-12 gap-y-20">
        {intros?.map((intro, index) => <IntroItem data={intro} key={intro.title} />)}
      </div>
    </section>
  );
}

export default Intros2;
