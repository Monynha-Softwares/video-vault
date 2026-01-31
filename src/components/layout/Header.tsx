import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileById } from "@/features/profile/queries/useProfile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "@/components/NavLink";
import { Label } from "@/components/ui/label";
import { getIcon } from "@/flyweights/IconFactory";
import { getSupportedLanguages } from "@/flyweights/LanguageFlyweight";
import { getStyle } from "@/flyweights/StyleFlyweight";

export const Header = () => {
  const { t } = useTranslation();
  const SearchIcon = getIcon('Search');
  const PlusIcon = getIcon('Plus');
  const MenuIcon = getIcon('Menu');
  const LogOutIcon = getIcon('LogOut');
  const HeartIcon = getIcon('Heart');
  const GlobeIcon = getIcon('Globe');
  const ListVideoIcon = getIcon('ListVideo');
  const UserIcon = getIcon('User');
  const SettingsIcon = getIcon('Settings');
  const KeyRoundIcon = getIcon('KeyRound');
  const navLinkStyle = getStyle('navLink');
  const supportedLanguages = getSupportedLanguages();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const { data: profile } = useProfileById(user?.id);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsSheetOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/videos?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsSheetOpen(false);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const navLinks = [
    { to: "/", label: t('header.home'), iconName: 'Home' },
    { to: "/videos", label: t('header.videos'), iconName: 'ListVideo' },
    { to: "/playlists", label: t('header.playlists'), iconName: 'ListVideo' },
    { to: "/community", label: t('footer.community'), iconName: 'Users' },
    { to: "/about", label: t('footer.about'), iconName: 'Info' },
    { to: "/rules", label: t('footer.rules'), iconName: 'BookOpen' },
    { to: "/contact", label: t('footer.contact'), iconName: 'Mail' },
    { to: "/faq", label: t('footer.faq'), iconName: 'HelpCircle' },
  ] as const;

  // Filter navLinks for desktop display
  const desktopNavLinks = navLinks.filter(link => 
    link.to === "/videos" || 
    link.to === "/playlists" || 
    link.to === "/community"
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
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

        {/* New Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          {desktopNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={navLinkStyle.className}
              activeClassName="text-primary"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl ml-auto mr-8">
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
          {user && profile ? (
            <>

              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/favorites')}
              >
                <HeartIcon className="h-4 w-4" />
                <span className="hidden lg:inline">{t('header.favorites')}</span>
              </Button>
              <Button
                variant="hero"
                size="sm"
                className="hidden sm:flex gap-2"
                onClick={() => navigate('/submit')}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="hidden lg:inline">{t('header.submitVideo')}</span>
              </Button>

              {/* Direct link to profile with Avatar */}
              <Link to={`/profile/${profile.username}`} className="relative h-9 w-9 rounded-full hidden sm:flex items-center justify-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || profile.username || 'User'} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {profile.display_name ? profile.display_name[0].toUpperCase() : (profile.username ? profile.username[0].toUpperCase() : <UserIcon className="h-5 w-5" />)}
                  </AvatarFallback>
                </Avatar>
              </Link>

              {/* Separate Dropdown for other actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <SettingsIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile.display_name || profile.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { navigate('/profile/edit'); setIsSheetOpen(false); }}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>{t('header.editProfile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { navigate('/account/settings'); setIsSheetOpen(false); }}>
                    <KeyRoundIcon className="mr-2 h-4 w-4" />
                    <span>{t('header.accountSettings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
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
                onClick={() => navigate('/submit')}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="hidden lg:inline">{t('header.submitVideo')}</span>
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

          {/* Language Switcher - Desktop */}
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-[100px] h-9 bg-muted/50 border-0 focus:ring-primary/30 hidden sm:flex">
              <GlobeIcon className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile Menu Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">{t('header.toggleMenu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
              <SheetHeader className="flex-row items-center justify-between">
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsSheetOpen(false)}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                      <span className="text-lg font-bold">M</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight">
                      Monynha<span className="text-primary">Fun</span>
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="flex-1 py-4">
                <div className="space-y-6">
                  {/* Mobile Search */}
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

                  {/* User Actions (Mobile) */}
                  {user && profile ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || profile.username || 'User'} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {profile.display_name ? profile.display_name[0].toUpperCase() : (profile.username ? profile.username[0].toUpperCase() : <UserIcon className="h-5 w-5" />)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{profile.display_name || profile.username}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Separator />
                      <NavLink
                        to={`/profile/${profile.username}`}
                        className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        activeClassName="bg-muted text-foreground"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>{t('header.myProfile')}</span>
                      </NavLink>
                      <NavLink
                        to="/profile/edit"
                        className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        activeClassName="bg-muted text-foreground"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>{t('header.editProfile')}</span>
                      </NavLink>
                      <NavLink
                        to="/account/settings"
                        className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        activeClassName="bg-muted text-foreground"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <KeyRound className="h-4 w-4" />
                        <span>{t('header.accountSettings')}</span>
                      </NavLink>
                      <NavLink
                        to="/playlists"
                        className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        activeClassName="bg-muted text-foreground"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <ListVideo className="h-4 w-4" />
                        <span>{t('header.playlists')}</span>
                      </NavLink>
                      <NavLink
                        to="/favorites"
                        className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        activeClassName="bg-muted text-foreground"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <HeartIcon className="h-4 w-4" />
                        <span>{t('header.favorites')}</span>
                      </NavLink>
                      <Button
                        variant="hero"
                        className="w-full justify-center gap-2 mt-2"
                        onClick={() => { navigate('/submit'); setIsSheetOpen(false); }}
                      >
                        <PlusIcon className="h-4 w-4" />
                        {t('header.submitVideo')}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-center gap-2 mt-2"
                        onClick={handleSignOut}
                      >
                        <LogOutIcon className="h-4 w-4" />
                        {t('header.logout')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => { navigate('/playlists'); setIsSheetOpen(false); }}
                      >
                        <ListVideoIcon className="h-4 w-4" />
                        {t('header.playlists')}
                      </Button>
                      <Button
                        variant="hero"
                        className="w-full justify-center gap-2"
                        onClick={() => { navigate('/submit'); setIsSheetOpen(false); }}
                      >
                        <PlusIcon className="h-4 w-4" />
                        {t('header.submitVideo')}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => { navigate('/auth'); setIsSheetOpen(false); }}
                      >
                        {t('header.login')}
                      </Button>
                    </div>
                  )}

                  <Separator />

                  {/* Main Navigation (Mobile) */}
                  <nav className="grid gap-2">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className="flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                        activeClassName="bg-muted text-foreground"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {(() => {
                          const NavIcon = getIcon(link.iconName);
                          return <NavIcon className="h-4 w-4" />;
                        })()}
                        <span>{link.label}</span>
                      </NavLink>
                    ))}
                  </nav>

                  <Separator />

                  {/* Language Switcher (Mobile) */}
                  <div className="px-4 py-2">
                    <Label htmlFor="mobile-language-switcher" className="text-sm font-medium mb-2 block">
                      {t('header.languageLabel')}
                    </Label>
                    <Select value={i18n.language} onValueChange={changeLanguage}>
                      <SelectTrigger id="mobile-language-switcher" className="w-full h-9 bg-muted/50 border-0 focus:ring-primary/30">
                        <GlobeIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {supportedLanguages.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
