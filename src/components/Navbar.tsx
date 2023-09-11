import { NavLink } from "react-router-dom";
import { FileText, Github, Linkedin } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
    return (
        <nav className="w-full flex justify-between p-4 flex-grow-0 dark:bg-zinc-950 dark:text-zinc-50">
            <div>
                <NavLink end to="/" className={({ isActive }) => buttonVariants({ variant: "link", className: { "underline": isActive } })}>Home</NavLink>
                <NavLink to="/about" className={({ isActive }) => buttonVariants({ variant: "link", className: { "underline": isActive } })}>About</NavLink>
                <NavLink to="/portfolio" className={({ isActive }) => buttonVariants({ variant: "link", className: { "underline": isActive } })}>Portfolio</NavLink>
            </div>
            <div className="flex gap-4">
                <Button asChild variant="outline" size="icon">
                    <a target="_blank" href="https://www.linkedin.com/in/collinblosser/overlay/1635539450293/single-media-viewer/?type=DOCUMENT&profileId=ACoAADmMUlEBjD4deSJmvD5Y0L5q1khNraoUm5c" title="Resume">
                        <FileText />
                    </a>
                </Button>
                <Button asChild variant="outline" size="icon">
                    <a target="_blank" title="Linkedin" href="https://linkedin.com/collinblosser">
                        <Linkedin />
                    </a>
                </Button>
                <Button asChild variant="outline" size="icon">
                    <a target="_blank" title="Github" href="https://github.com/VisualSource">
                        <Github />
                    </a>
                </Button>
            </div>
        </nav>
    );
}

export default Navbar;