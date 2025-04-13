
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Import = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [key, setKey] = useState("");
  const [tempo, setTempo] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [liturgicalMoment, setLiturgicalMoment] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Musical key options
  const keyOptions = [
    "C Major", "G Major", "D Major", "A Major", "E Major", "B Major", "F# Major",
    "Db Major", "Ab Major", "Eb Major", "Bb Major", "F Major",
    "A Minor", "E Minor", "B Minor", "F# Minor", "C# Minor", "G# Minor",
    "D# Minor", "Bb Minor", "F Minor", "C Minor", "G Minor", "D Minor"
  ];

  // Tempo options
  const tempoOptions = [
    "Largo", "Larghetto", "Adagio", "Andante", "Moderato",
    "Allegro", "Vivace", "Presto", "Prestissimo"
  ];

  // Liturgical moment options
  const liturgicalMomentOptions = [
    "Entrance", "Kyrie", "Gloria", "Alleluia", "Gospel Acclamation",
    "Offertory", "Sanctus", "Eucharistic Acclamations", "Communion",
    "Meditation", "Recessional", "Marian Devotion", "Adoration"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title || !lyrics) {
      toast({
        title: "Campos Obrigatórios",
        description: "Título e letra da música são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to import music.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new music object for Supabase
      const newMusic = {
        id: uuidv4(),
        title,
        author: author || null,
        key: key || null,
        tempo: tempo || null,
        liturgical_moment: liturgicalMoment ? [liturgicalMoment] : [],
        lyrics,
        date_added: new Date().toISOString(),
        favorite: false,
        created_by: user.id
      };

      // Insert directly to Supabase
      const { error } = await supabase
        .from('music')
        .insert(newMusic);

      if (error) throw error;

      console.log("Importing new music to Supabase:", newMusic);

      toast({
        title: "Música Importada",
        description: `A música "${title}" foi importada com sucesso!`,
      });

      // Reset form
      setTitle("");
      setAuthor("");
      setKey("");
      setTempo("");
      setLyrics("");
      setLiturgicalMoment("");
      setSelectedFile(null);
      
      // Navigate to library
      navigate("/library");
    } catch (error) {
      console.error("Error importing music:", error);
      toast({
        title: "Erro ao Importar Música",
        description: "Ocorreu um erro ao importar a música. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      readFileContent(e.target.files[0]);
    }
  };

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        // Tentar analisar o conteúdo do arquivo
        try {
          // Se for um arquivo JSON
          if (file.name.endsWith('.json')) {
            const content = JSON.parse(e.target.result);
            if (content.title) setTitle(content.title);
            if (content.author) setAuthor(content.author);
            if (content.key) setKey(content.key);
            if (content.tempo) setTempo(content.tempo);
            if (content.lyrics) setLyrics(content.lyrics);
            if (content.liturgicalMoment && content.liturgicalMoment[0]) 
              setLiturgicalMoment(content.liturgicalMoment[0]);
          } else {
            // Se for um arquivo de texto, consideramos como letra
            setLyrics(e.target.result);
          }
          
          toast({
            title: "Arquivo Carregado",
            description: "Conteúdo do arquivo importado com sucesso.",
          });
        } catch (error) {
          // Se não conseguir analisar como JSON, considere como texto
          setLyrics(e.target.result);
        }
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro",
        description: "Não foi possível ler o arquivo.",
        variant: "destructive",
      });
    };
    
    if (file.type === "application/json") {
      reader.readAsText(file);
    } else if (file.type === "text/plain" || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      toast({
        title: "Formato não suportado",
        description: "Por favor, selecione um arquivo .txt ou .json",
        variant: "destructive",
      });
    }
  };

  const handleUploadClick = () => {
    document.getElementById('file-upload')?.click();
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold">Importar Música</h1>
          <p className="text-muted-foreground mt-2">
            Adicione uma nova música à sua biblioteca
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-base">
                  Título da Música *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Ave Maria"
                  required
                />
              </div>

              <div>
                <Label htmlFor="author" className="text-base">
                  Autor/Compositor
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ex: Franz Schubert"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="key" className="text-base">
                    Tonalidade
                  </Label>
                  <Select value={key} onValueChange={setKey}>
                    <SelectTrigger id="key">
                      <SelectValue placeholder="Selecione uma tonalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {keyOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tempo" className="text-base">
                    Andamento
                  </Label>
                  <Select value={tempo} onValueChange={setTempo}>
                    <SelectTrigger id="tempo">
                      <SelectValue placeholder="Selecione um andamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {tempoOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="liturgicalMoment" className="text-base">
                  Momento Litúrgico
                </Label>
                <Select
                  value={liturgicalMoment}
                  onValueChange={setLiturgicalMoment}
                >
                  <SelectTrigger id="liturgicalMoment">
                    <SelectValue placeholder="Selecione um momento litúrgico" />
                  </SelectTrigger>
                  <SelectContent>
                    {liturgicalMomentOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="lyrics" className="text-base">
                  Letra da Música *
                </Label>
                <Textarea
                  id="lyrics"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  placeholder="Insira a letra da música aqui..."
                  className="min-h-[200px]"
                  required
                />
              </div>
            </div>

            {/* Input de arquivo escondido */}
            <input
              type="file"
              id="file-upload"
              accept=".txt,.json"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleUploadClick}
                disabled={isSubmitting}
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : "Importar Arquivo"}
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-liturgy-700 hover:bg-liturgy-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Música
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Import;
