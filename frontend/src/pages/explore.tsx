import { useState } from "react";
import { motion } from "framer-motion";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { MonumentCard } from "@/components/monument-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getMonumentCategories } from "@/lib/utils";
import { Search, Filter, Heart, Clock, MapPin } from "lucide-react";
import {
  type Monument,
  type FavoriteResponse,
  type IdentificationResponse,
} from "@/types/monument";

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: monuments, isLoading } = useQuery<Monument[]>({
    queryKey: ["/api/monuments"],
    queryFn: async () => {
      const response = await fetch("/api/monuments");
      return response.json();
    },
  });

  const { data: userFavorites } = useQuery<FavoriteResponse[], Error>({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      const response = await fetch("/api/favorites?userId=1");
      return response.json();
    },
    onSuccess: (data: FavoriteResponse[]) => {
      setFavorites(data.map((fav) => fav.monument.id));
    },
  } as UseQueryOptions<FavoriteResponse[], Error>);

  const { data: recentIdentifications } = useQuery<IdentificationResponse[]>({
    queryKey: ["/api/identifications/recent"],
    queryFn: async () => {
      const response = await fetch("/api/identifications/recent?limit=5");
      return response.json();
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async (monumentId: number) => {
      if (favorites.includes(monumentId)) {
        const response = await fetch(`/api/favorites/${monumentId}?userId=1`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove from favorites");
        return { action: "removed", monumentId };
      } else {
        // const result = await apiRequest("POST", "/api/favorites", {
        await apiRequest("POST", "/api/favorites", {
          monumentId,
        });
        return { action: "added", monumentId };
      }
    },
    onSuccess: (data: { action: string; monumentId: number }) => {
      if (data.action === "removed") {
        setFavorites((prev) => prev.filter((id) => id !== data.monumentId));
        toast({
          title: "Removed from Favorites",
          description: "Monument removed from your favorites",
        });
      } else {
        setFavorites((prev) => [...prev, data.monumentId]);
        toast({
          title: "Added to Favorites",
          description: "Monument saved to your favorites",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const filteredMonuments = monuments?.filter((monument) => {
    const matchesSearch =
      monument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monument.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || monument.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = getMonumentCategories();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 dark:text-white mb-4">
            Discover <span className="text-saffron">Heritage</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore India's magnificent monuments and their timeless stories
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card className="glassmorphism dark:glassmorphism-dark">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search monuments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="glassmorphism dark:glassmorphism-dark">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant={
                        selectedCategory === category.value
                          ? "default"
                          : "ghost"
                      }
                      onClick={() => setSelectedCategory(category.value)}
                      className={`w-full justify-start ${
                        selectedCategory === category.value
                          ? "bg-gradient-to-r from-saffron to-gold text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Favorites */}
            {userFavorites && userFavorites.length > 0 && (
              <Card className="glassmorphism dark:glassmorphism-dark">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-saffron" />
                    Your Favorites
                  </h3>
                  <div className="space-y-3">
                    {userFavorites
                      .slice(0, 3)
                      .map((favorite: FavoriteResponse) => (
                        <div
                          key={favorite.id}
                          className="flex items-center space-x-3"
                        >
                          <img
                            src={favorite.monument.imageUrl}
                            alt={favorite.monument.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                              {favorite.monument.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {favorite.monument.location}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Identifications */}
            {recentIdentifications && recentIdentifications.length > 0 && (
              <Card className="glassmorphism dark:glassmorphism-dark">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-saffron" />
                    Recent Identifications
                  </h3>
                  <div className="space-y-3">
                    {recentIdentifications
                      .slice(0, 3)
                      .map((identification: IdentificationResponse) => (
                        <div
                          key={identification.id}
                          className="flex items-center space-x-3"
                        >
                          <img
                            src={identification.monument.imageUrl}
                            alt={identification.monument.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                              {identification.monument.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {identification.confidence}% confidence
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="secondary" className="text-sm">
                {filteredMonuments?.length || 0} monuments found
              </Badge>
              {searchTerm && (
                <Badge variant="outline" className="text-sm">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="outline" className="text-sm">
                  Category:{" "}
                  {categories.find((c) => c.value === selectedCategory)?.label}
                </Badge>
              )}
            </div>

            {/* Monument Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="glassmorphism dark:glassmorphism-dark"
                  >
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="flex justify-between">
                          <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredMonuments && filteredMonuments.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMonuments.map((monument: Monument, index: number) => (
                  <MonumentCard
                    key={monument.id}
                    monument={monument}
                    onFavorite={() => favoriteMutation.mutate(monument.id)}
                    isFavorite={favorites.includes(monument.id)}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <Card className="glassmorphism dark:glassmorphism-dark">
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    No monuments found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
