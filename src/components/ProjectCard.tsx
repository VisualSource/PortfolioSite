import { Image, Code2, Eye } from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import type { Project } from '@/lib/config';

const Icon: React.FC<{ icon: Project["links"][string]["icon"] }> = ({ icon }) => {
    switch (icon) {
        default:
        case "eye":
            return (
                <Eye className="mr-2 h-4 w-4" />
            );
        case "code":
            return (
                <Code2 className="mr-2 h-4 w-4" />
            );
    }
}

const ProjectCard: React.FC<Project> = ({ bg_alt, bg_img, name, description, links }) => {
    return (
        <Card className="h-full flex flex-col rounded-none">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent className='flex-1 flex flex-col'>
                <div className='flex flex-col items-start gap-2'>

                    <Avatar className="w-full h-60 max-h-60 aspect-square rounded-md">
                        <AvatarFallback className="rounded-md">
                            <Image />
                        </AvatarFallback>
                        <AvatarImage className="rounded-md" src={bg_img} alt={bg_alt} />
                    </Avatar>

                    <p className="leading-7">
                        {description}
                    </p>
                </div>
            </CardContent>
            <CardFooter className='flex justify-end gap-2'>
                {Object.entries(links).map(([key, value], i) => (
                    <a key={i} target='_blank' href={value.link} className={buttonVariants({ variant: value.type, className: "rounded-none" })}>
                        <Icon icon={value.icon} /> {key}
                    </a>
                ))}
            </CardFooter>
        </Card>
    );
}

export default ProjectCard;