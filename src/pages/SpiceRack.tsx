import { useState, useMemo } from 'react';
import { Search, Plus, MapPin, X, Edit2, Trash2, PackageOpen, Calendar as CalendarIcon, AlertTriangle, Tag } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import SpiceFilter from '@/components/spice/SpiceFilter';
import SpiceCard from '@/components/spice/SpiceCard';
import Modal from '@/components/common/Modal';
import Badge from '@/components/common/Badge';
import ProgressBar from '@/components/common/ProgressBar';
import { useSpiceStore } from '@/store/useSpiceStore';
import { getExpiryStatus, formatDate } from '@/utils/dateUtils';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { cn } from '@/lib/utils';
import type { Spice, SpiceCategory, SpiceForm as SpiceFormType, SeasonType } from '@/types';

const categoryOptions: SpiceCategory[] = ['香草类', '辛香类', '辣椒类', '花香类', '籽类', '根茎类', '混合类', '皮类', '叶类'];
const formOptions: SpiceFormType[] = ['整粒', '粉末', '新鲜', '干燥', '油浸', '膏状', '碎片'];
const seasonOptions: SeasonType[] = ['春季', '夏季', '秋季', '冬季'];

interface SpiceFormData {
  name: string;
  category: SpiceCategory;
  form: SpiceFormType;
  brand: string;
  purchaseDate: string;
  expiryDate: string;
  openDate: string;
  storageLocation: string;
  remainingAmount: number;
  minThreshold: number;
  notes: string;
  isSeasonal: boolean;
  seasonType?: SeasonType;
}

const emptyForm: SpiceFormData = {
  name: '',
  category: '辛香类',
  form: '整粒',
  brand: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
  openDate: '',
  storageLocation: '',
  remainingAmount: 100,
  minThreshold: 20,
  notes: '',
  isSeasonal: false,
};

