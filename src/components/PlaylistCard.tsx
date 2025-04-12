
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListMusic, Music as MusicIcon } from "lucide-react";
import { Playlist } from "@/lib/types";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface PlaylistCardProps {
  playlist: Playlist;
  musicCount: number;
}

const PlaylistCard = ({ playlist, musicCount }: PlaylistCardProps) => {
  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <ListMusic className="h-5 w-5 text-liturgy-600" />
          {playlist.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        {playlist.description && (
          <p className="text-sm text-muted-foreground mb-4">{playlist.description}</p>
        )}
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <MusicIcon className="h-4 w-4" />
            {musicCount} {musicCount === 1 ? "song" : "songs"}
          </span>
          <span className="text-muted-foreground">
            Updated {format(new Date(playlist.dateModified), "MMM d, yyyy")}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link to={`/playlists/${playlist.id}`} className="flex items-center gap-2">
            <ListMusic className="h-4 w-4" />
            <span>View Playlist</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlaylistCard;
