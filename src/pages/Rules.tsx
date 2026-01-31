import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '@/flyweights/IconFactory';

const Rules = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const GavelIcon = getIcon('Gavel');
  const YoutubeIcon = getIcon('Youtube');
  const HeartIcon = getIcon('Heart');
  const MessageSquareIcon = getIcon('MessageSquare');
  const LightbulbIcon = getIcon('Lightbulb');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold">{t('rules.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('rules.description')}</p>
        </div>

        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <GavelIcon className="w-6 h-6 text-primary" />
            {t('rules.title')}
          </h2>
          <ul className="space-y-4 text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-3">
              <HeartIcon className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span><strong>{t('rulesPage.rule1')}</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <MessageSquareIcon className="w-5 h-5 text-destructive mt-1 shrink-0" />
              <span><strong>{t('rulesPage.rule2')}</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <YoutubeIcon className="w-5 h-5 text-red-500 mt-1 shrink-0" />
              <span><strong>{t('rulesPage.rule3')}</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <LightbulbIcon className="w-5 h-5 text-accent mt-1 shrink-0" />
              <span><strong>{t('rulesPage.rule4')}</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <GavelIcon className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span><strong>{t('rulesPage.rule5')}</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <HeartIcon className="w-5 h-5 text-primary mt-1 shrink-0" />
              <span><strong>{t('rulesPage.rule6')}</strong></span>
            </li>
            <li className="flex items-start gap-3">
              <LightbulbIcon className="w-5 h-5 text-blue-500 mt-1 shrink-0" />
              <span><strong>{t('rulesPage.rule7')}</strong></span>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Rules;
