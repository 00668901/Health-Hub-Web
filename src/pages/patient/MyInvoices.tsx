import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Eye, Calendar, CreditCard, Printer } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';

export default function MyInvoices() {
  const { user } = useAuth();
  const { invoices, patients } = useData();
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  // Get patient record for current user
  const currentPatient = patients.find(p => p.email === user?.email || p.phone === user?.phone);

  // Filter invoices for current patient
  const myInvoices = currentPatient
    ? invoices.filter(inv => inv.patientMedicalRecordNumber === currentPatient.medicalRecordNumber)
    : [];

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2">Invoice Saya</h1>
        <p className="text-muted-foreground">Lihat dan unduh riwayat invoice pembayaran</p>
      </motion.div>

      {currentPatient && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Nomor Rekam Medis</p>
                  <h2 className="text-white">{currentPatient.medicalRecordNumber}</h2>
                </div>
                <FileText className="w-12 h-12 text-white opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        {myInvoices.length > 0 ? (
          myInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3>{invoice.invoiceNumber}</h3>
                            <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">
                              Lunas
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(invoice.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              <span>{invoice.paymentMethod}</span>
                            </div>
                          </div>
                          <p className="text-sm mt-2">
                            Konsultasi dengan <strong>{invoice.doctorName}</strong>
                          </p>
                          {invoice.insurance && (
                            <Badge variant="outline" className="mt-2">
                              Jaminan: {invoice.insurance}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 md:flex-col md:items-end">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Total Bayar</p>
                        <p className="text-primary">{formatCurrency(invoice.total)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInvoice(invoice)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Belum ada invoice</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Invoice</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div id="invoice-print" className="space-y-6">
              {/* Invoice Header */}
              <div className="text-center border-b pb-6">
                <h2 className="mb-2">Health Hub 2.0</h2>
                <p className="text-sm text-muted-foreground">
                  Jl. Kesehatan No. 123, Jakarta Selatan
                </p>
                <p className="text-sm text-muted-foreground">
                  Telp: (021) 1234-5678 | Email: info@healthhub.com
                </p>
              </div>

              {/* Invoice Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-3">Informasi Invoice</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">No. Invoice:</span>
                      <span>{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tanggal:</span>
                      <span>{formatDate(selectedInvoice.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Waktu Cetak:</span>
                      <span>{formatDate(selectedInvoice.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3">Data Pasien</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nama:</span>
                      <span>{selectedInvoice.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">No. RM:</span>
                      <span className="text-primary">
                        {selectedInvoice.patientMedicalRecordNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dokter:</span>
                      <span>{selectedInvoice.doctorName}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoice Items */}
              <div>
                <h4 className="mb-3">Rincian Biaya</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-accent">
                      <tr>
                        <th className="text-left p-3">Item</th>
                        <th className="text-center p-3">Qty</th>
                        <th className="text-right p-3">Harga</th>
                        <th className="text-right p-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3">{item.name}</td>
                          <td className="text-center p-3">{item.quantity}</td>
                          <td className="text-right p-3">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="text-right p-3">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-accent/50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  {selectedInvoice.insurance ? (
                    <div className="flex justify-between text-green-600">
                      <span>Potongan {selectedInvoice.insurance} (70%):</span>
                      <span>- {formatCurrency(selectedInvoice.subtotal * 0.7)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Pajak (10%):</span>
                      <span>{formatCurrency(selectedInvoice.tax)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CreditCard className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Status Pembayaran: <strong>LUNAS</strong></p>
                    <p className="text-sm">
                      Metode: {selectedInvoice.paymentMethod}
                      {selectedInvoice.insurance && ` | Jaminan: ${selectedInvoice.insurance}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground border-t pt-4">
                <p>Terima kasih telah menggunakan layanan Health Hub 2.0</p>
                <p className="mt-1">Invoice ini adalah bukti pembayaran yang sah</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 print:hidden">
                <Button
                  variant="outline"
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1"
                >
                  Tutup
                </Button>
                <Button
                  onClick={handlePrint}
                  className="flex-1 bg-primary hover:bg-primary-dark gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-print, #invoice-print * {
            visibility: visible;
          }
          #invoice-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
