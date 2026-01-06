import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoryCard } from "@/components/CategoryCard";
import { VideoCard } from "@/components/VideoCard";
import { Footer } from "@/components/Footer";
import { categories, videos } from "@/data/mockData";
import { ArrowRight, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <HeroSection />

        {/* Categories Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Categorias</h2>
                <p className="text-muted-foreground mt-1">Explore por tema</p>
              </div>
              <Button variant="ghost" className="gap-2 group">
                Ver todas
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Videos Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Em Destaque</h2>
                  <p className="text-muted-foreground mt-1">Selecionados pela curadoria</p>
                </div>
              </div>
              <Button variant="ghost" className="gap-2 group">
                Ver todos
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.slice(0, 4).map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Videos Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent/10">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Recentes</h2>
                  <p className="text-muted-foreground mt-1">Últimos vídeos enviados</p>
                </div>
              </div>
              <Button variant="ghost" className="gap-2 group">
                Ver todos
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.slice(4, 8).map((video, index) => (
                <div
                  key={video.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Conhece um vídeo que merece ser preservado?
              </h2>
              <p className="text-lg text-muted-foreground">
                Compartilhe com a comunidade e ajude a construir o maior acervo de vídeos valiosos da internet.
              </p>
              <Button variant="hero" size="xl" className="gap-2">
                Enviar Vídeo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
