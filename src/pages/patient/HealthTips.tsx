import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Activity, Brain, Utensils, Moon, Droplets,
  Pill, Shield, Sun, Wind, Dumbbell, Apple, Coffee,
  Search, BookOpen, ChevronRight, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useLanguage } from '../../contexts/LanguageContext';

interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'heart' | 'diabetes' | 'mental' | 'nutrition' | 'sleep' | 'exercise' | 'general';
  disease?: string[];
  tips: string[];
  icon: any;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  featured?: boolean;
}

const healthTips: HealthTip[] = [
  {
    id: '1',
    title: 'Tips Menjaga Kesehatan Jantung',
    description: 'Langkah-langkah penting untuk menjaga jantung tetap sehat dan kuat',
    category: 'heart',
    disease: ['hipertensi', 'kolesterol', 'jantung koroner'],
    tips: [
      'Konsumsi makanan rendah lemak jenuh dan kolesterol',
      'Olahraga aerobik minimal 30 menit, 5x seminggu',
      'Batasi konsumsi garam maksimal 5 gram per hari',
      'Hindari merokok dan paparan asap rokok',
      'Kelola stress dengan meditasi atau yoga',
      'Tidur cukup 7-8 jam setiap malam',
      'Rutin check up tekanan darah dan kolesterol',
    ],
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    difficulty: 'medium',
    featured: true,
  },
  {
    id: '2',
    title: 'Kontrol Diabetes dengan Pola Hidup Sehat',
    description: 'Panduan lengkap mengelola diabetes melalui diet dan aktivitas',
    category: 'diabetes',
    disease: ['diabetes', 'gula darah tinggi', 'prediabetes'],
    tips: [
      'Konsumsi karbohidrat kompleks seperti nasi merah dan oatmeal',
      'Makan dengan porsi kecil tapi sering (5-6x sehari)',
      'Pilih makanan dengan indeks glikemik rendah',
      'Perbanyak konsumsi serat dari sayur dan buah',
      'Olahraga teratur untuk meningkatkan sensitivitas insulin',
      'Monitor gula darah secara rutin',
      'Minum air putih minimal 8 gelas per hari',
      'Hindari makanan dan minuman manis',
    ],
    icon: Activity,
    color: 'from-blue-500 to-cyan-500',
    difficulty: 'medium',
    featured: true,
  },
  {
    id: '3',
    title: 'Jaga Kesehatan Mental Anda',
    description: 'Strategi efektif untuk menjaga kesehatan mental di era modern',
    category: 'mental',
    disease: ['stress', 'anxiety', 'depresi'],
    tips: [
      'Luangkan waktu 10-15 menit untuk meditasi setiap hari',
      'Berbicara dengan teman atau keluarga tentang perasaan Anda',
      'Batasi waktu menggunakan media sosial',
      'Lakukan hobi yang Anda sukai',
      'Olahraga teratur untuk melepas endorfin',
      'Jaga pola tidur yang teratur',
      'Praktikkan rasa syukur setiap hari',
      'Jangan ragu mencari bantuan profesional jika diperlukan',
    ],
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    difficulty: 'easy',
    featured: true,
  },
  {
    id: '4',
    title: 'Nutrisi Seimbang untuk Hidup Sehat',
    description: 'Panduan nutrisi lengkap untuk mendukung kesehatan optimal',
    category: 'nutrition',
    disease: ['obesitas', 'malnutrisi', 'anemia'],
    tips: [
      'Terapkan prinsip "Isi Piringku" - 50% sayur/buah, 25% protein, 25% karbohidrat',
      'Konsumsi protein dari berbagai sumber (daging, ikan, tahu, tempe)',
      'Perbanyak sayuran berwarna-warni',
      'Pilih lemak sehat dari kacang-kacangan dan ikan',
      'Batasi konsumsi gula, garam, dan lemak',
      'Minum susu atau produk olahan susu untuk kalsium',
      'Konsumsi buah segar sebagai camilan',
    ],
    icon: Utensils,
    color: 'from-green-500 to-emerald-500',
    difficulty: 'easy',
  },
  {
    id: '5',
    title: 'Tidur Berkualitas untuk Kesehatan Optimal',
    description: 'Cara meningkatkan kualitas tidur untuk pemulihan tubuh maksimal',
    category: 'sleep',
    disease: ['insomnia', 'fatigue', 'gangguan tidur'],
    tips: [
      'Tidur dan bangun di waktu yang sama setiap hari',
      'Hindari kafein minimal 6 jam sebelum tidur',
      'Ciptakan lingkungan tidur yang nyaman (gelap, sejuk, tenang)',
      'Hindari gadget 1 jam sebelum tidur',
      'Lakukan rutinitas relaksasi sebelum tidur',
      'Hindari makan berat 2-3 jam sebelum tidur',
      'Gunakan kasur dan bantal yang nyaman',
      'Batasi tidur siang maksimal 30 menit',
    ],
    icon: Moon,
    color: 'from-indigo-500 to-purple-500',
    difficulty: 'medium',
  },
  {
    id: '6',
    title: 'Program Olahraga untuk Pemula',
    description: 'Mulai hidup aktif dengan program olahraga yang tepat',
    category: 'exercise',
    disease: ['obesitas', 'hipertensi', 'kolesterol'],
    tips: [
      'Mulai dengan 15-20 menit olahraga ringan',
      'Jalan kaki cepat adalah olahraga mudah dan efektif',
      'Lakukan pemanasan sebelum dan pendinginan setelah olahraga',
      'Tingkatkan durasi dan intensitas secara bertahap',
      'Pilih olahraga yang Anda nikmati',
      'Gabungkan olahraga kardio dan kekuatan',
      'Istirahat cukup antara sesi latihan',
      'Minum air yang cukup sebelum, saat, dan setelah olahraga',
    ],
    icon: Dumbbell,
    color: 'from-orange-500 to-red-500',
    difficulty: 'easy',
  },
  {
    id: '7',
    title: 'Hidrasi Optimal untuk Tubuh',
    description: 'Pentingnya air untuk fungsi tubuh yang optimal',
    category: 'general',
    tips: [
      'Minum minimal 8 gelas (2 liter) air putih per hari',
      'Mulai hari dengan 1-2 gelas air hangat',
      'Minum air sebelum merasa haus',
      'Bawa botol air ke mana pun Anda pergi',
      'Perbanyak asupan air saat berolahraga atau cuaca panas',
      'Hindari minuman manis dan berkafein berlebihan',
      'Konsumsi buah dan sayur yang banyak mengandung air',
    ],
    icon: Droplets,
    color: 'from-cyan-500 to-blue-500',
    difficulty: 'easy',
  },
  {
    id: '8',
    title: 'Boost Sistem Imun Anda',
    description: 'Cara alami meningkatkan daya tahan tubuh',
    category: 'general',
    disease: ['flu', 'infeksi'],
    tips: [
      'Konsumsi makanan kaya vitamin C (jeruk, jambu, brokoli)',
      'Tidur cukup 7-8 jam setiap malam',
      'Kelola stress dengan baik',
      'Olahraga teratur untuk meningkatkan sirkulasi',
      'Jaga kebersihan tangan',
      'Konsumsi probiotik untuk kesehatan usus',
      'Hindari merokok dan alkohol berlebihan',
      'Vaksinasi sesuai anjuran medis',
    ],
    icon: Shield,
    color: 'from-teal-500 to-green-500',
    difficulty: 'easy',
    featured: true,
  },
];

