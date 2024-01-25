import Hero from "@/components/Home/Hero";
import Intro from "@/components/Home/Intro";
import Launchpad from "@/components/Home/Launchpad";
import Intro2 from "@/components/Home/Intro2";

export default function Home() {
    return (
        <div className="xl:padding-1 wide:padding-r padding-b">
            <Hero />
            <Intro />
            <Launchpad />
            <Intro2 />
        </div>
    );
}
