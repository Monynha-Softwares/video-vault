import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '@/flyweights/IconFactory';

const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const SparklesIcon = getIcon('Sparkles');
  const UserIcon = getIcon('User');
  const HeartIcon = getIcon('Heart');
  const LightbulbIcon = getIcon('Lightbulb');
  const ShieldCheckIcon = getIcon('ShieldCheck');
  const HandshakeIcon = getIcon('Handshake');
  const ScaleIcon = getIcon('Scale');

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
          <h1 className="text-3xl font-bold">{t('about.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('about.description')}</p>
        </div>

        <section className="space-y-12">
          {/* Our Mission */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-primary" />
              {t('aboutPage.missionTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('aboutPage.missionDescription')}
            </p>
          </div>

          {/* About the Founder */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <UserIcon className="w-6 h-6 text-accent" />
              {t('aboutPage.founderTitle')}
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="https://github.com/marcelo-m7.png" 
                alt="Marcelo Santos" 
                className="w-20 h-20 rounded-full border-2 border-primary" 
              />
              <div>
                <h3 className="text-xl font-semibold">{t('aboutPage.founderName')}</h3>
                <p className="text-muted-foreground text-sm">{t('aboutPage.founderRole')}</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('aboutPage.founderDescription')}
            </p>
            <div className="mt-4 flex gap-4">
              <a 
                href="https://github.com/marcelo-m7" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline text-sm"
              >
                {t('aboutPage.githubLink')}
              </a>
              <a 
                href="https://marcelo.monynha.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline text-sm"
              >
                {t('aboutPage.websiteLink')}
              </a>
            </div>
          </div>

          {/* Values */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <HeartIcon className="w-6 h-6 text-destructive" />
              {t('aboutPage.valuesTitle')}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
              <li className="flex items-center gap-2"><ScaleIcon className="w-4 h-4 text-primary" /> {t('aboutPage.value1')}</li>
              <li className="flex items-center gap-2"><ShieldCheckIcon className="w-4 h-4 text-primary" /> {t('aboutPage.value2')}</li>
              <li className="flex items-center gap-2"><LightbulbIcon className="w-4 h-4 text-primary" /> {t('aboutPage.value3')}</li>
              <li className="flex items-center gap-2"><HandshakeIcon className="w-4 h-4 text-primary" /> {t('aboutPage.value4')}</li>
              <li className="flex items-center gap-2"><SparklesIcon className="w-4 h-4 text-primary" /> {t('aboutPage.value5')}</li>
            </ul>
          </div>

          {/* Philosophy */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <LightbulbIcon className="w-6 h-6 text-primary" />
              {t('aboutPage.philosophyTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('aboutPage.philosophyDescription')}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
