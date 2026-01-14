import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Menu, X, LogOut, Heart, Globe, ListVideo, User as UserIcon, Settings } from "lucide-react"; // Import UserIcon and Settings
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileById } from "@/hooks/useProfile"; // Import useProfileById

export const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const { data: profile } = useProfileById(user?.id); // Fetch user profile
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/videos?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <span className="text-lg font-bold">M</span>
          </div>
          <span className="hidden font-bold text-xl tracking-tight sm:inline-block">
            Monynha<span className="text-primary">Fun</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 bg-muted/50 border-0 focus-visible:ring-primary/30"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/playlists')}
              >
                <ListVideo className="h-4 w-4" />
                {t('header.playlists')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/favorites')}
              >
                <Heart className="h-4 w-4" />
                {t('header.favorites')}
              </Button>
              <Button
                variant="hero"
                size="sm"
                className="hidden sm:flex gap-2"
                onClick={() => navigate('/submit')}
              >
                <Plus className="h-4 w-4" />
                {t('header.submitVideo')}
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || profile?.username || 'User'} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {profile?.display_name ? profile.display_name[0].toUpperCase() : (profile?.username ? profile.username[0].toUpperCase() : <UserIcon className="h-5 w-5" />)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.display_name || profile?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${profile?.username}`)}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{t('header.myProfile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile/edit')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('header.editProfile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('header.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="hero"
                size="sm"
                className="hidden sm:flex gap-2"
                onClick={() => navigate('/auth')}
              >
                <Plus className="h-4 w-4" />
                {t('header.submitVideo')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex"
                onClick={() => navigate('/auth')}
              >
                {t('header.login')}
              </Button>
            </>
          )}

          {/* Language Switcher */}
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-[100px] h-9 bg-muted/50 border-0 focus:ring-primary/30 hidden sm:flex">
              <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">PT</SelectItem>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="es">ES</SelectItem>
              <SelectItem value="fr">FR</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}>
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-fade-in">
          <div className="container py-4 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-muted/50 border-0"
              />
            </form>
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => { navigate(`/profile/${profile?.username}`); setIsMenuOpen(false); }}
                  >
                    <UserIcon className="h-4 w-4" />
                    {t('header.myProfile')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => { navigate('/profile/edit'); setIsMenuOpen(false); }}
                  >
                    <Settings className="h-4 w-4" />
                    {t('header.editProfile')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => { navigate('/playlists'); setIsMenuOpen(false); }}
                  >
                    <ListVideo className="h-4 w-4" />
                    {t('header.playlists')}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => { navigate('/favorites'); setIsMenuOpen(false); }}
                  >
                    <Heart className="h-4 w-4" />
                    {t('header.favorites')}
                  </Button>
                  <Button
                    variant="hero"
                    className="w-full justify-center gap-2"
                    onClick={() => { navigate('/submit'); setIsMenuOpen(false); }}
                  >
                    <Plus className="h-4 w-4" />
                    {t('header.submitVideo')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    {t('header.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="hero"
                    className="w-full justify-center gap-2"
                    onClick={() => navigate('/auth')}
                  >
                    <Plus className="h-4 w-4" />
                    {t('header.submitVideo')}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/auth')}
                  >
                    {t('header.login')}
                  </Button>
                </>
              )}
              {/* Mobile Language Switcher */}
              <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-full h-9 bg-muted/50 border-0 focus:ring-primary/30 flex sm:hidden">
                  <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">PT</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="es">ES</SelectItem>
                  <SelectItem value="fr">FR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};