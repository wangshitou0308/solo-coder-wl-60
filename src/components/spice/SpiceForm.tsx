import { useState, useEffect } from 'react';
import {
  Package,
  Tag,
  Layers,
  Building2,
  Calendar,
  MapPin,
  Percent,
  AlertCircle,
  StickyNote,
  X,
  Save,
  FlaskConical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Spice, SpiceCategory, SpiceForm as SpiceFormType } from '@/types';
import { formatDate } from '@/utils/dateUtils';

interface SpiceFormProps {
  open: boolean;
  onClose: () => void;
  initialData?: Spice;
  onSubmit: (data: Partial<Spice>) => void;
}

const categories: SpiceCategory[] = [
  '香草类',
  '辛香类',
  '辣椒类',
  '花香类',
  '籽类',
  '根茎类',
  '混合类',
  '皮类',
  '叶类',
];

const forms: SpiceFormType[] = [
  '整粒',
  '粉末',
  '新鲜',
  '干燥',
  '油浸',
  '膏状',
  '碎片',
];

interface FormState {
  name: string;
  category: SpiceCategory;
  form: SpiceFormType;
  brand: string;
  purchaseDate: string;
  expiryDate: string;
  isOpen: boolean;
  openDate: string;
  storageLocation: string;
  remainingAmount: number;
  minThreshold: number;
  notes: string;
}

const getDefaultState = (): FormState => ({
  name: '',
  category: '香草类',
  form: '粉末',
  brand: '',
  purchaseDate: formatDate(new Date()),
  expiryDate: formatDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
  isOpen: false,
  openDate: '',
  storageLocation: '',
  remainingAmount: 100,
  minThreshold: 20,
  notes: '',
});

