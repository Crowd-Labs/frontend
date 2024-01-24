interface IntroItem {
    title: string;
    content: string;
    icon: string
}
const intros: IntroItem[] = [
    {
        title: "Stake to initial collection",
        content: "Stake some eth to initial your collection for free.Get back your funds after a fixed time",
        icon: "ii"
    },
    {
        title: "Share yield & gas fee",
        content: "All stake eth yield & gas fee from Blast_L2 will share with community ",
        icon: "ii"
    },
    {
        title: "Share Blast airdrop",
        content: "Share blast airdrop with platform users",
        icon: "ii"
    },
    {
        title: "Share royalty fee",
        content: "All creators can share the royalty fee from your co-create collection",
        icon: "ii"
    },
]

const IntroItem = (props: { data: IntroItem }) => {
    return (
        <div className="flex">
            <div className="text-center">
                icon
            </div>
            <div className="flex-1">
                <div>
                    iconiconiconiconiconiconiconicon
                </div>
                <div>
                    iconiconiconiconiconiconicon
                </div>
            </div>
        </div>
    )
}

const Intros = () => {
    return (
        <section className="mt-32">
            <div className="text-center">
                We will share
            </div>
            <div className="grid grid-cols-2 grid-rows-2"></div>
            {intros?.map(intro => <IntroItem data={intro} />)}

        </section>
    )
}

export default Intros