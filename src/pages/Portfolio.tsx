import ProjectCard from "@/components/ProjectCard";

const Portfolio: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:max-w-7xl gap-4 h-full items-center">
                <ProjectCard image={{ src: "/images/midwestraptorjunkies.webp", alt: "Midwest Raptor Junkies" }} links={{ demo: "https://midwestraptorjunkies.com", source: "https://github.com/RapterJunky/midwestrapterjunky" }} name="Midwest Raptor Junkies" description='Midwest Raptor Junkies is the home for the Midwest Raptor Junkies group, containing a community form, online shop, articles, and upcoming events pages.' />
                <ProjectCard image={{ src: "/images/ProEstimates.webp", alt: "ProEstimates" }} links={{ demo: null, source: "https://github.com/bethel-school-of-technology/team-coding-knights-frontend" }} name="ProEstimates" description='ProEstimates is a online platform for matching clients with contractors with quoting.' />
                <ProjectCard image={{ src: "/images/xwingwiki.webp", alt: "X Wing Wiki" }} links={{ demo: "https://xwing.visualsource.us/", source: "https://github.com/VisualSource/X-Wing-Wiki" }} name="X-Wing-Wiki" description='X-Wing-Wiki is a small google search like rules and reference lookup site for the Star Wars: X-Wing miniatures game.' />
            </div>
        </div>
    );
}

export default Portfolio;