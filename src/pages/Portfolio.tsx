import ProjectCard from "@/components/ProjectCard";

import type Config from "@/lib/config";
import config from "../config.json";


const Portfolio: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen h-fit">
            <div className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-3 md:max-w-7xl gap-4 items-center">
                {(config as Config).projects.map((e, i) => (
                    <ProjectCard key={i} bg_img={e.bg_img} bg_alt={e.bg_alt} links={e.links} name={e.name} description={e.description} />
                ))}
            </div>
        </div>
    );
}

export default Portfolio;