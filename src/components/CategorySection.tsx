import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryCard } from '@/components/CategoryCard';
import { useCategories } from '@/features/categories/queries/useCategories';

export const CategorySection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{t('index.categoriesTitle')}</h2>
            <p className="text-muted-foreground mt-1">{t('index.categoriesDescription')}</p>
          </div>
          <Button
            variant="ghost"
            className="gap-2 group"
            onClick={() => navigate('/videos')}
          >
            {t('index.viewAll')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories?.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CategoryCard
                  category={category}
                  onClick={() => navigate(`/videos?category=${category.id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};