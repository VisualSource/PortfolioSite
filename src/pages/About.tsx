import Skill from "@/components/Skill";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const skills: { name: string; value: number }[] = [
    { name: "Javascript", value: 80 },
    { name: "Typescript", value: 80 },
    { name: "Node.js", value: 70 },
    { name: "React.js", value: 80 },
    { name: "Rust", value: 70 },
    { name: "PHP", value: 50 },
    { name: "Css/Sass", value: 70 },
    { name: "Git/Github", value: 70 },
    { name: "SQL", value: 60 },
];

const About: React.FC = () => {
    return (
        <div className="md:grid md:grid-cols-6 h-full flex-1">
            <div className="col-span-2 col-start-2 flex flex-col justify-center">

                <div className="flex justify-center">
                    <Avatar className="h-56 w-56">
                        <AvatarFallback>
                            <User className="h-24 w-24" />
                        </AvatarFallback>
                        <AvatarImage src="/images/collinblosser.jpg" alt="Collin Blosser" />
                    </Avatar>
                </div>
                <div className="p-4">
                    <h4 className="scroll-m-20 text-center text-xl font-semibold tracking-tight">Who am i?</h4>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">Hardworking, highly motivated professional eager to lend combined knowledge and skills to enhancebusiness performance. Operates well in both individual and team capacities, leveraging seasoned workethic to quickly adapt to different processes and drive company objectives. Resourceful and results-driven with a passion for growth and efficiency to meet company needs and increase servicevalue.</p>
                </div>
            </div>
            <div className="col-span-2 flex flex-col justify-center">
                <div className="flex flex-col gap-4 p-4">
                    {skills.map((value, i) => (
                        <Skill {...value} key={i} />
                    ))}
                </div>

            </div>
        </div>
    );
}

export default About;