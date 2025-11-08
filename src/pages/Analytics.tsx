import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { analyticsAPI } from '@/lib/api';
import { SalesData, Prediction, Period } from '@/types';
import { isAuthenticated } from '@/lib/auth';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { TrendingUp, Calendar } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('week');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<SalesData | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }
    loadData();
  }, [navigate, period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sales, preds] = await Promise.all([
        analyticsAPI.getSales(period),
        analyticsAPI.getPredictions(),
      ]);
      setSalesData(sales);
      setPredictions(preds);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLabels = () => {
    if (period === 'day') return ['Morning', 'Afternoon', 'Evening'];
    if (period === 'week') return salesData.map((d) => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }));
    if (period === 'month') return salesData.map((d) => new Date(d.date).toLocaleDateString('en-US', { day: 'numeric' }));
    return salesData.map((d) => new Date(d.date).toLocaleDateString('en-US', { month: 'short' }));
  };

  const chartData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Sales (₹)',
        data: salesData.map((d) => d.sales),
        backgroundColor: 'hsl(145, 63%, 42%)',
        hoverBackgroundColor: 'hsl(145, 63%, 35%)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Sales: ₹${context.parsed.y}`,
        },
      },
    },
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedDate(salesData[index]);
      }
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Sales insights and predictions</p>
        </div>

        {/* Period Selector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Sales Overview</CardTitle>
              </div>
              <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>Click on any bar to see detailed items sold</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : (
              <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Predictions */}
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Purchase Predictions</CardTitle>
            </div>
            <CardDescription>Items to reorder based on stock levels and demand</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">{pred.item}</p>
                    <p className="text-sm text-muted-foreground">{pred.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{pred.quantity}</p>
                    <p className="text-xs text-muted-foreground">
                      {pred.daysUntil === 0
                        ? 'Today'
                        : pred.daysUntil === 1
                        ? 'Tomorrow'
                        : `${pred.daysUntil} days`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Sales Detail Modal */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Sales Details - {selectedDate && new Date(selectedDate.date).toLocaleDateString()}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="font-semibold">Total Sales</span>
              <span className="text-xl font-bold text-primary">₹{selectedDate?.sales}</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Items Sold</h4>
              {selectedDate?.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} units</p>
                  </div>
                  <span className="font-semibold">₹{item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <VoiceAssistant />
    </div>
  );
};

export default Analytics;