export default function SpiceForm({
  open,
  onClose,
  initialData,
  onSubmit,
}: SpiceFormProps) {
  const [formData, setFormData] = useState<FormState>(getDefaultState());
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          category: initialData.category,
          form: initialData.form,
          brand: initialData.brand,
          purchaseDate: initialData.purchaseDate,
          expiryDate: initialData.expiryDate,
          isOpen: !!initialData.openDate,
          openDate: initialData.openDate || '',
          storageLocation: initialData.storageLocation,
          remainingAmount: initialData.remainingAmount,
          minThreshold: initialData.minThreshold,
          notes: initialData.notes || '',
        });
      } else {
        setFormData(getDefaultState());
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入香料名称';
    }
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = '请选择购买日期';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = '请选择保质日期';
    }
    if (formData.purchaseDate && formData.expiryDate && formData.purchaseDate > formData.expiryDate) {
      newErrors.expiryDate = '保质日期需晚于购买日期';
    }
    if (formData.isOpen && !formData.openDate) {
      newErrors.openDate = '请选择开瓶日期';
    }
    if (!formData.storageLocation.trim()) {
      newErrors.storageLocation = '请输入储存位置';
    }
    if (formData.remainingAmount < 0 || formData.remainingAmount > 100) {
      newErrors.remainingAmount = '剩余量需在0-100之间';
    }
    if (formData.minThreshold < 0 || formData.minThreshold > 100) {
      newErrors.minThreshold = '阈值需在0-100之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData: Partial<Spice> = {
      name: formData.name.trim(),
      category: formData.category,
      form: formData.form,
      brand: formData.brand.trim(),
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate,
      openDate: formData.isOpen ? formData.openDate : undefined,
      storageLocation: formData.storageLocation.trim(),
      remainingAmount: formData.remainingAmount,
      minThreshold: formData.minThreshold,
      notes: formData.notes.trim() || undefined,
    };

    onSubmit(submitData);
    onClose();
  };

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-spice-charcoal/60 backdrop-blur-sm animate-fade-in-up"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-spice-cream shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-spice-creamDark px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-spice-sage/15">
              <FlaskConical className="h-5 w-5 text-spice-sageDark" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-spice-charcoal">
                {initialData ? '编辑香料' : '添加香料'}
              </h2>
              <p className="text-xs text-spice-brown/70">
                填写香料的详细信息
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-spice-brown/70 transition-colors hover:bg-spice-creamDark hover:text-spice-charcoal"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="space-y-6 px-6 py-5">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-spice-sage" />
                <h3 className="text-sm font-semibold text-spice-charcoal">基本信息</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-spice-charcoal">
                    名称 <span className="text-spice-cinnamon">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="例如：黑胡椒、迷迭香"
                    className={cn(
                      'w-full rounded-xl border px-4 py-2.5 text-sm bg-white transition-colors',
                      errors.name
                        ? 'border-spice-cinnamon focus:border-spice-cinnamon focus:ring-spice-cinnamon/20'
                        : 'border-spice-creamDark focus:border-spice-sage focus:ring-spice-sage/20',
                      'focus:outline-none focus:ring-4'
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-spice-cinnamon">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-spice-charcoal">
                      <Tag className="mr-1 inline h-3.5 w-3.5 text-spice-brown/60" />
                      类别 <span className="text-spice-cinnamon">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value as SpiceCategory)}
                      className="w-full rounded-xl border border-spice-creamDark bg-white px-4 py-2.5 text-sm focus:border-spice-sage focus:outline-none focus:ring-4 focus:ring-spice-sage/20"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-spice-charcoal">
                      <Layers className="mr-1 inline h-3.5 w-3.5 text-spice-brown/60" />
                      形态 <span className="text-spice-cinnamon">*</span>
                    </label>
                    <select
                      value={formData.form}
                      onChange={(e) => updateField('form', e.target.value as SpiceFormType)}
                      className="w-full rounded-xl border border-spice-creamDark bg-white px-4 py-2.5 text-sm focus:border-spice-sage focus:outline-none focus:ring-4 focus:ring-spice-sage/20"
                    >
                      {forms.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-spice-saffron" />
                <h3 className="text-sm font-semibold text-spice-charcoal">品牌信息</h3>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-spice-charcoal">
                  品牌
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => updateField('brand', e.target.value)}
                  placeholder="例如：McCormick味好美"
                  className="w-full rounded-xl border border-spice-creamDark bg-white px-4 py-2.5 text-sm focus:border-spice-sage focus:outline-none focus:ring-4 focus:ring-spice-sage/20"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-spice-cinnamon" />
                <h3 className="text-sm font-semibold text-spice-charcoal">日期信息</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-spice-charcoal">
                    购买日期 <span className="text-spice-cinnamon">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => updateField('purchaseDate', e.target.value)}
                    className={cn(
                      'w-full rounded-xl border bg-white px-4 py-2.5 text-sm',
                      errors.purchaseDate
                        ? 'border-spice-cinnamon focus:border-spice-cinnamon focus:ring-spice-cinnamon/20'
                        : 'border-spice-creamDark focus:border-spice-sage focus:ring-spice-sage/20',
                      'focus:outline-none focus:ring-4'
                    )}
                  />
                  {errors.purchaseDate && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-spice-cinnamon">
                      <AlertCircle className="h-3 w-3" />
                      {errors.purchaseDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-spice-charcoal">
                    保质日期 <span className="text-spice-cinnamon">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => updateField('expiryDate', e.target.value)}
                    className={cn(
                      'w-full rounded-xl border bg-white px-4 py-2.5 text-sm',
                      errors.expiryDate
                        ? 'border-spice-cinnamon focus:border-spice-cinnamon focus:ring-spice-cinnamon/20'
                        : 'border-spice-creamDark focus:border-spice-sage focus:ring-spice-sage/20',
                      'focus:outline-none focus:ring-4'
                    )}
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-spice-cinnamon">
                      <AlertCircle className="h-3 w-3" />
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-spice-creamDark bg-spice-creamDark/20 p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOpen}
                    onChange={(e) => updateField('isOpen', e.target.checked)}
                    className="h-4 w-4 rounded border-spice-creamDark text-spice-sage focus:ring-spice-sage/20"
                  />
                  <span className="text-sm font-medium text-spice-charcoal">
                    已开瓶
                  </span>
                </label>

                {formData.isOpen && (
                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-medium text-spice-charcoal">
                      开瓶日期 <span className="text-spice-cinnamon">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.openDate}
                      onChange={(e) => updateField('openDate', e.target.value)}
                      className={cn(
                        'w-full rounded-xl border bg-white px-4 py-2.5 text-sm',
                        errors.openDate
                          ? 'border-spice-cinnamon focus:border-spice-cinnamon focus:ring-spice-cinnamon/20'
                          : 'border-spice-creamDark focus:border-spice-sage focus:ring-spice-sage/20',
                        'focus:outline-none focus:ring-4'
                      )}
                    />
                    {errors.openDate && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-spice-cinnamon">
                        <AlertCircle className="h-3 w-3" />
                        {errors.openDate}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-spice-sageDark" />
                <h3 className="text-sm font-semibold text-spice-charcoal">储存信息</h3>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-spice-charcoal">
                  储存位置 <span className="text-spice-cinnamon">*</span>
                </label>
                <input
                  type="text"
                  value={formData.storageLocation}
                  onChange={(e) => updateField('storageLocation', e.target.value)}
                  placeholder="例如：厨房上层橱柜A区"
                  className={cn(
                    'w-full rounded-xl border bg-white px-4 py-2.5 text-sm',
                    errors.storageLocation
                      ? 'border-spice-cinnamon focus:border-spice-cinnamon focus:ring-spice-cinnamon/20'
                      : 'border-spice-creamDark focus:border-spice-sage focus:ring-spice-sage/20',
                    'focus:outline-none focus:ring-4'
                  )}
                />
                {errors.storageLocation && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-spice-cinnamon">
                    <AlertCircle className="h-3 w-3" />
                    {errors.storageLocation}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-spice-brown" />
                <h3 className="text-sm font-semibold text-spice-charcoal">库存信息</h3>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-spice-charcoal">
                      剩余量
                    </label>
                    <span className="text-sm font-semibold text-spice-sageDark">
                      {formData.remainingAmount}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formData.remainingAmount}
                    onChange={(e) => updateField('remainingAmount', Number(e.target.value))}
                    className="w-full h-2.5 rounded-full bg-spice-creamDark appearance-none cursor-pointer accent-spice-sage"
                  />
                  {errors.remainingAmount && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-spice-cinnamon">
                      <AlertCircle className="h-3 w-3" />
                      {errors.remainingAmount}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-spice-charcoal">
                      最低阈值
                    </label>
                    <span className="text-sm font-semibold text-spice-saffron">
                      {formData.minThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={formData.minThreshold}
                    onChange={(e) => updateField('minThreshold', Number(e.target.value))}
                    className="w-full h-2.5 rounded-full bg-spice-creamDark appearance-none cursor-pointer accent-spice-saffron"
                  />
                  {errors.minThreshold && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-spice-cinnamon">
                      <AlertCircle className="h-3 w-3" />
                      {errors.minThreshold}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-spice-brownLight" />
                <h3 className="text-sm font-semibold text-spice-charcoal">备注</h3>
              </div>

              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="添加备注信息，例如：使用场景、风味特点、搭配建议等..."
                rows={4}
                className="w-full resize-none rounded-xl border border-spice-creamDark bg-white px-4 py-3 text-sm focus:border-spice-sage focus:outline-none focus:ring-4 focus:ring-spice-sage/20"
              />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-spice-creamDark bg-spice-creamDark/30 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-spice-creamDark bg-white px-5 py-2.5 text-sm font-medium text-spice-charcoal transition-colors hover:bg-spice-creamDark"
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-spice-sage px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-spice-sageDark shadow-md hover:shadow-lg"
          >
            <Save className="h-4 w-4" />
            {initialData ? '保存修改' : '添加香料'}
          </button>
        </div>
      </div>
    </div>
  );
}
