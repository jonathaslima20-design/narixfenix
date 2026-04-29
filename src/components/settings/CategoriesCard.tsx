import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, RotateCcw, ChevronDown } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { useLeadCategories, LeadCategoryRow } from '../../lib/useLeadCategories';
import { resolveIcon, ICON_OPTIONS } from '../../lib/iconMap';
import { Card } from '../ui/Card';

const COLOR_OPTIONS = [
  { label: 'Azul', value: 'bg-sky-100 text-sky-700' },
  { label: 'Âmbar', value: 'bg-amber-100 text-amber-700' },
  { label: 'Vermelho', value: 'bg-red-100 text-red-700' },
  { label: 'Verde', value: 'bg-teal-100 text-teal-700' },
  { label: 'Rosa', value: 'bg-pink-100 text-pink-700' },
  { label: 'Laranja', value: 'bg-orange-100 text-orange-700' },
  { label: 'Esmeralda', value: 'bg-emerald-100 text-emerald-700' },
  { label: 'Cinza', value: 'bg-gray-100 text-gray-700' },
];

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  const handler = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) cb();
  };
  return {
    open: () => document.addEventListener('mousedown', handler),
    close: () => document.removeEventListener('mousedown', handler),
  };
}

function Dropdown({
  value,
  onChange,
  options,
  renderOption,
  renderSelected,
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  renderOption?: (o: { value: string; label: string }) => React.ReactNode;
  renderSelected?: (o: { value: string; label: string } | undefined) => React.ReactNode;
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { open: addListener, close: removeListener } = useOutsideClick(ref, () => {
    setOpen(false);
    removeListener();
  });

  const selected = options.find((o) => o.value === value);

  function toggle() {
    if (open) {
      setOpen(false);
      removeListener();
    } else {
      setOpen(true);
      addListener();
    }
  }

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    removeListener();
  }

  return (
    <div ref={ref} className={`relative shrink-0 ${width ?? 'w-32'}`}>
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between gap-1 bg-white/[0.05] border border-white/[0.10] rounded-lg px-2 py-1 text-xs text-white hover:bg-white/[0.09] transition-colors focus:outline-none focus:ring-1 focus:ring-white/20"
      >
        <span className="truncate">
          {renderSelected ? renderSelected(selected) : selected?.label ?? value}
        </span>
        <ChevronDown size={11} className={`shrink-0 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.1 }}
            className="absolute z-50 top-full mt-1 left-0 min-w-full bg-[#1a1a2e] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden"
            style={{ backdropFilter: 'blur(16px)' }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => pick(opt.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors hover:bg-white/[0.08] ${
                  opt.value === value ? 'bg-white/[0.06] text-white' : 'text-white/70'
                }`}
              >
                {renderOption ? renderOption(opt) : opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryBadge({ category }: { category: LeadCategoryRow }) {
  const Icon = resolveIcon(category.icon);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${category.color}`}>
      <Icon size={10} />
      {category.label}
    </span>
  );
}

function DraggableRow({
  category,
  onDelete,
  onLabelChange,
  onColorChange,
  onIconChange,
  canDelete,
  isOver,
}: {
  category: LeadCategoryRow;
  onDelete: (key: string) => void;
  onLabelChange: (key: string, label: string) => void;
  onColorChange: (key: string, color: string) => void;
  onIconChange: (key: string, icon: string) => void;
  canDelete: boolean;
  isOver: boolean;
}) {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({ id: category.id });
  const { setNodeRef: setDropRef } = useDroppable({ id: category.id });

  function setRef(el: HTMLElement | null) {
    setDragRef(el);
    setDropRef(el);
  }

  const iconOptions = ICON_OPTIONS.map((o) => ({ value: o.name, label: o.name }));
  const colorOptions = COLOR_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

  return (
    <div
      ref={setRef}
      style={{ opacity: isDragging ? 0.35 : 1 }}
      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-colors ${
        isOver && !isDragging
          ? 'bg-white/[0.07] border-white/[0.15]'
          : 'bg-white/[0.03] border-white/[0.07]'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-0.5 cursor-grab active:cursor-grabbing text-white/25 hover:text-white/50 transition-colors shrink-0 touch-none"
      >
        <GripVertical size={14} />
      </button>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <Dropdown
          value={category.icon}
          onChange={(v) => onIconChange(category.key, v)}
          options={iconOptions}
          width="w-[118px]"
          renderOption={(o) => {
            const Icon = resolveIcon(o.value);
            return (
              <>
                <Icon size={13} className="shrink-0 text-white/60" />
                <span>{o.label}</span>
              </>
            );
          }}
          renderSelected={(o) => {
            if (!o) return null;
            const Icon = resolveIcon(o.value);
            return (
              <span className="flex items-center gap-1.5">
                <Icon size={12} className="shrink-0 text-white/60" />
                {o.label}
              </span>
            );
          }}
        />

        <input
          value={category.label}
          onChange={(e) => onLabelChange(category.key, e.target.value)}
          className="flex-1 min-w-0 bg-transparent border-b border-white/[0.10] focus:border-white/30 text-sm text-white focus:outline-none py-0.5 transition-colors"
          placeholder="Nome da categoria"
        />

        <Dropdown
          value={category.color}
          onChange={(v) => onColorChange(category.key, v)}
          options={colorOptions}
          width="w-[90px]"
          renderOption={(o) => (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${o.value}`}>{o.label}</span>
          )}
          renderSelected={(o) => o ? (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${o.value}`}>{o.label}</span>
          ) : null}
        />
      </div>

      <CategoryBadge category={category} />

      <button
        onClick={() => onDelete(category.key)}
        disabled={!canDelete}
        className="p-1 rounded-lg hover:bg-rose-500/10 text-white/25 hover:text-rose-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
        title={canDelete ? 'Remover categoria' : 'Pelo menos uma categoria é necessária'}
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export function CategoriesCard() {
  const {
    categories,
    loading,
    addCategory,
    deleteCategory,
    updateCategoryLabel,
    updateCategoryColor,
    updateCategoryIcon,
    reorderCategories,
    resetToDefaults,
  } = useLeadCategories();

  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0].value);
  const [newIcon, setNewIcon] = useState(ICON_OPTIONS[0].name);
  const [adding, setAdding] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [migrateTo, setMigrateTo] = useState('');
  const [overId, setOverId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = [...categories];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    reorderCategories(reordered);
  }

  async function handleAdd() {
    if (!newLabel.trim()) return;
    setAdding(true);
    await addCategory(newLabel.trim(), newColor, newIcon);
    setNewLabel('');
    setNewColor(COLOR_OPTIONS[0].value);
    setNewIcon(ICON_OPTIONS[0].name);
    setAdding(false);
    setShowAdd(false);
  }

  function requestDelete(key: string) {
    const others = categories.filter((c) => c.key !== key);
    if (others.length === 0) return;
    setDeleteTarget(key);
    setMigrateTo(others[0].key);
  }

  async function confirmDelete() {
    if (!deleteTarget || !migrateTo) return;
    setDeletingKey(deleteTarget);
    await deleteCategory(deleteTarget, migrateTo);
    setDeletingKey(null);
    setDeleteTarget(null);
  }

  async function handleReset() {
    if (!window.confirm('Restaurar as categorias padrão? Todas as categorias personalizadas serão removidas.')) return;
    setResetting(true);
    await resetToDefaults();
    setResetting(false);
  }

  const activeCategory = activeId ? categories.find((c) => c.id === activeId) : null;
  const iconOptions = ICON_OPTIONS.map((o) => ({ value: o.name, label: o.name }));
  const colorOptions = COLOR_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

  if (loading) {
    return (
      <Card>
        <div className="h-32 bg-white/[0.03] rounded-xl animate-pulse" />
      </Card>
    );
  }

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Categorias de leads</h2>
          <p className="text-xs text-white/40 mt-0.5">
            Personalize as categorias usadas para classificar seus leads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.07] transition-all disabled:opacity-50"
          >
            <RotateCcw size={12} />
            {resetting ? 'Restaurando...' : 'Padrão'}
          </button>
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-white/70 hover:text-white text-[11px] font-medium transition-all"
          >
            <Plus size={13} /> Nova categoria
          </button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <AnimatePresence initial={false}>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.05] border border-white/[0.10] mb-2">
                <Dropdown
                  value={newIcon}
                  onChange={setNewIcon}
                  options={iconOptions}
                  width="w-[118px]"
                  renderOption={(o) => {
                    const Icon = resolveIcon(o.value);
                    return (
                      <>
                        <Icon size={13} className="shrink-0 text-white/60" />
                        <span>{o.label}</span>
                      </>
                    );
                  }}
                  renderSelected={(o) => {
                    if (!o) return null;
                    const Icon = resolveIcon(o.value);
                    return (
                      <span className="flex items-center gap-1.5">
                        <Icon size={12} className="shrink-0 text-white/60" />
                        {o.label}
                      </span>
                    );
                  }}
                />
                <input
                  autoFocus
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setShowAdd(false); }}
                  placeholder="Nome da categoria"
                  className="flex-1 bg-transparent border-b border-white/[0.15] text-sm text-white focus:outline-none focus:border-white/30 py-0.5"
                />
                <Dropdown
                  value={newColor}
                  onChange={setNewColor}
                  options={colorOptions}
                  width="w-[90px]"
                  renderOption={(o) => (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${o.value}`}>{o.label}</span>
                  )}
                  renderSelected={(o) => o ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${o.value}`}>{o.label}</span>
                  ) : null}
                />
                <button
                  onClick={handleAdd}
                  disabled={adding || !newLabel.trim()}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.10] hover:bg-white/[0.18] text-white text-xs font-medium transition-all disabled:opacity-50"
                >
                  {adding ? 'Salvando...' : 'Adicionar'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(e) => setActiveId(String(e.active.id))}
          onDragOver={(e) => setOverId(e.over ? String(e.over.id) : null)}
          onDragEnd={handleDragEnd}
          onDragCancel={() => { setActiveId(null); setOverId(null); }}
        >
          <div className="space-y-1.5">
            {categories.map((cat) => (
              <DraggableRow
                key={cat.id}
                category={cat}
                onDelete={requestDelete}
                onLabelChange={updateCategoryLabel}
                onColorChange={updateCategoryColor}
                onIconChange={updateCategoryIcon}
                canDelete={categories.length > 1 && deletingKey !== cat.key}
                isOver={overId === cat.id}
              />
            ))}
          </div>
          <DragOverlay>
            {activeCategory && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.12] border border-white/[0.20] shadow-xl">
                <GripVertical size={14} className="text-white/50 shrink-0" />
                <CategoryBadge category={activeCategory} />
                <span className="text-sm text-white truncate">{activeCategory.label}</span>
              </div>
            )}
          </DragOverlay>
        </DndContext>

        <AnimatePresence>
          {deleteTarget && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20"
            >
              <p className="text-xs text-white/70 mb-2">
                Leads nesta categoria serão movidos para:
              </p>
              <div className="flex items-center gap-2">
                <Dropdown
                  value={migrateTo}
                  onChange={setMigrateTo}
                  options={categories
                    .filter((c) => c.key !== deleteTarget)
                    .map((c) => ({ value: c.key, label: c.label }))}
                  width="flex-1"
                />
                <button
                  onClick={confirmDelete}
                  disabled={!!deletingKey}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-medium transition-all disabled:opacity-50"
                >
                  {deletingKey ? 'Removendo...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-white/60 text-xs font-medium transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
