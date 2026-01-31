import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryCard } from '@/components/video/CategoryCard';
import { useCategories } from '@/features/categories/queries/useCategories';
import { useVideos } from '@/features/videos/queries/useVideos';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getIcon } from '@/flyweights/IconFactory';
import { getStyle } from '@/flyweights/StyleFlyweight';

export const CategorySection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ArrowRightIcon = getIcon('ArrowRight');
  const FolderXIcon = getIcon('FolderX');
  const sectionTitle = getStyle('sectionTitle');
  const sectionDescription = getStyle('sectionDescription');
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  const { data: videos } = useVideos({ enabled: !!categories?.length });

  const categoryVideoCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    videos?.forEach((video) => {
      const categoryId = video.category?.id ?? video.category_id;

      if (!categoryId) return;

      counts[categoryId] = (counts[categoryId] ?? 0) + 1;
    });

    return counts;
  }, [videos]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/videos?category=${categoryId}`);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={sectionTitle.className}>{t('index.categoriesTitle')}</h2>
            <p className={sectionDescription.className}>{t('index.categoriesDescription')}</p>
          </div>
          <Button
            variant="ghost"
            className="gap-2 group"
            onClick={() => navigate('/videos')}
          >
            {t('index.viewAll')}
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {categoriesLoading ? (
          <ScrollArea>
            <div className="flex gap-4 pb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-36 w-full min-w-[280px] rounded-2xl" />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : categoriesError ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FolderXIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">{t('index.categoriesError')}</p>
          </div>
        ) : categories && categories.length > 0 ? (
          <ScrollArea>
            <div className="flex gap-4 pb-4">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  videoCount={categoryVideoCounts[category.id] ?? 0}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FolderXIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">{t('index.noCategories')}</p>
          </div>
        )}
      </div>
    </section>
  );
};
