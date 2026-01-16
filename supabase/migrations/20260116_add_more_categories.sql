-- Add more video categories to the database
-- This migration adds additional categories for better video organization

INSERT INTO public.categories (name, slug, icon, color) VALUES
  ('Tecnologia', 'tecnologia', 'Laptop', '#2D9CDB'),
  ('Esportes', 'esportes', 'Trophy', '#27AE60'),
  ('Jogos', 'jogos', 'Gamepad2', '#9B51E0'),
  ('Animação', 'animacao', 'Film', '#F2994A'),
  ('Arte & Design', 'arte-design', 'Palette', '#E74C3C'),
  ('Ciência', 'ciencia', 'Microscope', '#3498DB'),
  ('História', 'historia', 'BookMarked', '#8B4513'),
  ('Viagens', 'viagens', 'Plane', '#16A085'),
  ('Documentários', 'documentarios', 'FileVideo', '#34495E'),
  ('Comédia', 'comedia', 'Smile', '#F39C12'),
  ('Natureza', 'natureza', 'TreeDeciduous', '#2ECC71'),
  ('Dança', 'danca', 'Music2', '#E91E63'),
  ('Gastronomia', 'gastronomia', 'UtensilsCrossed', '#D35400'),
  ('Artesanato', 'artesanato', 'Scissors', '#8E44AD'),
  ('Motivação', 'motivacao', 'Sparkles', '#FF6B6B')
ON CONFLICT (slug) DO NOTHING;

-- Note: Using ON CONFLICT DO NOTHING to prevent errors if categories already exist
