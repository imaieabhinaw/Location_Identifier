import { motion } from "framer-motion";
import { Star, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Monument } from "@shared/schema";
import { type Monument } from "@/types/monument";

interface MonumentCardProps {
  monument: Monument;
  onFavorite?: (monumentId: number) => void;
  isFavorite?: boolean;
  index?: number;
}

export function MonumentCard({
  monument,
  onFavorite,
  isFavorite,
  index = 0,
}: MonumentCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "temple":
        return "bg-emerald/20 text-emerald";
      case "fort":
        return "bg-red-500/20 text-red-500";
      case "palace":
        return "bg-royal-purple/20 text-royal-purple";
      case "mausoleum":
        return "bg-blue-500/20 text-blue-500";
      case "ruins":
        return "bg-amber-500/20 text-amber-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="monument-card glassmorphism dark:glassmorphism-dark rounded-2xl overflow-hidden group"
    >
      <div className="relative">
        <img
          src={monument.imageUrl}
          alt={monument.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFavorite?.(monument.id)}
            className="bg-black/20 hover:bg-black/40 text-white"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "fill-current text-red-500" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-cinzel font-bold text-gray-800 dark:text-white">
            {monument.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-gold fill-current" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">
              {monument.rating}
            </span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{monument.location}</span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {monument.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {monument.unescoSite && (
              <Badge className="bg-emerald/20 text-emerald">UNESCO Site</Badge>
            )}
            <Badge className={getCategoryColor(monument.category)}>
              {monument.category}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
