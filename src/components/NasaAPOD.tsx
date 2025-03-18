import { useEffect, useState } from "react";
import { Info, Loader2 } from "lucide-react";

// NASA Astronomy Picture of the Day Component
// This component fetches and displays NASA's APOD with a brief description.

const NasaAPOD = () => {
  // State to hold APOD data
  const [apod, setApod] = useState<{ title: string; url: string; explanation: string } | null>(null);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to handle errors
  const [error, setError] = useState("");

  // Fetch NASA APOD data on component mount
  useEffect(() => {
    fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY")
      .then((res) => res.json())
      .then((data) => {
        setApod(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load NASA's Astronomy Picture of the Day.");
        setLoading(false);
      });
  }, []);

  // Loading state UI
  if (loading)
    return (
      <div className="w-full bg-gray-200 animate-pulse rounded-lg h-64 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
      </div>
    );

  // Error state UI
  if (error)
    return <p className="text-red-500 text-center p-4 bg-gray-100 rounded-md">{error}</p>;

  return (
    <div className="mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* APOD Image Display */}
      <div className="relative">
        <img
          src={apod?.url || "/placeholder.png"}
          alt={apod?.title || "NASA APOD"}
          className="w-full h-64 object-cover"
        />
        {/* Title overlay on image */}
        <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-3 text-sm font-medium">
          {apod?.title}
        </div>
      </div>
      {/* APOD Description */}
      <div className="p-4">
        <p className="text-gray-600 text-sm">{apod?.explanation.slice(0, 150)}...</p>
        {/* View More Button */}
        <button
          onClick={() => window.open(apod?.url, "_blank")}
          className="mt-3 text-blue-600 hover:underline flex items-center gap-1"
        >
          <Info className="w-4 h-4" />
          View More
        </button>
      </div>
    </div>
  );
};

export default NasaAPOD;
