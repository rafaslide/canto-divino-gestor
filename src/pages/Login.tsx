
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Music, Lock, User } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(username, password)) {
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao SantaMarta!",
      });
      navigate("/");
    } else {
      toast({
        title: "Erro de login",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Music className="h-12 w-12 text-liturgy-700" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-liturgy-900">SantaMarta</h1>
        <p className="text-gray-600 mt-2">Gestor de Músicas Litúrgicas</p>
      </div>

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Entrar</h2>
          <p className="text-gray-600 mt-2">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                placeholder="Digite seu usuário"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Digite sua senha"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-liturgy-700 hover:bg-liturgy-800">
            Entrar
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Usuário mestre: rafa</p>
          <p>Senha: pizzadebacon</p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} SantaMarta - Todos os direitos reservados</p>
      </div>
    </div>
  );
};

export default Login;
