import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfileById, useUpdateProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, User, Image, Info, Loader2, Save } from 'lucide-react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer'; // Import Footer

const editProfileSchema = z.object({
  display_name: z.string().min(3, 'profile.edit.error.displayNameMinLength').max(50, 'profile.edit.error.displayNameMaxLength'),
  avatar_url: z.string().url('profile.edit.error.invalidAvatarUrl').optional().or(z.literal('')),
  bio: z.string().max(300, 'profile.edit.error.bioMaxLength').optional().or(z.literal('')),
});

export default function EditProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading, isError: profileLoadError } = useProfileById(user?.id);
  const updateProfileMutation = useUpdateProfile();

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setAvatarUrl(profile.avatar_url || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profileData = {
      display_name: displayName,
      avatar_url: avatarUrl || null,
      bio: bio || null,
    };

    try {
      editProfileSchema.parse(profileData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(t('common.validationError'), {
          description: t(error.errors[0].message),
        });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfileMutation.mutateAsync(profileData);
      navigate(`/profile/${profile?.username}`);
    } catch (error) {
      // Error handled by mutation hook's onError
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (profileLoadError || !profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('profile.edit.loadErrorTitle')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('profile.edit.loadErrorDescription')}
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.backToHome')}
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border/50">
        <div className="container flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/profile/${profile.username}`)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
            <span className="font-bold text-lg">
              Monynha<span className="text-primary">Fun</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{t('profile.edit.title')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('profile.edit.description')}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <Avatar className="w-24 h-24 border-2 border-primary">
                  <AvatarImage src={avatarUrl || undefined} alt={displayName || profile.username || 'User'} />
                  <AvatarFallback className="bg-primary/20 text-primary text-3xl font-semibold">
                    {displayName ? displayName[0].toUpperCase() : (profile.username ? profile.username[0].toUpperCase() : <User className="w-12 h-12" />)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm text-muted-foreground">{t('profile.edit.avatarPreview')}</p>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="display-name">{t('profile.edit.form.displayNameLabel')} *</Label>
                <Input
                  id="display-name"
                  type="text"
                  placeholder={t('profile.edit.form.displayNamePlaceholder')}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>

              {/* Avatar URL */}
              <div className="space-y-2">
                <Label htmlFor="avatar-url">{t('profile.edit.form.avatarUrlLabel')}</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="avatar-url"
                    type="url"
                    placeholder={t('profile.edit.form.avatarUrlPlaceholder')}
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t('profile.edit.form.avatarUrlHint')}</p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">{t('profile.edit.form.bioLabel')}</Label>
                <Textarea
                  id="bio"
                  placeholder={t('profile.edit.form.bioPlaceholder')}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {bio.length}/300
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isSubmitting || updateProfileMutation.isPending}
              >
                {isSubmitting || updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('profile.edit.form.savingButton')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('profile.edit.form.saveButton')}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}