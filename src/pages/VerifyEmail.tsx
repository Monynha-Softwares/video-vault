import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, LogIn } from 'lucide-react';
import { ResendConfirmationEmail } from '@/components/account/ResendConfirmationEmail';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">{t('auth.verifyEmail.title')}</CardTitle>
              <CardDescription>
                {t('auth.verifyEmail.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {email && (
                <p className="text-center text-sm text-muted-foreground">
                  {t('auth.verifyEmail.sentTo')} <span className="font-medium text-foreground">{email}</span>
                </p>
              )}

              <ResendConfirmationEmail />

              <div className="flex flex-col gap-3">
                <Button 
                  variant="default" 
                  onClick={() => navigate('/auth')}
                  className="w-full"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('auth.verifyEmail.goToLogin')}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('common.backToHome')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmail;