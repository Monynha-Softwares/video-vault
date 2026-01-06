import { Github, Twitter, Heart } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <span className="text-lg font-bold">M</span>
              </div>
              <span className="font-bold text-xl tracking-tight">
                Monynha<span className="text-primary">Fun</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Uma plataforma de curadoria coletiva de vídeos do YouTube. 
              Preservando e descobrindo conteúdos valiosos juntos.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Navegação</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/videos" className="hover:text-primary transition-colors">Categorias</Link></li>
              <li><Link to="/videos?recent=true" className="hover:text-primary transition-colors">Recentes</Link></li>
              <li><Link to="/videos?featured=true" className="hover:text-primary transition-colors">Destaques</Link></li>
              <li><Link to="/submit" className="hover:text-primary transition-colors">Enviar Vídeo</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Comunidade</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Sobre</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Regras</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> pela comunidade
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};