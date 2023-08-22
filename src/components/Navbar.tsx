import { Github, Linkedin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { NavLink } from "react-router-dom";


const Navbar: React.FC = () => {
    return (
        <nav className="w-full flex justify-between p-4 flex-grow-0 dark:bg-zinc-950 dark:text-zinc-50">
            <div>
                <NavLink end to="/" className={({ isActive }) => buttonVariants({ variant: "link", className: { "underline": isActive } })}>Home</NavLink>
                <NavLink to="/about" className={({ isActive }) => buttonVariants({ variant: "link", className: { "underline": isActive } })}>About</NavLink>
                <NavLink to="/portfolio" className={({ isActive }) => buttonVariants({ variant: "link", className: { "underline": isActive } })}>Portfolio</NavLink>
            </div>
            <div className="flex gap-4">
                <a title="Linkedin" className={buttonVariants({ size: "icon", variant: "outline" })} href="https://linkedin.com/collinblosser">
                    <Linkedin />
                </a>
                <a title="Github" className={buttonVariants({ size: "icon", variant: "outline" })} href="https://github.com/VisualSource">
                    <Github />
                </a>
            </div>
        </nav>
    );
}

export default Navbar;