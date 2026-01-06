import { Category } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

const colorClasses: Record<string, string> = {
  tutorials: "bg-category-tutorials/10 text-category-tutorials border-category-tutorials/30 hover:bg-category-tutorials/20",
  recipes: "bg-category-recipes/10 text-category-recipes border-category-recipes/30 hover:bg-category-recipes/20",
  education: "bg-category-education/10 text-category-education border-category-education/30 hover:bg-category-education/20",
  memes: "bg-category-memes/10 text-category-memes border-category-memes/30 hover:bg-category-memes/20",
  music: "bg-category-music/10 text-category-music border-category-music/30 hover:bg-category-music/20",
  culture: "bg-category-culture/10 text-category-culture border-category-culture/30 hover:bg-category-culture/20",
};

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        colorClasses[category.color] || "bg-muted text-foreground border-border"
      )}
    >
      <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
        {category.icon}
      </span>
      <div className="text-center">
        <h3 className="font-semibold text-sm">{category.name}</h3>
        <p className="text-xs opacity-70 mt-1">{category.count} vídeos</p>
      </div>
    </button>
  );
};
