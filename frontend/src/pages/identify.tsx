import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UploadZone } from "@/components/upload-zone";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatConfidence, getGoogleMapsUrl } from "@/lib/utils";
import {
  MapPin,
  Share2,
  Heart,
  Volume2,
  Thermometer,
  Compass,
} from "lucide-react";

interface IdentificationResult {
  monument: {
    id: number;
    name: string;
    location: string;
    latitude: string;
    longitude: string;
    imageUrl: string;
    rating: string;
    visitingHours: string;
  };
  confidence: string;
  weather: {
    temperature: number;
    condition: string;
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

  const identifyMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to identify monument");
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
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async (monumentId: number) =>
      apiRequest("POST", "/api/favorites", { monumentId }),
    onSuccess: () => {
      toast({
        title: "Added to Favorites",
        description: "Monument saved to your favorites",
      });
    },
  });

  const handleImageUpload = (file: File | null) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleIdentify = () =>
    selectedFile && identifyMutation.mutate(selectedFile);

  const handleAddToFavorites = () =>
    result && favoriteMutation.mutate(result.monument.id);

  const handleShare = async () => {
    if (!result) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: result.monument.name,
          text: `Check out this amazing monument: ${result.monument.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share error:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied", description: "Link copied to clipboard" });
    }
  };

  const playPronunciation = () => {
    if (result && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(result.monument.name);
      utterance.lang = "en-IN";
      speechSynthesis.speak(utterance);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setResult(null); // <-- clear result
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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            Identify <span className="text-saffron">Monuments</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload an image of a monument and discover its details
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <UploadZone
              onImageUpload={handleImageUpload}
              onIdentify={handleIdentify}
              isLoading={identifyMutation.isPending}
              onClearImage={handleClearImage}
            />

            {result && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="glassmorphism dark:glassmorphism-dark rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Thermometer className="mr-2 text-saffron" />
                    Current Weather
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-800 dark:text-white">
                        {result.weather.temperature}°C
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {result.weather.condition}
                      </p>
                    </div>
                    <Thermometer className="text-saffron text-4xl" />
                  </div>
                </div>

                <div className="glassmorphism dark:glassmorphism-dark rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Compass className="mr-2 text-saffron" />
                    Nearby Attractions
                  </h4>
                  <ul className="space-y-3">
                    {result.nearbyAttractions.map((a, i) => (
                      <li key={i} className="flex justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          {a.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {a.distance}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="rounded-2xl p-8 bg-[#1e293b] shadow-lg">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#f4a300] to-[#f7c948] rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Monument Identified
                    </h3>
                    <div className="text-4xl font-cinzel font-bold text-[#f4a300] mb-2">
                      {result.monument.name}
                    </div>
                    <p className="text-gray-300">{result.monument.location}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Confidence Score</span>
                      <span>
                        {formatConfidence(parseFloat(result.confidence))}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#f4a300] h-2 rounded-full transition-all"
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <button
                      onClick={() =>
                        window.open(
                          getGoogleMapsUrl(
                            +result.monument.latitude,
                            +result.monument.longitude
                          ),
                          "_blank"
                        )
                      }
                      className="p-4 bg-[#2ecc71]/20 rounded-xl text-[#2ecc71] hover:bg-[#2ecc71]/30 transition-all text-center"
                    >
                      <MapPin className="mx-auto mb-1" />
                      <div className="text-sm font-medium">View Location</div>
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-4 bg-[#e67e22]/20 rounded-xl text-[#e67e22] hover:bg-[#e67e22]/30 transition-all text-center"
                    >
                      <Share2 className="mx-auto mb-1" />
                      <div className="text-sm font-medium">Share</div>
                    </button>

                    <button
                      onClick={handleAddToFavorites}
                      disabled={favoriteMutation.isPending}
                      className="p-4 bg-[#8e44ad]/20 rounded-xl text-[#8e44ad] hover:bg-[#8e44ad]/30 transition-all text-center"
                    >
                      <Heart className="mx-auto mb-1" />
                      <div className="text-sm font-medium">Save</div>
                    </button>
                  </div>

                  {/* Pronunciation + Location Info */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-[#334155] rounded-xl px-6 py-4 flex flex-col items-start justify-center space-y-2">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="text-[#f4a300] h-5 w-5" />
                        <h4 className="text-white font-semibold text-base">
                          Pronunciation Guide
                        </h4>
                      </div>
                      <button
                        onClick={playPronunciation}
                        className="bg-[#f4a300] text-white px-4 py-2 rounded-full text-sm hover:bg-opacity-90 transition-all shadow flex items-center"
                      >
                        <Volume2 className="inline-block mr-1 h-4 w-4" />
                        Play
                      </button>
                    </div>

                    <div className="bg-[#334155] rounded-xl px-6 py-4 flex flex-col items-start justify-center space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="text-[#f4a300] h-5 w-5" />
                        <h4 className="text-white font-semibold text-base">
                          Location Info
                        </h4>
                      </div>
                      <div className="text-sm text-gray-300 font-mono">
                        <div>
                          <span className="mr-1">Lat:</span>
                          <span className="text-white">
                            {result.monument.latitude}°N
                          </span>
                        </div>
                        <div>
                          <span className="mr-1">Lng:</span>
                          <span className="text-white">
                            {result.monument.longitude}°E
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="w-8 h-8 text-saffron mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Ready to Identify
                  </h3>
                  <p className="text-gray-600">Upload an image to begin</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
