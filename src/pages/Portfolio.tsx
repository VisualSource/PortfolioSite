import ProjectCard from "@/components/ProjectCard";

const Portfolio: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:max-w-7xl gap-4 h-full items-center">
                <ProjectCard image={{ src: "", alt: "" }} links={{ demo: null, source: "" }} name="Project Name" description=' Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, autem iusto blanditiis provident ipsa praesentium hic doloribus reprehenderit impedit harum modi explicabo quae ipsam, earum consequuntur facilis aspernatur aperiam minus.' />
                <ProjectCard image={{ src: "", alt: "" }} links={{ demo: null, source: "" }} name="Project Name" description=' Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, autem iusto blanditiis provident ipsa praesentium hic doloribus reprehenderit impedit harum modi explicabo quae ipsam, earum consequuntur facilis aspernatur aperiam minus.' />
                <ProjectCard image={{ src: "", alt: "" }} links={{ demo: null, source: "" }} name="Project Name" description=' Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, autem iusto blanditiis provident ipsa praesentium hic doloribus reprehenderit impedit harum modi explicabo quae ipsam, earum consequuntur facilis aspernatur aperiam minus.' />
            </div>
        </div>
    );
}

export default Portfolio;