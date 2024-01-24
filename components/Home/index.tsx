import Hero from "@/components/Home/Hero";
import Intro from "@/components/Home/Intro";

export default function Home() {
    return (
        <section className="xl:padding-1 wide:padding-r padding-b">
            <Hero />
            <Intro />
        </section>
    );
}