export default function SpiceRack() {
  const spices = useSpiceStore((state) => state.spices);
  const addSpice = useSpiceStore((state) => state.addSpice);
  const updateSpice = useSpiceStore((state) => state.updateSpice);
  const deleteSpice = useSpiceStore((state) => state.deleteSpice);
  const openSpice = useSpiceStore((state) => state.openSpice);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SpiceCategory | '全部'>('全部');
  const [activeForm, setActiveForm] = useState<SpiceFormType | '全部'>('全部');
  const [activeLocation, setActiveLocation] = useState<string | '全部'>('全部');
  const [groupByLocation, setGroupByLocation] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSpice, setSelectedSpice] = useState<Spice | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSpice, setEditingSpice] = useState<Spice | null>(null);
  const [formData, setFormData] = useState<SpiceFormData>(emptyForm);

  const locations = useMemo(() => {
    const set = new Set(spices.map((s) => s.storageLocation));
    return Array.from(set);
  }, [spices]);

  const filteredSpices = useMemo(() => {
    return spices.filter((spice) => {
      if (searchQuery && !spice.name.toLowerCase().includes(searchQuery.toLowerCase()) && !spice.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (activeCategory !== '全部' && spice.category !== activeCategory) {
        return false;
      }
      if (activeForm !== '全部' && spice.form !== activeForm) {
        return false;
      }
      if (activeLocation !== '全部' && spice.storageLocation !== activeLocation) {
        return false;
      }
      return true;
    });
  }, [spices, searchQuery, activeCategory, activeForm, activeLocation]);

  const groupedSpices = useMemo(() => {
    if (!groupByLocation) return null;
    const groups = new Map<string, Spice[]>();
    filteredSpices.forEach((spice) => {
      const list = groups.get(spice.storageLocation) || [];
      list.push(spice);
      groups.set(spice.storageLocation, list);
    });
    return groups;
  }, [filteredSpices, groupByLocation]);

  const handleCardClick = (spice: Spice) => {
    setSelectedSpice(spice);
    setDetailOpen(true);
  };

  const handleOpenAddForm = () => {
    setEditingSpice(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const handleOpenEditForm = (spice: Spice) => {
    setEditingSpice(spice);
    setFormData({
      name: spice.name,
      category: spice.category,
      form: spice.form,
      brand: spice.brand,
      purchaseDate: spice.purchaseDate,
      expiryDate: spice.expiryDate,
      openDate: spice.openDate || '',
      storageLocation: spice.storageLocation,
      remainingAmount: spice.remainingAmount,
      minThreshold: spice.minThreshold,
      notes: spice.notes || '',
      isSeasonal: spice.isSeasonal || false,
      seasonType: spice.seasonType,
    });
    setDetailOpen(false);
    setFormOpen(true);
  };

  const handleDeleteSpice = (spice: Spice) => {
    if (confirm(`确定要删除「${spice.name}」吗？`)) {
      deleteSpice(spice.id);
      setDetailOpen(false);
    }
  };

  const handleFormSubmit = () => {
    if (!formData.name.trim()) {
      alert('请输入香料名称');
      return;
    }
    if (!formData.expiryDate) {
      alert('请输入保质期');
      return;
    }

    const submitData = {
      ...formData,
      openDate: formData.openDate || undefined,
      notes: formData.notes || undefined,
      seasonType: formData.isSeasonal ? formData.seasonType : undefined,
    };

    if (editingSpice) {
      updateSpice(editingSpice.id, submitData);
    } else {
      addSpice(submitData);
    }
    setFormOpen(false);
  };

  const handleMarkOpened = (spice: Spice) => {
    if (!spice.openDate) {
      openSpice(spice.id, new Date().toISOString().split('T')[0]);
      setSelectedSpice({ ...spice, openDate: new Date().toISOString().split('T')[0] });
    }
  };

  const renderSpiceGrid = (list: Spice[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {list.map((spice) => (
        <SpiceCard key={spice.id} spice={spice} onClick={() => handleCardClick(spice)} />
      ))}
    </div>
  );

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in-up">
        <div>
          <h1 className="font-display text-2xl font-bold text-spice-charcoal">香料柜</h1>
          <p className="mt-1 text-sm text-spice-brown/70">管理你的香料库存</p>
        </div>

        <SpiceFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeForm={activeForm}
          onFormChange={setActiveForm}
          activeLocation={activeLocation}
          onLocationChange={setActiveLocation}
          locations={locations}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-spice-brown/60" />
            <input
              type="text"
              placeholder="搜索香料名称或品牌..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
            />
          </div>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-spice-creamDark cursor-pointer hover:bg-spice-creamDark/30 transition-colors">
            <MapPin className="h-4 w-4 text-spice-brown" />
            <span className="text-sm text-spice-charcoal whitespace-nowrap">按位置分组</span>
            <div
              className={cn(
                'relative w-10 h-5 rounded-full transition-colors cursor-pointer',
                groupByLocation ? 'bg-spice-sage' : 'bg-spice-creamDark'
              )}
              onClick={() => setGroupByLocation(!groupByLocation)}
            >
              <div
                className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform',
                  groupByLocation ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
          </label>
          <button
            onClick={handleOpenAddForm}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-spice-sage to-spice-sageDark text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>添加香料</span>
          </button>
        </div>

        {filteredSpices.length === 0 ? (
          <div className="py-20 text-center">
            <PackageOpen className="mx-auto h-16 w-16 text-spice-brown/30" />
            <p className="mt-4 text-spice-brown/60">没有找到匹配的香料</p>
          </div>
        ) : groupedSpices ? (
          <div className="space-y-8">
            {Array.from(groupedSpices.entries()).map(([location, list]) => (
              <div key={location}>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-spice-sageDark" />
                  <h3 className="font-display text-base font-semibold text-spice-charcoal">{location}</h3>
                  <Badge text={`${list.length}种`} variant="info" />
                </div>
                {renderSpiceGrid(list)}
              </div>
            ))}
          </div>
        ) : (
          renderSpiceGrid(filteredSpices)
        )}
      </div>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={selectedSpice?.name}
        footer={
          selectedSpice && (
            <>
              <button
                onClick={() => handleDeleteSpice(selectedSpice)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-spice-cinnamon border border-spice-cinnamon/30 hover:bg-spice-cinnamon/10 transition-colors"
              >
                删除
              </button>
              <button
                onClick={() => handleMarkOpened(selectedSpice)}
                disabled={!!selectedSpice.openDate}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedSpice.openDate
                    ? 'text-spice-brown/50 bg-spice-creamDark cursor-not-allowed'
                    : 'text-spice-brown border border-spice-brown/30 hover:bg-spice-brown/10'
                )}
              >
                {selectedSpice.openDate ? '已开瓶' : '标记开瓶'}
              </button>
              <button
                onClick={() => handleOpenEditForm(selectedSpice)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-spice-sage to-spice-sageDark text-white shadow-md hover:shadow-lg transition-all"
              >
                编辑
              </button>
            </>
          )
        }
      >
        {selectedSpice && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-spice-creamDark to-spice-cream flex items-center justify-center flex-shrink-0">
                <span className="text-4xl">{generateSpiceEmoji(selectedSpice.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge text={selectedSpice.category} variant="info" />
                  <Badge text={selectedSpice.form} variant="notice" />
                  {selectedSpice.isSeasonal && selectedSpice.seasonType && (
                    <Badge text={selectedSpice.seasonType} variant="info" />
                  )}
                  {!selectedSpice.openDate && <Badge text="未开瓶" variant="warning" />}
                </div>
                <p className="text-sm text-spice-brown/80">品牌：{selectedSpice.brand}</p>
                <p className="text-sm text-spice-brown/80">位置：{selectedSpice.storageLocation}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-spice-charcoal">库存余量</span>
                <span className="text-sm font-semibold text-spice-sageDark">{selectedSpice.remainingAmount}%</span>
              </div>
              <ProgressBar value={selectedSpice.remainingAmount} threshold={selectedSpice.minThreshold} showLabel={false} />
              <p className="mt-1 text-xs text-spice-brown/60">最低阈值：{selectedSpice.minThreshold}%</p>
            </div>

            {(() => {
              const expiryResult = getExpiryStatus(selectedSpice.expiryDate, selectedSpice.openDate);
              const isExpired = expiryResult.status === 'expired';
              return (
                <div className={cn(
                  'p-4 rounded-xl border',
                  isExpired ? 'bg-spice-cinnamon/5 border-spice-cinnamon/20' : 'bg-spice-cream border-spice-creamDark'
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    {isExpired ? (
                      <AlertTriangle className="h-4 w-4 text-spice-cinnamon" />
                    ) : (
                      <CalendarIcon className="h-4 w-4 text-spice-brown" />
                    )}
                    <span className="text-sm font-medium text-spice-charcoal">保质期信息</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-spice-brown/60 text-xs">购入日期</p>
                      <p className="text-spice-charcoal">{formatDate(selectedSpice.purchaseDate)}</p>
                    </div>
                    <div>
                      <p className="text-spice-brown/60 text-xs">保质期限</p>
                      <p className="text-spice-charcoal">{formatDate(selectedSpice.expiryDate)}</p>
                    </div>
                    {selectedSpice.openDate && (
                      <div>
                        <p className="text-spice-brown/60 text-xs">开瓶日期</p>
                        <p className="text-spice-charcoal">{formatDate(selectedSpice.openDate)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-spice-brown/60 text-xs">状态</p>
                      <Badge
                        text={isExpired ? `已过期${Math.abs(expiryResult.days)}天` : `剩余${expiryResult.days}天`}
                        variant={isExpired ? 'danger' : expiryResult.status === 'urgent' ? 'danger' : expiryResult.status === 'soon' ? 'warning' : 'success'}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {selectedSpice.notes && (
              <div className="p-4 rounded-xl bg-spice-cream border border-spice-creamDark">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-spice-brown" />
                  <span className="text-sm font-medium text-spice-charcoal">备注</span>
                </div>
                <p className="text-sm text-spice-brown/80">{selectedSpice.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingSpice ? '编辑香料' : '添加香料'}
        footer={
          <>
            <button
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-spice-brown border border-spice-creamDark hover:bg-spice-creamDark/50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleFormSubmit}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-spice-sage to-spice-sageDark text-white shadow-md hover:shadow-lg transition-all"
            >
              {editingSpice ? '保存' : '添加'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">香料名称 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例如：黑胡椒"
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">类别</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SpiceCategory })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">形态</label>
              <select
                value={formData.form}
                onChange={(e) => setFormData({ ...formData, form: e.target.value as SpiceFormType })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              >
                {formOptions.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">品牌</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="例如：McCormick"
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">购入日期</label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">保质期限 *</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">开瓶日期</label>
              <input
                type="date"
                value={formData.openDate}
                onChange={(e) => setFormData({ ...formData, openDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">存放位置</label>
              <input
                type="text"
                value={formData.storageLocation}
                onChange={(e) => setFormData({ ...formData, storageLocation: e.target.value })}
                placeholder="例如：厨房上层橱柜"
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">余量 (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.remainingAmount}
                onChange={(e) => setFormData({ ...formData, remainingAmount: Math.max(0, Math.min(100, Number(e.target.value))) })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">低库存阈值 (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: Math.max(0, Math.min(100, Number(e.target.value))) })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-spice-cream border border-spice-creamDark">
            <div
              className={cn(
                'relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0',
                formData.isSeasonal ? 'bg-spice-sage' : 'bg-spice-creamDark'
              )}
              onClick={() => setFormData({ ...formData, isSeasonal: !formData.isSeasonal })}
            >
              <div
                className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform',
                  formData.isSeasonal ? 'translate-x-5' : 'translate-x-0.5'
                )}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-spice-charcoal">季节限定</p>
              <p className="text-xs text-spice-brown/60">标记为季节性香料</p>
            </div>
            {formData.isSeasonal && (
              <select
                value={formData.seasonType || '春季'}
                onChange={(e) => setFormData({ ...formData, seasonType: e.target.value as SeasonType })}
                className="px-3 py-1.5 rounded-lg bg-white border border-spice-creamDark text-sm text-spice-charcoal focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              >
                {seasonOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-spice-charcoal mb-1.5">备注</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="添加备注..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all resize-none"
            />
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
