import { useState, useMemo } from 'react';
import { ClipboardList, BookMarked, Plus, Star, Calendar as CalendarIcon, Clock, Trash2, ChefHat, Sparkles, X } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Modal from '@/components/common/Modal';
import Badge from '@/components/common/Badge';
import { useRecordStore } from '@/store/useRecordStore';
import { useRecipeStore } from '@/store/useRecipeStore';
import { useSpiceStore } from '@/store/useSpiceStore';
import { generateSpiceEmoji } from '@/utils/spiceUtils';
import { formatDate } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

type TabKey = 'cooking' | 'recipes';

interface RecordFormData {
  dishName: string;
  cookDate: string;
  ingredients: string;
  spicesUsed: string[];
  flavorRating: number;
  notes: string;
}

interface RecipeFormData {
  name: string;
  description: string;
  suitableDishes: string;
  components: { spiceId: string; spiceName: string; ratio: number }[];
}

const emptyRecordForm: RecordFormData = {
  dishName: '',
  cookDate: new Date().toISOString().split('T')[0],
  ingredients: '',
  spicesUsed: [],
  flavorRating: 4,
  notes: '',
};

export default function Records() {
  const records = useRecordStore((state) => state.records);
  const addRecord = useRecordStore((state) => state.addRecord);
  const deleteRecord = useRecordStore((state) => state.deleteRecord);
  const recipes = useRecipeStore((state) => state.recipes);
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const deleteRecipe = useRecipeStore((state) => state.deleteRecipe);
  const spices = useSpiceStore((state) => state.spices);

  const [activeTab, setActiveTab] = useState<TabKey>('cooking');
  const [recordFormOpen, setRecordFormOpen] = useState(false);
  const [recordForm, setRecordForm] = useState<RecordFormData>(emptyRecordForm);
  const [recipeFormOpen, setRecipeFormOpen] = useState(false);
  const [recipeForm, setRecipeForm] = useState<RecipeFormData>({
    name: '',
    description: '',
    suitableDishes: '',
    components: [],
  });

  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => new Date(b.cookDate).getTime() - new Date(a.cookDate).getTime());
  }, [records]);

  const spiceMap = useMemo(() => new Map(spices.map((s) => [s.id, s])), [spices]);

  const handleSubmitRecord = () => {
    if (!recordForm.dishName.trim()) {
      alert('请输入菜品名称');
      return;
    }
    const usages = recordForm.spicesUsed.map((spiceId) => {
      const spice = spiceMap.get(spiceId);
      return {
        spiceId,
        spiceName: spice?.name || spiceId,
        amount: 1,
        unit: '份',
      };
    });
    addRecord({
      dishName: recordForm.dishName,
      cookDate: recordForm.cookDate,
      ingredients: recordForm.ingredients.split(/[,，、\s]+/).filter(Boolean),
      usages,
      flavorRating: recordForm.flavorRating,
      notes: recordForm.notes || undefined,
    } as any);
    setRecordFormOpen(false);
    setRecordForm(emptyRecordForm);
  };

  const handleSubmitRecipe = () => {
    if (!recipeForm.name.trim()) {
      alert('请输入配方名称');
      return;
    }
    if (recipeForm.components.length === 0) {
      alert('请至少添加一种香料');
      return;
    }
    const totalRatio = recipeForm.components.reduce((sum, c) => sum + c.ratio, 0);
    const normalizedComponents = recipeForm.components.map((c) => ({
      ...c,
      ratio: Math.round((c.ratio / totalRatio) * 100),
    }));
    addRecipe({
      name: recipeForm.name,
      description: recipeForm.description,
      suitableDishes: recipeForm.suitableDishes.split(/[,，、\s]+/).filter(Boolean),
      components: normalizedComponents.map((c) => ({
        spiceId: c.spiceId,
        spiceName: c.spiceName,
        ratio: c.ratio,
      })),
    } as any);
    setRecipeFormOpen(false);
    setRecipeForm({ name: '', description: '', suitableDishes: '', components: [] });
  };

  const toggleSpiceInRecord = (spiceId: string) => {
    setRecordForm((prev) => ({
      ...prev,
      spicesUsed: prev.spicesUsed.includes(spiceId)
        ? prev.spicesUsed.filter((id) => id !== spiceId)
        : [...prev.spicesUsed, spiceId],
    }));
  };

  const addSpiceToRecipe = (spiceId: string) => {
    const spice = spiceMap.get(spiceId);
    if (!spice) return;
    setRecipeForm((prev) => ({
      ...prev,
      components: [...prev.components, { spiceId, spiceName: spice.name, ratio: 20 }],
    }));
  };

  const removeSpiceFromRecipe = (spiceId: string) => {
    setRecipeForm((prev) => ({
      ...prev,
      components: prev.components.filter((c) => c.spiceId !== spiceId),
    }));
  };

  const updateComponentRatio = (spiceId: string, ratio: number) => {
    setRecipeForm((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.spiceId === spiceId ? { ...c, ratio: Math.max(1, ratio) } : c
      ),
    }));
  };

  const renderStars = (rating: number, interactive?: boolean, onChange?: (r: number) => void) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(n)}
            className={cn(
              !interactive && 'cursor-default',
              interactive && 'cursor-pointer hover:scale-110 transition-transform'
            )}
          >
            <Star
              className={cn(
                'h-4 w-4 transition-colors',
                n <= rating
                  ? 'fill-spice-saffron text-spice-saffron'
                  : 'text-spice-creamDark'
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in-up">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-spice-charcoal">使用记录</h1>
            <p className="mt-1 text-sm text-spice-brown/70">记录每次烹饪，积累专属配方</p>
          </div>
          <button
            onClick={() => activeTab === 'cooking' ? setRecordFormOpen(true) : setRecipeFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-spice-sage to-spice-sageDark text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>{activeTab === 'cooking' ? '新建记录' : '新增配方'}</span>
          </button>
        </div>

        <div className="flex gap-2 p-1 rounded-2xl bg-spice-cream border border-spice-creamDark w-fit">
          <button
            onClick={() => setActiveTab('cooking')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === 'cooking'
                ? 'bg-gradient-to-r from-spice-sage to-spice-sageDark text-white shadow-md'
                : 'text-spice-brown hover:bg-spice-creamDark/50 hover:text-spice-charcoal'
            )}
          >
            <ClipboardList className="h-4 w-4" />
            <span>烹饪记录</span>
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              activeTab === 'recipes'
                ? 'bg-gradient-to-r from-spice-sage to-spice-sageDark text-white shadow-md'
                : 'text-spice-brown hover:bg-spice-creamDark/50 hover:text-spice-charcoal'
            )}
          >
            <BookMarked className="h-4 w-4" />
            <span>自定义配方</span>
          </button>
        </div>

        {activeTab === 'cooking' && (
          <div className="relative">
            {sortedRecords.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-white border border-spice-creamDark">
                <ChefHat className="mx-auto h-16 w-16 text-spice-brown/30" />
                <p className="mt-4 text-spice-brown/60">还没有烹饪记录</p>
                <p className="text-sm text-spice-brown/40 mt-1">开始记录你的每一次创作吧</p>
              </div>
            ) : (
              <div className="relative pl-8">
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-spice-sage via-spice-saffron to-spice-cinnamon rounded-full" />
                {sortedRecords.map((record, index) => (
                  <div key={record.id} className="relative mb-8 last:mb-0">
                    <div
                      className={cn(
                        'absolute -left-5 top-4 w-4 h-4 rounded-full border-2 border-white shadow-md',
                        index === 0
                          ? 'bg-spice-cinnamon'
                          : index === 1
                            ? 'bg-spice-saffron'
                            : 'bg-spice-sage'
                      )}
                    />
                    <div className="rounded-2xl bg-white border border-spice-creamDark p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <h3 className="font-display text-lg font-semibold text-spice-charcoal">
                              {record.dishName}
                            </h3>
                            {renderStars(record.flavorRating)}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-spice-brown/70 mb-3">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {formatDate(record.cookDate)}
                            </span>
                            {record.ingredients && record.ingredients.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5" />
                                {record.ingredients.length}种食材
                              </span>
                            )}
                          </div>
                          {record.usages && record.usages.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {record.usages.map((usage) => (
                                <span
                                  key={usage.spiceId}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-spice-sage/10 text-spice-sageDark text-xs border border-spice-sage/20"
                                >
                                  <span>{generateSpiceEmoji(usage.spiceName)}</span>
                                  {usage.spiceName}
                                </span>
                              ))}
                            </div>
                          )}
                          {record.notes && (
                            <p className="text-sm text-spice-brown/80 bg-spice-cream rounded-lg px-3 py-2">
                              {record.notes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`确定要删除「${record.dishName}」的记录吗？`)) {
                              deleteRecord(record.id);
                            }
                          }}
                          className="p-2 rounded-lg text-spice-brown/50 hover:text-spice-cinnamon hover:bg-spice-cinnamon/10 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'recipes' && (
          <div>
            {recipes.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-white border border-spice-creamDark">
                <BookMarked className="mx-auto h-16 w-16 text-spice-brown/30" />
                <p className="mt-4 text-spice-brown/60">还没有自定义配方</p>
                <p className="text-sm text-spice-brown/40 mt-1">创建专属的香料配比配方吧</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="rounded-2xl bg-white border border-spice-creamDark overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="h-24 bg-gradient-to-br from-spice-saffron/20 via-spice-brown/20 to-spice-cinnamon/20 flex items-center justify-center relative">
                      <div className="flex items-center -space-x-2">
                        {(recipe.components || []).slice(0, 4).map((comp, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-spice-cream"
                            title={comp.spiceName}
                          >
                            <span className="text-lg">{generateSpiceEmoji(comp.spiceName)}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`确定要删除配方「${recipe.name}」吗？`)) {
                            deleteRecipe(recipe.id);
                          }
                        }}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-spice-brown/60 hover:text-spice-cinnamon hover:bg-spice-cinnamon/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-spice-charcoal mb-1">
                          {recipe.name}
                        </h3>
                        <p className="text-sm text-spice-brown/80 line-clamp-2">{recipe.description}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-spice-brown/60">
                          香料配比
                        </p>
                        <div className="space-y-2">
                          {(recipe.components || []).map((comp, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-sm w-6 text-center">
                                {generateSpiceEmoji(comp.spiceName)}
                              </span>
                              <span className="text-sm text-spice-charcoal flex-1 truncate">
                                {comp.spiceName}
                              </span>
                              <span className="text-xs font-semibold text-spice-sageDark w-10 text-right">
                                {comp.ratio}%
                              </span>
                              <div className="w-16 h-1.5 rounded-full bg-spice-creamDark overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-spice-sage to-spice-sageDark"
                                  style={{ width: `${comp.ratio}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {recipe.suitableDishes && recipe.suitableDishes.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-spice-brown/60 mb-2">
                            适用菜品
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {recipe.suitableDishes.map((d) => (
                              <Badge key={d} text={d} variant="notice" />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        open={recordFormOpen}
        onClose={() => setRecordFormOpen(false)}
        title="新建烹饪记录"
        footer={
          <>
            <button
              onClick={() => setRecordFormOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-spice-brown border border-spice-creamDark hover:bg-spice-creamDark/50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmitRecord}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-spice-sage to-spice-sageDark text-white shadow-md hover:shadow-lg transition-all"
            >
              保存
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-spice-charcoal mb-1.5">菜品名称 *</label>
            <input
              type="text"
              value={recordForm.dishName}
              onChange={(e) => setRecordForm({ ...recordForm, dishName: e.target.value })}
              placeholder="例如：黑椒牛排"
              className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">烹饪日期</label>
              <input
                type="date"
                value={recordForm.cookDate}
                onChange={(e) => setRecordForm({ ...recordForm, cookDate: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-spice-charcoal mb-1.5">风味评分</label>
              <div className="py-2">{renderStars(recordForm.flavorRating, true, (r) => setRecordForm({ ...recordForm, flavorRating: r }))}</div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-spice-charcoal mb-1.5">食材（逗号/空格分隔）</label>
            <input
              type="text"
              value={recordForm.ingredients}
              onChange={(e) => setRecordForm({ ...recordForm, ingredients: e.target.value })}
              placeholder="例如：牛排, 黄油, 大蒜"
              className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-spice-charcoal mb-2">
              使用香料 <span className="text-xs font-normal text-spice-brown/60">（已选 {recordForm.spicesUsed.length} 种）</span>
            </label>
            <div className="max-h-48 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-spice-cream border border-spice-creamDark">
              {spices.map((spice) => {
                const selected = recordForm.spicesUsed.includes(spice.id);
                return (
                  <button
                    key={spice.id}
                    type="button"
                    onClick={() => toggleSpiceInRecord(spice.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border',
                      selected
                        ? 'bg-spice-sage text-white border-spice-sage shadow-sm'
                        : 'bg-white text-spice-charcoal border-spice-creamDark hover:border-spice-sage/50'
                    )}
                  >
                    <span className="text-base">{generateSpiceEmoji(spice.name)}</span>
                    <span className="truncate">{spice.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-spice-charcoal mb-1.5">备注</label>
            <textarea
              rows={3}
              value={recordForm.notes}
              onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
              placeholder="记录烹饪心得..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all resize-none"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={recipeFormOpen}
        onClose={() => setRecipeFormOpen(false)}
        title="新增配方"
        footer={
          <>
            <button
              onClick={() => setRecipeFormOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-spice-brown border border-spice-creamDark hover:bg-spice-creamDark/50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmitRecipe}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-spice-sage to-spice-sageDark text-white shadow-md hover:shadow-lg transition-all"
            >
              保存
            </button>
          </>
        }
        className="max-w-xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-spice-charcoal mb-1.5">配方名称 *</label>
            <input
              type="text"
              value={recipeForm.name}
              onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
              placeholder="例如：印度咖喱粉"
              className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-spice-charcoal mb-1.5">配方描述</label>
            <textarea
              rows={2}
              value={recipeForm.description}
              onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })}
              placeholder="描述这个配方的特点和风味..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-spice-charcoal mb-1.5">适用菜品（逗号分隔）</label>
            <input
              type="text"
              value={recipeForm.suitableDishes}
              onChange={(e) => setRecipeForm({ ...recipeForm, suitableDishes: e.target.value })}
              placeholder="例如：咖喱鸡, 咖喱牛肉, 蔬菜咖喱"
              className="w-full px-3 py-2 rounded-lg bg-white border border-spice-creamDark text-spice-charcoal placeholder:text-spice-brown/50 focus:outline-none focus:ring-2 focus:ring-spice-sage/30 focus:border-spice-sage/50 transition-all"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-spice-charcoal">香料配比 *</label>
              <span className="text-xs text-spice-brown/60">
                总计 {recipeForm.components.reduce((s, c) => s + c.ratio, 0)}
              </span>
            </div>
            {recipeForm.components.length > 0 ? (
              <div className="space-y-2 mb-3">
                {recipeForm.components.map((comp) => (
                  <div
                    key={comp.spiceId}
                    className="flex items-center gap-3 p-2 rounded-lg bg-spice-cream border border-spice-creamDark"
                  >
                    <span className="text-xl w-8 text-center">{generateSpiceEmoji(comp.spiceName)}</span>
                    <span className="text-sm text-spice-charcoal flex-1 truncate">{comp.spiceName}</span>
                    <input
                      type="number"
                      min={1}
                      value={comp.ratio}
                      onChange={(e) => updateComponentRatio(comp.spiceId, Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-md bg-white border border-spice-creamDark text-sm text-spice-charcoal text-center focus:outline-none focus:ring-2 focus:ring-spice-sage/30"
                    />
                    <span className="text-xs text-spice-brown/60 w-6">份</span>
                    <button
                      type="button"
                      onClick={() => removeSpiceFromRecipe(comp.spiceId)}
                      className="p-1 rounded-md text-spice-brown/50 hover:text-spice-cinnamon hover:bg-spice-cinnamon/10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-spice-brown/60 mb-3 py-2 text-center bg-spice-cream rounded-lg border border-spice-creamDark border-dashed">
                请从下方选择香料添加到配方
              </p>
            )}
            <div className="max-h-40 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-spice-cream border border-spice-creamDark">
              {spices
                .filter((s) => !recipeForm.components.find((c) => c.spiceId === s.id))
                .map((spice) => (
                  <button
                    key={spice.id}
                    type="button"
                    onClick={() => addSpiceToRecipe(spice.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white text-spice-charcoal border border-spice-creamDark hover:border-spice-sage/50 hover:bg-spice-sage/5 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5 text-spice-sage" />
                    <span className="truncate">{spice.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
