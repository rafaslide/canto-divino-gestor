
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music, ListMusic, Import } from "lucide-react";
import { mockMusic } from "@/lib/data";

const Index = () => {
  // Load playlists from localStorage
  const savedPlaylists = localStorage.getItem("playlists");
  const playlists = savedPlaylists ? JSON.parse(savedPlaylists) : [];
  
  // Get recent music (top 3)
  const recentMusic = [...mockMusic].sort((a, b) => 
    new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  ).slice(0, 3);

  return (
    <Layout>
      <div className="space-y-10">
        <section className="space-y-4">
          <h1 className="text-4xl font-serif font-bold">Canto Divino</h1>
          <p className="text-xl text-muted-foreground">
            Organize suas músicas litúrgicas e crie playlists para cada celebração.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Music className="h-12 w-12 text-liturgy-600" />
                <h2 className="text-xl font-medium">Biblioteca de Músicas</h2>
                <p className="text-muted-foreground">Acesse todas as suas músicas liturgicas.</p>
                <Button asChild>
                  <Link to="/library" className="w-full">
                    Ver Biblioteca <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <ListMusic className="h-12 w-12 text-liturgy-600" />
                <h2 className="text-xl font-medium">Playlists</h2>
                <p className="text-muted-foreground">Crie playlists para cada celebração.</p>
                <Button asChild>
                  <Link to="/playlists" className="w-full">
                    Ver Playlists <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Import className="h-12 w-12 text-liturgy-600" />
                <h2 className="text-xl font-medium">Importar Músicas</h2>
                <p className="text-muted-foreground">Importe músicas a partir de arquivos.</p>
                <Button asChild>
                  <Link to="/import" className="w-full">
                    Importar <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold">Músicas recentes</h2>
            <Button variant="ghost" asChild>
              <Link to="/library" className="group">
                Ver todas <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentMusic.map((music) => (
              <Card key={music.id}>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-2">{music.title}</h3>
                  {music.author && (
                    <p className="text-muted-foreground text-sm">{music.author}</p>
                  )}
                  <Button asChild className="mt-4 w-full">
                    <Link to={`/music/${music.id}`}>Ver detalhes</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold">Playlists</h2>
            <Button variant="ghost" asChild>
              <Link to="/playlists" className="group">
                Ver todas <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {playlists.slice(0, 3).map((playlist) => (
                <Card key={playlist.id}>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-lg mb-2">{playlist.name}</h3>
                    {playlist.description && (
                      <p className="text-muted-foreground text-sm">{playlist.description}</p>
                    )}
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>{playlist.musicIds.length} música(s)</span>
                    </div>
                    <Button asChild className="mt-4 w-full">
                      <Link to={`/playlists/${playlist.id}`}>Ver playlist</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <ListMusic className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="font-medium text-lg">Nenhuma playlist criada</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Crie sua primeira playlist para organizar suas músicas litúrgicas.
                </p>
                <Button asChild>
                  <Link to="/playlists">Criar Playlist</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Index;
