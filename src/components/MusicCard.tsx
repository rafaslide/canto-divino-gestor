
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music as MusicIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Music } from "@/lib/types";
import { Link } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MusicCardProps {
  music: Music;
  onFavoriteToggle?: (id: string, favorite: boolean) => void;
}

const MusicCard = ({ music, onFavoriteToggle }: MusicCardProps) => {
  const [favorite, setFavorite] = useState(music.favorite);

  const handleFavoriteToggle = () => {
    const newFavorite = !favorite;
    setFavorite(newFavorite);
    if (onFavoriteToggle) {
      onFavoriteToggle(music.id, newFavorite);
    }
  };

  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="font-serif text-lg">{music.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleFavoriteToggle}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                favorite ? "fill-red-500 text-red-500" : "text-gray-400"
              )}
            />
          </Button>
        </div>
        {music.author && (
          <p className="text-sm text-muted-foreground">{music.author}</p>
        )}
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex gap-2 flex-wrap mb-2">
          {music.liturgicalMoment?.map((moment) => (
            <Badge key={moment} variant="outline" className="bg-liturgy-50 text-liturgy-900">
              {moment}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 mt-2 text-sm">
          {music.key && (
            <span className="text-muted-foreground">Key: {music.key}</span>
          )}
          {music.tempo && (
            <span className="text-muted-foreground ml-2">{music.tempo}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link to={`/music/${music.id}`} className="flex items-center gap-2">
            <MusicIcon className="h-4 w-4" />
            <span>View Details</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MusicCard;