export default function HealthTips() {
  const [tips] = useState<HealthTip[]>(healthTips);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDisease, setSelectedDisease] = useState<string>('all');
  const { language } = useLanguage();

  const allDiseases = Array.from(new Set(tips.flatMap(tip => tip.disease || [])));

  const filteredTips = tips.filter(tip => {
    const matchesSearch = 
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.tips.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    
    const matchesDisease = selectedDisease === 'all' || 
      (tip.disease && tip.disease.some(d => d.toLowerCase().includes(selectedDisease.toLowerCase())));
    
    return matchesSearch && matchesCategory && matchesDisease;
  });

  const featuredTips = tips.filter(tip => tip.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">
          {language === 'id' ? 'Tips Kesehatan' : 'Health Tips'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id' 
            ? 'Panduan kesehatan disesuaikan dengan kondisi Anda'
            : 'Health guidance tailored to your condition'}
        </p>
      </motion.div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={language === 'id' ? 'Cari tips...' : 'Search tips...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'id' ? 'Kategori' : 'Category'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'id' ? 'Semua Kategori' : 'All Categories'}</SelectItem>
                <SelectItem value="heart">{language === 'id' ? 'Jantung' : 'Heart'}</SelectItem>
                <SelectItem value="diabetes">Diabetes</SelectItem>
                <SelectItem value="mental">{language === 'id' ? 'Mental' : 'Mental'}</SelectItem>
                <SelectItem value="nutrition">{language === 'id' ? 'Nutrisi' : 'Nutrition'}</SelectItem>
                <SelectItem value="sleep">{language === 'id' ? 'Tidur' : 'Sleep'}</SelectItem>
                <SelectItem value="exercise">{language === 'id' ? 'Olahraga' : 'Exercise'}</SelectItem>
                <SelectItem value="general">{language === 'id' ? 'Umum' : 'General'}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDisease} onValueChange={setSelectedDisease}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'id' ? 'Filter Penyakit' : 'Filter Disease'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'id' ? 'Semua' : 'All'}</SelectItem>
                {allDiseases.map(disease => (
                  <SelectItem key={disease} value={disease}>
                    {disease}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Featured Tips */}
      {selectedCategory === 'all' && selectedDisease === 'all' && !searchTerm && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-foreground">
              {language === 'id' ? 'Tips Unggulan' : 'Featured Tips'}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredTips.map((tip) => {
              const IconComponent = tip.icon;
              return (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={`h-full bg-gradient-to-br ${tip.color} text-white border-0 cursor-pointer hover:shadow-xl transition-shadow`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <IconComponent className="w-8 h-8" />
                        <Badge className="bg-white/20 text-white">
                          {tip.difficulty === 'easy' ? (language === 'id' ? 'Mudah' : 'Easy') :
                           tip.difficulty === 'medium' ? (language === 'id' ? 'Sedang' : 'Medium') :
                           (language === 'id' ? 'Sulit' : 'Hard')}
                        </Badge>
                      </div>
                      <CardTitle className="text-white mt-4">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/90 text-sm">{tip.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Tips */}
      <div className="grid gap-6">
        {filteredTips.map((tip) => {
          const IconComponent = tip.icon;
          return (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${tip.color}`} />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tip.color} flex items-center justify-center text-white`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="mb-2">{tip.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                        {tip.disease && tip.disease.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {tip.disease.map((disease) => (
                              <Badge key={disease} variant="outline" className="text-xs">
                                {disease}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(tip.difficulty)}>
                      {tip.difficulty === 'easy' ? (language === 'id' ? 'Mudah' : 'Easy') :
                       tip.difficulty === 'medium' ? (language === 'id' ? 'Sedang' : 'Medium') :
                       (language === 'id' ? 'Sulit' : 'Hard')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tip.tips.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredTips.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {language === 'id' ? 'Tidak ada tips ditemukan' : 'No tips found'}
          </p>
        </div>
      )}
    </div>
  );
}
