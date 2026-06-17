import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpiceCategory, SpiceForm } from '@/types';

interface SpiceFilterProps {
  activeCategory: SpiceCategory | '全部';
  onCategoryChange: (category: SpiceCategory | '全部') => void;
  activeForm: SpiceForm | '全部';
  onFormChange: (form: SpiceForm | '全部') => void;
  activeLocation: string | '全部';
  onLocationChange: (location: string | '全部') => void;
  locations: string[];
}

const categories: (SpiceCategory | '全部')[] = [
  '全部',
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

const forms: (SpiceForm | '全部')[] = [
  '全部',
  '整粒',
  '粉末',
  '新鲜',
  '干燥',
  '油浸',
  '膏状',
  '碎片',
];

export default function SpiceFilter({
  activeCategory,
  onCategoryChange,
  activeForm,
  onFormChange,
  activeLocation,
  onLocationChange,
  locations,
}: SpiceFilterProps) {
  const renderTags = (
    items: string[],
    active: string,
    onChange: (value: string) => void
  ) => (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-spice-sage/30 scrollbar-track-transparent">
      {items.map((item) => {
        const isActive = active === item;
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-spice-sage text-white border-spice-sage shadow-md'
                : 'bg-spice-cream text-spice-charcoal border-spice-charcoal/20 hover:border-spice-sage/50 hover:bg-spice-sage/5'
            )}
          >
            {item === '全部' && <Tag className="h-3.5 w-3.5" />}
            {item}
          </button>
        );
      })}
    </div>
  );

  const locationOptions = ['全部', ...locations];

  return (
    <div className="space-y-3 rounded-2xl bg-spice-cream/70 p-4 border border-spice-creamDark">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-spice-brown/80">
          类别
        </div>
        {renderTags(categories, activeCategory, onCategoryChange as (v: string) => void)}
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-spice-brown/80">
          形态
        </div>
        {renderTags(forms, activeForm, onFormChange as (v: string) => void)}
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-spice-brown/80">
          位置
        </div>
        {renderTags(locationOptions, activeLocation, onLocationChange)}
      </div>
    </div>
  );
}
