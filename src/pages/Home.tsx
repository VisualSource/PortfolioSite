import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Home: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center flex-1 min-h-screen">
            <Avatar className="h-48 w-48 mb-4">
                <AvatarImage src="/images/collinblosser.jpg" alt="Collin Blosser" />
                <AvatarFallback>
                    <User className="h-24 w-24" />
                </AvatarFallback>
            </Avatar>
            <div className="text-center">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Collin Blosser</h2>
                <small className="text-sm font-medium leading-none">Full Stack Developer</small>
            </div>
        </div>
    );
}

export default Home;