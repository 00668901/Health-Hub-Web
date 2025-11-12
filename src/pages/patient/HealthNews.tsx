import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Newspaper, TrendingUp, Clock, ExternalLink, 
  Heart, Activity, Pill, AlertCircle, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useLanguage } from '../../contexts/LanguageContext';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'research' | 'technology' | 'disease' | 'wellness' | 'policy';
  date: string;
  source: string;
  imageUrl: string;
  readTime: string;
  trending?: boolean;
}

const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Terobosan Baru dalam Pengobatan Kanker dengan Imunoterapi',
    summary: 'Para peneliti menemukan pendekatan imunoterapi baru yang menunjukkan hasil menjanjikan dalam mengobati berbagai jenis kanker dengan efek samping minimal.',
    category: 'research',
    date: '2025-10-24',
    source: 'Medical Journal International',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    readTime: '5 menit',
    trending: true,
  },
  {
    id: '2',
    title: 'AI Diagnosis: Kecerdasan Buatan Deteksi Penyakit Jantung Lebih Dini',
    summary: 'Sistem AI baru dapat mendeteksi risiko penyakit jantung hingga 5 tahun lebih awal dengan akurasi 95%, membuka peluang pencegahan yang lebih baik.',
    category: 'technology',
    date: '2025-10-23',
    source: 'Health Tech Today',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    readTime: '6 menit',
    trending: true,
  },
  {
    id: '3',
    title: 'WHO Keluarkan Panduan Baru untuk Kesehatan Mental Global',
    summary: 'Organisasi Kesehatan Dunia merilis panduan komprehensif baru untuk menangani krisis kesehatan mental global pasca-pandemi.',
    category: 'policy',
    date: '2025-10-22',
    source: 'WHO News',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    readTime: '4 menit',
  },
  {
    id: '4',
    title: 'Vaksin mRNA Baru Tunjukkan Harapan untuk Pengobatan Malaria',
    summary: 'Uji klinis fase 3 menunjukkan vaksin mRNA eksperimental mencapai efektivitas 89% dalam mencegah malaria pada anak-anak.',
    category: 'research',
    date: '2025-10-21',
    source: 'Vaccine Research Institute',
    imageUrl: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80',
    readTime: '7 menit',
  },
  {
    id: '5',
    title: 'Manfaat Meditasi untuk Mengurangi Tekanan Darah Tinggi',
    summary: 'Studi jangka panjang menunjukkan praktik meditasi rutin dapat menurunkan tekanan darah setara dengan obat hipertensi ringan.',
    category: 'wellness',
    date: '2025-10-20',
    source: 'Wellness Journal',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    readTime: '5 menit',
  },
  {
    id: '6',
    title: 'Peningkatan Kasus Diabetes di Kalangan Anak Muda Indonesia',
    summary: 'Laporan terbaru menunjukkan peningkatan 40% kasus diabetes tipe 2 pada kelompok usia 18-35 tahun dalam 5 tahun terakhir.',
    category: 'disease',
    date: '2025-10-19',
    source: 'Indonesian Health Ministry',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    readTime: '6 menit',
  },
];

export default function HealthNews() {
  const [news] = useState<NewsArticle[]>(mockNews);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t, language } = useLanguage();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'research': return <Activity className="w-4 h-4" />;
      case 'technology': return <Zap className="w-4 h-4" />;
      case 'disease': return <AlertCircle className="w-4 h-4" />;
      case 'wellness': return <Heart className="w-4 h-4" />;
      case 'policy': return <Newspaper className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      research: language === 'id' ? 'Penelitian' : 'Research',
      technology: language === 'id' ? 'Teknologi' : 'Technology',
      disease: language === 'id' ? 'Penyakit' : 'Disease',
      wellness: language === 'id' ? 'Kesehatan' : 'Wellness',
      policy: language === 'id' ? 'Kebijakan' : 'Policy',
    };
    return labels[category] || category;
  };

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(n => n.category === selectedCategory);

  const trendingNews = news.filter(n => n.trending);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">
          {language === 'id' ? 'Berita Kesehatan' : 'Health News'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'id' 
            ? 'Informasi terkini seputar dunia kesehatan dan medis'
            : 'Latest information about health and medical world'}
        </p>
      </motion.div>

      {/* Trending News */}
      <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5" />
            {language === 'id' ? 'Berita Trending' : 'Trending News'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {trendingNews.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <h3 className="font-medium mb-2 line-clamp-2">{article.title}</h3>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span>{new Date(article.date).toLocaleDateString('id-ID')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* News Categories */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            {language === 'id' ? 'Semua' : 'All'}
          </TabsTrigger>
          <TabsTrigger value="research">
            {language === 'id' ? 'Penelitian' : 'Research'}
          </TabsTrigger>
          <TabsTrigger value="technology">
            {language === 'id' ? 'Teknologi' : 'Tech'}
          </TabsTrigger>
          <TabsTrigger value="disease">
            {language === 'id' ? 'Penyakit' : 'Disease'}
          </TabsTrigger>
          <TabsTrigger value="wellness">
            {language === 'id' ? 'Wellness' : 'Wellness'}
          </TabsTrigger>
          <TabsTrigger value="policy">
            {language === 'id' ? 'Kebijakan' : 'Policy'}
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="w-full h-48" />
                <CardContent className="pt-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))
          ) : (
            filteredNews.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-gray-900">
                        {getCategoryIcon(article.category)}
                        <span className="ml-1">{getCategoryLabel(article.category)}</span>
                      </Badge>
                    </div>
                    {article.trending && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-500 text-white">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                      <span>{new Date(article.date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{article.source}</span>
                      <Button size="sm" variant="ghost" className="gap-2">
                        {language === 'id' ? 'Baca' : 'Read'}
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </Tabs>
    </div>
  );
}
