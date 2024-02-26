type Config = {
    github: string;
    linkedin: string;
    projects: Project[];
    resume: string;
}

export type Project = {
    bg_alt: string;
    bg_img: string;
    description: string;
    links: Record<string, {
        link: string;
        icon: "eye" | "code"
        type: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null
    }>;
    name: string;
}

export default Config;