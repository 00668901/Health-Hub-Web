import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CreditCard,
  QrCode,
  Banknote,
  Shield,
  CheckCircle,
  ChevronRight,
  X,
  Building2,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner@2.0.3';

export default function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showDebitDialog, setShowDebitDialog] = useState(false);
  const [showQRISDialog, setShowQRISDialog] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  const paymentMethods = [
    {
      id: 'debit',
      icon: CreditCard,
      name: 'Kartu Debit',
      description: 'Bayar dengan kartu debit dari berbagai bank',
      color: 'from-blue-500 to-blue-600',
      features: ['BCA', 'BNI', 'BRI', 'Mandiri', 'CIMB Niaga', 'Danamon'],
      processingTime: 'Instan',
      fee: 'Gratis',
    },
    {
      id: 'qris',
      icon: QrCode,
      name: 'QRIS',
      description: 'Scan QR untuk bayar dengan e-wallet',
      color: 'from-purple-500 to-purple-600',
      features: ['GoPay', 'OVO', 'DANA', 'LinkAja', 'ShopeePay', 'Semua E-Wallet'],
      processingTime: 'Instan',
      fee: 'Gratis',
    },
    {
      id: 'cash',
      icon: Banknote,
      name: 'Tunai',
      description: 'Bayar langsung di kasir rumah sakit',
      color: 'from-green-500 to-green-600',
      features: ['Bayar di Loket', 'Tersedia 24/7', 'Langsung Terverifikasi'],
      processingTime: 'Instan',
      fee: 'Gratis',
    },
    {
      id: 'insurance',
      icon: Shield,
      name: 'Asuransi/BPJS',
      description: 'Gunakan kartu asuransi untuk potongan hingga 70%',
      color: 'from-orange-500 to-orange-600',
      features: ['BPJS Kesehatan', 'KIS', 'Asuransi Swasta'],
      processingTime: '1-3 hari kerja',
      fee: 'Potongan 70%',
    },
  ];

  const banks = [
    { code: 'BCA', name: 'Bank Central Asia (BCA)', logo: '🏦' },
    { code: 'BNI', name: 'Bank Negara Indonesia (BNI)', logo: '🏦' },
    { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)', logo: '🏦' },
    { code: 'MANDIRI', name: 'Bank Mandiri', logo: '🏦' },
    { code: 'CIMB', name: 'CIMB Niaga', logo: '🏦' },
    { code: 'DANAMON', name: 'Bank Danamon', logo: '🏦' },
    { code: 'PERMATA', name: 'Bank Permata', logo: '🏦' },
    { code: 'BTN', name: 'Bank Tabungan Negara (BTN)', logo: '🏦' },
  ];

  const handleMethodClick = (methodId: string) => {
    setSelectedMethod(methodId);
    
    if (methodId === 'debit') {
      setShowDebitDialog(true);
    } else if (methodId === 'qris') {
      setShowQRISDialog(true);
    } else if (methodId === 'cash') {
      toast.info('Silakan datang ke loket kasir untuk pembayaran tunai');
    } else if (methodId === 'insurance') {
      toast.info('Tunjukkan kartu asuransi/BPJS Anda ke petugas');
    }
  };

  const handleDebitPayment = () => {
    if (!selectedBank || !cardNumber || !cardName || !cardExpiry || !cardCVV) {
      toast.error('Mohon lengkapi semua data kartu');
      return;
    }

    // Demo payment
    toast.success('Pembayaran dengan kartu debit berhasil! (Demo Mode)');
    setShowDebitDialog(false);
    resetDebitForm();
  };

  const resetDebitForm = () => {
    setSelectedBank('');
    setCardNumber('');
    setCardName('');
    setCardExpiry('');
    setCardCVV('');
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setCardNumber(formatCardNumber(cleaned));
    }
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\//g, '');
    if (cleaned.length <= 4 && /^\d*$/.test(cleaned)) {
      if (cleaned.length >= 2) {
        setCardExpiry(`${cleaned.slice(0, 2)}/${cleaned.slice(2)}`);
      } else {
        setCardExpiry(cleaned);
      }
    }
  };

  const handleCVVChange = (value: string) => {
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCardCVV(value);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="mb-2">Cara Pembayaran</h1>
        <p className="text-muted-foreground">
          Pilih metode pembayaran yang sesuai untuk Anda
        </p>
      </motion.div>

      {/* Payment Methods Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {paymentMethods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary group"
              onClick={() => handleMethodClick(method.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {method.fee}
                  </Badge>
                </div>

                <h3 className="mb-2">{method.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {method.description}
                </p>

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  {method.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">Waktu Proses</p>
                    <p className="font-medium">{method.processingTime}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-2">Pembayaran Aman & Terenkripsi</h4>
                <p className="text-sm text-muted-foreground">
                  Semua transaksi pembayaran dilindungi dengan enkripsi SSL 256-bit. 
                  Data kartu Anda tidak akan disimpan di server kami. Kami bekerja sama 
                  dengan payment gateway terpercaya untuk menjamin keamanan transaksi Anda.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Debit Card Dialog */}
      <Dialog open={showDebitDialog} onOpenChange={setShowDebitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Pembayaran Kartu Debit
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="bank">Pilih Bank *</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bank penerbit kartu" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      <div className="flex items-center gap-2">
                        <span>{bank.logo}</span>
                        <span>{bank.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cardNumber">Nomor Kartu *</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                maxLength={19}
              />
            </div>

            <div>
              <Label htmlFor="cardName">Nama Pemegang Kartu *</Label>
              <Input
                id="cardName"
                placeholder="NAMA SESUAI KARTU"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardExpiry">Berlaku Hingga *</Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cardCVV">CVV *</Label>
                <Input
                  id="cardCVV"
                  type="password"
                  placeholder="123"
                  value={cardCVV}
                  onChange={(e) => handleCVVChange(e.target.value)}
                  maxLength={3}
                />
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Demo Mode:</strong> Data kartu tidak akan disimpan. 
                Ini hanya untuk demonstrasi fitur pembayaran.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDebitDialog(false);
                resetDebitForm();
              }}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleDebitPayment}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Bayar Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QRIS Dialog */}
      <Dialog open={showQRISDialog} onOpenChange={setShowQRISDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Pembayaran QRIS
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Scan QR Code ini dengan aplikasi e-wallet Anda
              </p>

              {/* QR Code Demo - using a service that generates QR codes */}
              <div className="bg-white p-6 rounded-lg inline-block border-2 border-dashed border-gray-300">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226670016COM.NOBUBANK.WWW01189360050300000898140214936005083000890303UME51440014ID.CO.QRIS.WWW0215ID10200000000830303UME5204481253033605802ID5919HEALTH HUB HOSPITAL6007JAKARTA61051234062460114936005083000890703A0163046F1A"
                  alt="QRIS QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Badge className="bg-blue-500 text-white">GoPay</Badge>
                  <Badge className="bg-purple-500 text-white">OVO</Badge>
                  <Badge className="bg-teal-500 text-white">DANA</Badge>
                  <Badge className="bg-red-500 text-white">LinkAja</Badge>
                  <Badge className="bg-orange-500 text-white">ShopeePay</Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  Semua e-wallet yang mendukung QRIS dapat digunakan
                </p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm text-left">
                <h4 className="font-medium mb-3">Cara Pembayaran:</h4>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                    1
                  </div>
                  <p className="text-muted-foreground">
                    Buka aplikasi e-wallet favorit Anda (GoPay, OVO, DANA, dll)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                    2
                  </div>
                  <p className="text-muted-foreground">
                    Pilih menu "Scan QR" atau "Bayar"
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                    3
                  </div>
                  <p className="text-muted-foreground">
                    Scan QR Code di atas
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs flex-shrink-0">
                    4
                  </div>
                  <p className="text-muted-foreground">
                    Konfirmasi pembayaran di aplikasi Anda
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-800 dark:text-green-200">
                  <strong>Demo QRIS:</strong> QR Code ini adalah contoh untuk demonstrasi. 
                  Dapat di-scan oleh semua aplikasi e-wallet yang mendukung QRIS.
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowQRISDialog(false)}
            className="w-full"
          >
            Tutup
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
