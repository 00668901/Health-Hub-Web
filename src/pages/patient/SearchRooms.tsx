import { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Check, X, Bed, Home, AlertCircle, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner@2.0.3';

export default function SearchRooms() {
  const { rooms } = useData();
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('available');

  const availableRooms = rooms.filter(room => room.status === 'Tersedia');
  const occupiedRooms = rooms.filter(room => room.status === 'Terisi');

  // Filter rooms by type
  const filteredAvailableRooms = filterType === 'all' 
    ? availableRooms 
    : availableRooms.filter(room => room.type === filterType);

  const filteredOccupiedRooms = filterType === 'all'
    ? occupiedRooms
    : occupiedRooms.filter(room => room.type === filterType);

  // Group by type for statistics
  const roomsByType = rooms.reduce((acc, room) => {
    if (!acc[room.type]) {
      acc[room.type] = { total: 0, available: 0, occupied: 0 };
    }
    acc[room.type].total++;
    if (room.status === 'Tersedia') acc[room.type].available++;
    if (room.status === 'Terisi') acc[room.type].occupied++;
    return acc;
  }, {} as Record<string, { total: number; available: number; occupied: number }>);

  const handleBookRoom = (room: typeof rooms[0]) => {
    if (!filterDate || !filterTime) {
      toast.error('Harap pilih tanggal dan waktu terlebih dahulu');
      return;
    }
    toast.success(`Ruang ${room.name} berhasil dibooking untuk ${filterDate} pukul ${filterTime}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'VIP':
        return '🌟';
      case 'ICU':
        return '🏥';
      case 'Reguler':
        return '🏨';
      default:
        return '🛏️';
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'VIP':
        return 'from-yellow-500 to-orange-500';
      case 'ICU':
        return 'from-red-500 to-pink-500';
      case 'Reguler':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-foreground mb-2">Cari Ruangan</h1>
        <p className="text-muted-foreground">Temukan dan booking ruangan yang tersedia untuk rawat inap</p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Kamar Tersedia</p>
                  <h2 className="text-white">{availableRooms.length}</h2>
                  <p className="text-green-100 text-sm mt-1">Siap untuk rawat inap</p>
                </div>
                <Check className="w-12 h-12 text-white opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-br from-red-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm mb-1">Kamar Terisi</p>
                  <h2 className="text-white">{occupiedRooms.length}</h2>
                  <p className="text-red-100 text-sm mt-1">Sedang digunakan</p>
                </div>
                <Bed className="w-12 h-12 text-white opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Kamar</p>
                  <h2 className="text-white">{rooms.length}</h2>
                  <p className="text-blue-100 text-sm mt-1">Kapasitas rumah sakit</p>
                </div>
                <Home className="w-12 h-12 text-white opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Room Type Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 className="mb-4">Ketersediaan Berdasarkan Tipe</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(roomsByType).map(([type, stats], index) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${getRoomTypeColor(type)}`} />
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{getRoomTypeIcon(type)}</div>
                    <div>
                      <h4>{type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {stats.available} dari {stats.total} tersedia
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-green-500/10 text-green-700 flex-1 justify-center">
                      ✓ {stats.available} Kosong
                    </Badge>
                    <Badge className="bg-red-500/10 text-red-700 flex-1 justify-center">
                      ✗ {stats.occupied} Terisi
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="filter-date">Tanggal</Label>
                <Input
                  id="filter-date"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="filter-time">Waktu</Label>
                <Input
                  id="filter-time"
                  type="time"
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="filter-type">Tipe Ruangan</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="Reguler">Reguler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs for Available/Occupied */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available" className="gap-2">
            <Check className="w-4 h-4" />
            Kamar Tersedia ({filteredAvailableRooms.length})
          </TabsTrigger>
          <TabsTrigger value="occupied" className="gap-2">
            <Bed className="w-4 h-4" />
            Kamar Terisi ({filteredOccupiedRooms.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          {filteredAvailableRooms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailableRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <div className={`h-2 bg-gradient-to-r ${getRoomTypeColor(room.type)}`} />
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getRoomTypeIcon(room.type)}</span>
                          <span>{room.name}</span>
                        </div>
                        <Badge className="bg-success/10 text-success hover:bg-success/20">
                          <Check className="w-3 h-3 mr-1" />
                          Tersedia
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="mb-2">{room.type}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Kapasitas: {room.capacity} orang</p>
                          <p>Lantai: {room.floor}</p>
                          {room.price && (
                            <p className="text-primary mt-2">
                              {formatCurrency(room.price)} / hari
                            </p>
                          )}
                        </div>
                      </div>

                      {room.facilities && room.facilities.length > 0 && (
                        <div>
                          <p className="text-sm mb-2">Fasilitas:</p>
                          <div className="flex flex-wrap gap-1">
                            {room.facilities.map(facility => (
                              <Badge key={facility} variant="outline" className="text-xs">
                                {facility}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => handleBookRoom(room)}
                        className="w-full bg-primary hover:bg-primary-dark"
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        Booking Ruangan
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="mb-2">Tidak Ada Kamar Tersedia</h3>
                <p className="text-muted-foreground">
                  {filterType !== 'all' 
                    ? `Tidak ada kamar tipe ${filterType} yang tersedia saat ini` 
                    : 'Semua kamar sedang terisi. Silakan coba lagi nanti.'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="occupied" className="mt-6">
          {filteredOccupiedRooms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOccupiedRooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="opacity-75 h-full">
                    <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500" />
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getRoomTypeIcon(room.type)}</span>
                          <span>{room.name}</span>
                        </div>
                        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">
                          <X className="w-3 h-3 mr-1" />
                          Terisi
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="mb-2">{room.type}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Kapasitas: {room.capacity} orang</p>
                          <p>Lantai: {room.floor}</p>
                          {room.currentPatient && (
                            <div className="mt-3 p-2 bg-accent rounded">
                              <p className="text-sm">
                                <strong>Pasien:</strong> {room.currentPatient}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {room.facilities && room.facilities.length > 0 && (
                        <div>
                          <p className="text-sm mb-2">Fasilitas:</p>
                          <div className="flex flex-wrap gap-1">
                            {room.facilities.map(facility => (
                              <Badge key={facility} variant="outline" className="text-xs">
                                {facility}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        disabled
                        className="w-full"
                        variant="secondary"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Tidak Tersedia
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Check className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="mb-2">Semua Kamar Kosong</h3>
                <p className="text-muted-foreground">
                  {filterType !== 'all' 
                    ? `Semua kamar tipe ${filterType} tersedia untuk rawat inap` 
                    : 'Semua kamar tersedia untuk rawat inap'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
