import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { InventoryTable } from '@/components/InventoryTable';
import { ItemModal } from '@/components/ItemModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { inventoryAPI, analyticsAPI } from '@/lib/api';
import { InventoryItem, Prediction } from '@/types';
import { isAuthenticated } from '@/lib/auth';
import { Search, Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Inventory = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }
    loadData();
  }, [navigate]);

  useEffect(() => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const loadData = async () => {
    try {
      const [itemsData, predictionsData] = await Promise.all([
        inventoryAPI.getAll(),
        analyticsAPI.getPredictions(),
      ]);
      setItems(itemsData);
      setFilteredItems(itemsData);
      setPredictions(predictionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await inventoryAPI.delete(id);
      toast.success('Item deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleSaveItem = async (itemData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    try {
      if (editingItem) {
        await inventoryAPI.update(editingItem.id, itemData);
        toast.success('Item updated successfully');
      } else {
        await inventoryAPI.create(itemData);
        toast.success('Item added successfully');
      }
      loadData();
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage your stock</p>
          </div>
          <Button onClick={handleAddItem} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {/* Predictions */}
        <Card className="border-info bg-info/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-info" />
              <CardTitle>Reorder Predictions</CardTitle>
            </div>
            <CardDescription>Items to reorder in the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {predictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border"
                >
                  <div>
                    <p className="font-medium">{pred.item}</p>
                    <p className="text-sm text-muted-foreground">{pred.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{pred.quantity} units</p>
                    <p className="text-xs text-muted-foreground">
                      {pred.daysUntil === 1 ? 'Tomorrow' : `In ${pred.daysUntil} days`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Items</CardTitle>
            <CardDescription>Manage your entire inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <InventoryTable
                items={filteredItems}
                showActions
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <ItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveItem}
        editItem={editingItem}
      />

      <VoiceAssistant onCommandProcessed={loadData} />
    </div>
  );
};

export default Inventory;
