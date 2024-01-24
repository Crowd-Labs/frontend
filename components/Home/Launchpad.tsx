import { HotCollections } from "@/constants"
import LaunchpadCard from "../Collection/LaunchpadCard"

const Launchpad = () => {
    return (
        <section className="mt-20">
            <div className="h1-heading">
                Launchpad drops
            </div>
            <div className="mt-12 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                {HotCollections.map((coll) => (
                    <LaunchpadCard key={coll.collName} {...coll} />
                ))}
            </div>
        </section>
    )
}

export default Launchpad