import { Progress } from "@/components/ui/progress";

type SkillProp = {
    value: number;
    name: string;
}

const Skill: React.FC<SkillProp> = ({ value, name }) => {
    return (
        <div className="flex items-center">
            <div className="px-2 w-28 text-center border-r font-bold border-zinc-50 text-sm text-zinc-50 bg-zinc-900 dark:broder-zinc-900 dark:text-zinc-900 dark:bg-zinc-50 rounded-s-md">{name}</div>
            <Progress className="rounded-none h-5" value={value} />
            <div className="px-2 font-bold text-sm border-l border-zinc-900 bg-zinc-900/20 dark:bg-zinc-50/20 dark:border-zinc-50 rounded-e-md">{value}%</div>
        </div>
    );
}

export default Skill;