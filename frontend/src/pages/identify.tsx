import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadZone } from "@/components/upload-zone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  formatConfidence,
  // formatTimestamp,
  getGoogleMapsUrl,
} from "@/lib/utils";
import {
  MapPin,
  Share2,
  Heart,
  Volume2,
  Calendar,
  User,
  Palette,
  Award,
  Clock,
  DollarSign,
  Thermometer,
  Cloud,
  // Wind,
  Compass,
} from "lucide-react";
import type { IdentificationResponse } from "@/types/monument";

interface IdentificationResult {
  monument: {
    id: number;
    name: string;
    location: string;
    description: string;
    historicalContext: string;
    architecturalStyle: string;
    builtPeriod: string;
    architect: string;
    latitude: string;
    longitude: string;
    imageUrl: string;
    unescoSite: boolean;
    rating: string;
    visitingHours: string;
    entryFee: string;
    bestTimeToVisit: string;
  };
  confidence: string;
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  nearbyAttractions: {
    name: string;
    distance: string;
  }[];
}

export default function Identify() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentIdentifications } = useQuery({
    queryKey: ["/api/identifications/recent"],
    queryFn: async () => {
      const response = await fetch("/api/identifications/recent?limit=3");
      return response.json();
    },
  });

  const identifyMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/identify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to identify monument");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({
        queryKey: ["/api/identifications/recent"],
      });
      toast({
        title: "Monument Identified!",
        description: `${data.monument.name} identified with ${data.confidence}% confidence`,
      });
    },
    onError: (error) => {
      toast({
        title: "Identification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async (monumentId: number) => {
      return apiRequest("POST", "/api/favorites", { monumentId });
    },
    onSuccess: () => {
      toast({
        title: "Added to Favorites",
        description: "Monument saved to your favorites",
      });
    },
  });

  const handleImageUpload = (file: File) => {
    setSelectedFile(file);
  };

  const handleIdentify = () => {
    if (selectedFile) {
      identifyMutation.mutate(selectedFile);
    }
  };

  const handleShare = async () => {
    if (result) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: result.monument.name,
            text: `Check out this amazing monument: ${result.monument.name}`,
            url: window.location.href,
          });
        } catch (error) {
          console.log("Error sharing:", error);
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Link copied to clipboard",
        });
      }
    }
  };

  const handleAddToFavorites = () => {
    if (result) {
      favoriteMutation.mutate(result.monument.id);
    }
  };

  const playPronunciation = () => {
    if (result && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(result.monument.name);
      utterance.lang = "en-IN";
      speechSynthesis.speak(utterance);
    }
  };

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
            Identify <span className="text-saffron">Monuments</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload an image of an Indian monument and discover its rich history
            and cultural significance
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <div>
            <UploadZone
              onImageUpload={handleImageUpload}
              onIdentify={handleIdentify}
              isLoading={identifyMutation.isPending}
            />
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="glassmorphism dark:glassmorphism-dark">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-saffron to-gold rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                        Monument Identified
                      </h3>
                      <div className="text-4xl font-cinzel font-bold text-saffron mb-4">
                        {result.monument.name}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {result.monument.location}
                      </p>
                    </div>

                    {/* Confidence Score */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <span>Confidence Score</span>
                        <span>
                          {formatConfidence(parseFloat(result.confidence))}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="confidence-bar rounded-full h-2"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <Button
                        onClick={() =>
                          window.open(
                            getGoogleMapsUrl(
                              parseFloat(result.monument.latitude),
                              parseFloat(result.monument.longitude)
                            ),
                            "_blank"
                          )
                        }
                        className="p-4 bg-emerald/20 text-emerald hover:bg-emerald/30 transition-all flex-col h-auto"
                      >
                        <MapPin className="w-5 h-5 mb-2" />
                        <span className="text-sm font-medium">
                          View Location
                        </span>
                      </Button>
                      <Button
                        onClick={handleShare}
                        className="p-4 bg-coral/20 text-coral hover:bg-coral/30 transition-all flex-col h-auto"
                      >
                        <Share2 className="w-5 h-5 mb-2" />
                        <span className="text-sm font-medium">Share</span>
                      </Button>
                      <Button
                        onClick={handleAddToFavorites}
                        disabled={favoriteMutation.isPending}
                        className="p-4 bg-royal-purple/20 text-royal-purple hover:bg-royal-purple/30 transition-all flex-col h-auto"
                      >
                        <Heart className="w-5 h-5 mb-2" />
                        <span className="text-sm font-medium">Save</span>
                      </Button>
                    </div>

                    {/* Audio Pronunciation */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Volume2 className="w-5 h-5 text-saffron" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Pronunciation Guide
                          </span>
                        </div>
                        <Button
                          onClick={playPronunciation}
                          className="bg-saffron hover:bg-saffron/80 text-white px-4 py-2 rounded-full text-sm"
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monument Details */}
                <Card className="glassmorphism dark:glassmorphism-dark">
                  <CardContent className="p-8">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                      Monument Details
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Built:
                            </span>
                          </div>
                          <span className="text-gray-800 dark:text-white font-medium">
                            {result.monument.builtPeriod}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Architect:
                            </span>
                          </div>
                          <span className="text-gray-800 dark:text-white font-medium">
                            {result.monument.architect}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Palette className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Style:
                            </span>
                          </div>
                          <span className="text-gray-800 dark:text-white font-medium">
                            {result.monument.architecturalStyle}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              UNESCO:
                            </span>
                          </div>
                          <Badge
                            className={
                              result.monument.unescoSite
                                ? "bg-emerald/20 text-emerald"
                                : "bg-gray-200 text-gray-600"
                            }
                          >
                            {result.monument.unescoSite
                              ? "World Heritage Site"
                              : "Not Listed"}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Hours:
                            </span>
                          </div>
                          <span className="text-gray-800 dark:text-white font-medium text-sm">
                            {result.monument.visitingHours}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Entry Fee:
                            </span>
                          </div>
                          <span className="text-gray-800 dark:text-white font-medium text-sm">
                            {result.monument.entryFee}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-300">
                              Best Time:
                            </span>
                          </div>
                          <span className="text-gray-800 dark:text-white font-medium text-sm">
                            {result.monument.bestTimeToVisit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="bg-gradient-to-r from-saffron/10 to-gold/10 rounded-lg p-6">
                      <h5 className="font-semibold text-gray-800 dark:text-white mb-2">
                        Historical Context
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {result.monument.historicalContext}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Weather & Location Info */}
                <Card className="glassmorphism dark:glassmorphism-dark">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                          <Thermometer className="w-5 h-5 text-saffron mr-2" />
                          Current Weather
                        </h4>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-3xl font-bold text-gray-800 dark:text-white">
                              {result.weather.temperature}°C
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              {result.weather.condition}
                            </p>
                          </div>
                          <div className="text-4xl text-saffron">
                            <Cloud />
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              Humidity:
                            </span>
                            <span>{result.weather.humidity}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-300">
                              Wind Speed:
                            </span>
                            <span>{result.weather.windSpeed} km/h</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                          <Compass className="w-5 h-5 text-saffron mr-2" />
                          Nearby Attractions
                        </h4>
                        <div className="space-y-3">
                          {result.nearbyAttractions.map((attraction, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-gray-700 dark:text-gray-300">
                                {attraction.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {attraction.distance}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="glassmorphism dark:glassmorphism-dark">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-saffron to-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Ready to Identify
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Upload an image to get started with monument identification
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Identifications */}
        {recentIdentifications && recentIdentifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-playfair font-bold text-gray-800 dark:text-white mb-8">
              Recent Identifications
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recentIdentifications.map(
                (identification: IdentificationResponse) => (
                  <Card
                    key={identification.id}
                    className="glassmorphism dark:glassmorphism-dark"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={identification.monument.imageUrl}
                          alt={identification.monument.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {identification.monument.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {identification.monument.location}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-emerald rounded-full" />
                            <span className="text-emerald text-sm font-medium">
                              {formatConfidence(identification.confidence)}{" "}
                              confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
