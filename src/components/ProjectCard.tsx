import { Image, Code2, Eye } from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProjectProps = {
    name: string;
    description: string;
    image: {
        src: string;
        alt: string;
    },
    links: {
        source: string;
        demo: string | null;
    }
}

const ProjectCard: React.FC<ProjectProps> = ({ image, name, description, links }) => {
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
                        <AvatarImage className="rounded-md" src={image.src} alt={image.alt} />
                    </Avatar>

                    <p className="leading-7">
                        {description}
                    </p>
                </div>
            </CardContent>
            <CardFooter className='flex justify-end gap-2'>
                <a target='_blank' href={links.source} className={buttonVariants({ variant: "secondary", className: "rounded-none" })}>
                    <Code2 className="mr-2 h-4 w-4" /> View Source
                </a>
                {links.demo ? (
                    <a target='_blank' href={links.demo} className={buttonVariants({ variant: "default", className: "rounded-none" })}>
                        <Eye className="mr-2 h-4 w-4" /> View
                    </a>
                ) : null}
            </CardFooter>
        </Card>
    );
}

export default ProjectCard;