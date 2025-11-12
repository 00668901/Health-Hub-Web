import { motion } from 'motion/react';
import { Moon, Sun, Globe, Shield, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner@2.0.3';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLang: 'id' | 'en') => {
    setLanguage(newLang);
    toast.success(
      newLang === 'id' 
        ? 'Bahasa berhasil diubah ke Bahasa Indonesia'
        : 'Language successfully changed to English'
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">{t('common.settings')}</h1>
        <p className="text-muted-foreground">
          {language === 'id' ? 'Kelola pengaturan sistem dan preferensi Anda' : 'Manage system settings and your preferences'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {t('settings.theme')}
            </CardTitle>
            <CardDescription>
              {language === 'id' 
                ? 'Pilih tema tampilan aplikasi sesuai preferensi Anda'
                : 'Choose app theme according to your preference'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dark-mode" className="cursor-pointer">
                  {theme === 'dark' ? t('settings.darkMode') : t('settings.lightMode')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'id'
                    ? 'Aktifkan mode gelap untuk mengurangi kelelahan mata'
                    : 'Enable dark mode to reduce eye strain'}
                </p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications" className="cursor-pointer">
                  {language === 'id' ? 'Notifikasi' : 'Notifications'}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {language === 'id' 
                    ? 'Terima notifikasi untuk update penting'
                    : 'Receive notifications for important updates'}
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('settings.language')}
            </CardTitle>
            <CardDescription>
              {language === 'id' 
                ? 'Pilih bahasa yang Anda inginkan untuk antarmuka aplikasi'
                : 'Choose your preferred language for the application interface'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">
                  <span className="flex items-center gap-2">
                    🇮🇩 {t('settings.indonesian')}
                  </span>
                </SelectItem>
                <SelectItem value="en">
                  <span className="flex items-center gap-2">
                    🇬🇧 {t('settings.english')}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Keamanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">Ganti Password</Button>
            <Button variant="outline" className="w-full">Lihat Log Aktivitas</Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
