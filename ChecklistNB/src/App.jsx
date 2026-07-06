import React, { useState, useMemo, useEffect } from 'react';
import {
  Rocket, Shirt, Droplet, Milk, Moon, Stethoscope, Backpack,
  Wallet, FileText, User, ChevronDown, ChevronUp, CheckCircle2,
  Circle, RotateCcw, Plus, Trash2, AlertTriangle, Star, Cloud
} from 'lucide-react';

let uid = 1000;
const nextId = () => (uid++).toString();

const makeItems = (arr) =>
  arr.map(([name, qty]) => ({ id: nextId(), name, qty, price: 0, checked: false }));

const INIT_SECTIONS = [
  {
    id: 'clothes', title: 'Quan ao so sinh', icon: Shirt, budget: 3000000,
    note: 'Goi y hang: Nous, Uala Rogo, Lullaby',
    items: makeItems([
      ['Bo dai tay mong (phong dieu hoa)', 5],
      ['Bo coc tay cotton', 5],
      ['Body coc tay', 5],
      ['Body dai tay mong', 3],
      ['Mu so sinh', 2],
      ['Bao tay', 3],
      ['Bao chan', 3],
    ]),
  },
  {
    id: 'fabric', title: 'Khan va do vai', icon: Droplet, budget: 1500000,
    note: "Goi y hang: Uala Rogo, Mama's Choice, Aden + Anais",
    items: makeItems([
      ['Khan sua', 20],
      ['Khan mat', 5],
      ['Khan tam xo', 3],
      ['Chan muslin', 2],
      ['Tam lot chong tham', 2],
      ['Khan quan be', 2],
    ]),
  },
  {
    id: 'diaper', title: 'Bim va khan uot', icon: Rocket, budget: 2000000,
    items: makeItems([
      ['Thung bim so sinh Moony Natural NB', 2],
      ['Goi khan uot Mamamy', 6],
    ]),
  },
  {
    id: 'bath', title: 'Tam & cham soc be', icon: Droplet, budget: 1000000,
    items: makeItems([
      ['Sua tam goi Cetaphil Baby', 1],
      ['Kem chong ham Bepanthen', 1],
      ['Nuoc muoi sinh ly', 1],
      ['Tam bong so sinh', 1],
      ['Bo bam mong tre em', 1],
      ['Ban chai ngon tay silicone', 1],
    ]),
  },
  {
    id: 'milk', title: 'Binh sua & hut sua', icon: Milk, budget: 7000000,
    items: makeItems([
      ['Binh Pigeon PPSU 160ml', 2],
      ['Num ti so sinh SS', 2],
      ['May hut sua Spectra Dual Compact', 1],
      ['Tui tru sua', 1],
    ]),
  },
  {
    id: 'sleep', title: 'Do ngu nghi', icon: Moon, budget: 4000000,
    note: 'Neu cho con ngu cung bo me co the mua sau',
    items: makeItems([
      ['Goi chong trao nguoc', 1],
      ['Chan dap mong', 1],
      ['Noi hoac cui', 1],
    ]),
  },
  {
    id: 'medical', title: 'Do y te tai nha', icon: Stethoscope, budget: 1000000,
    items: makeItems([
      ['Nhiet ke Omron', 1],
      ['May hut mui Pigeon', 1],
      ['Gel ha sot', 1],
      ['Nuoc muoi nho mui', 1],
    ]),
  },
  {
    id: 'bagBaby', title: 'Tui di sinh cho be', icon: Backpack, budget: 1500000,
    note: 'Chuan bi tu tuan 34-35 (neu tai dung do da mua, de gia = 0)',
    items: makeItems([
      ['Bo quan ao so sinh', 5],
      ['Khan sua', 10],
      ['Khan tam', 1],
      ['Khan quan', 1],
      ['Bich bim NB', 1],
      ['Goi khan uot', 1],
      ['Mu so sinh', 1],
      ['Bao tay', 2],
      ['Bao chan', 2],
    ]),
  },
  {
    id: 'momDocs', title: 'Tui me - Ho so giay to', icon: FileText, budget: 0,
    items: makeItems([
      ['CCCD', 1],
      ['The BHYT', 1],
      ['Ho so thai san', 1],
      ['Ket qua xet nghiem gan nhat', 1],
    ]),
  },
  {
    id: 'momItems', title: 'Tui me - Do dung ca nhan', icon: User, budget: 2000000,
    items: makeItems([
      ['Bo do cho con bu', 3],
      ['Ao nguc cho con bu', 2],
      ['Quan lot giay Caryn', 1],
      ['Bang ve sinh sau sinh', 1],
      ['Khan mat', 1],
      ['Khan tam', 1],
      ['Dep di trong vien', 1],
      ['Binh giu nhiet', 1],
      ['Sac dien thoai', 1],
    ]),
  },
];

const INIT_OTHER_COSTS = [
  { id: nextId(), name: 'Sinh mo BVPSHN B3', planned: 47500000, actual: 0 },
  { id: nextId(), name: 'Vinest 7 ngay', planned: 28000000, actual: 0 },
  { id: nextId(), name: 'Quy phat sinh', planned: 5000000, actual: 0 },
];

const STORAGE_KEY = 'baby-boy-checklist-budget-v1';

const fmt = (n) => (Number(n) || 0).toLocaleString('vi-VN') + ' d';

export default function App() {
  const [sections, setSections] = useState(INIT_SECTIONS);
  const [otherCosts, setOtherCosts] = useState(INIT_OTHER_COSTS);
  const [open, setOpen] = useState(() => {
    const o = {};
    INIT_SECTIONS.forEach(s => (o[s.id] = true));
    return o;
  });
  const [tab, setTab] = useState('checklist');
  const [newItemDrafts, setNewItemDrafts] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sections) setSections(parsed.sections);
        if (parsed.otherCosts) setOtherCosts(parsed.otherCosts);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sections, otherCosts }));
    } catch (e) {}
  }, [sections, otherCosts]);

  const sectionActual = (section) =>
    section.items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0), 0);

  const sectionDone = (section) => section.items.filter(it => it.checked).length;

  const totalShoppingPlanned = useMemo(
    () => sections.reduce((s, sec) => s + (Number(sec.budget) || 0), 0),
    [sections]
  );
  const totalShoppingActual = useMemo(
    () => sections.reduce((s, sec) => s + sectionActual(sec), 0),
    [sections]
  );

  const totalOtherPlanned = useMemo(
    () => otherCosts.reduce((s, c) => s + (Number(c.planned) || 0), 0),
    [otherCosts]
  );
  const totalOtherActual = useMemo(
    () => otherCosts.reduce((s, c) => s + (Number(c.actual) || 0), 0),
    [otherCosts]
  );

  const grandPlanned = totalShoppingPlanned + totalOtherPlanned;
  const grandActual = totalShoppingActual + totalOtherActual;

  const totalItemsCount = sections.reduce((s, sec) => s + sec.items.length, 0);
  const totalCheckedCount = sections.reduce((s, sec) => s + sectionDone(sec), 0);
  const overallPercent = totalItemsCount ? Math.round((totalCheckedCount / totalItemsCount) * 100) : 0;

  const updateItem = (sectionId, itemId, field, value) => {
    setSections(prev =>
      prev.map(sec =>
        sec.id !== sectionId
          ? sec
          : {
              ...sec,
              items: sec.items.map(it =>
                it.id !== itemId ? it : { ...it, [field]: value }
              ),
            }
      )
    );
  };

  const toggleItemChecked = (sectionId, itemId) => {
    setSections(prev =>
      prev.map(sec =>
        sec.id !== sectionId
          ? sec
          : {
              ...sec,
              items: sec.items.map(it =>
                it.id !== itemId ? it : { ...it, checked: !it.checked }
              ),
            }
      )
    );
  };

  const deleteItem = (sectionId, itemId) => {
    setSections(prev =>
      prev.map(sec =>
        sec.id !== sectionId
          ? sec
          : { ...sec, items: sec.items.filter(it => it.id !== itemId) }
      )
    );
  };

  const addItem = (sectionId) => {
    const draft = newItemDrafts[sectionId];
    if (!draft || !draft.name || !draft.name.trim()) return;
    const newIt = {
      id: nextId(),
      name: draft.name.trim(),
      qty: Number(draft.qty) || 1,
      price: Number(draft.price) || 0,
      checked: false,
    };
    setSections(prev =>
      prev.map(sec =>
        sec.id !== sectionId ? sec : { ...sec, items: [...sec.items, newIt] }
      )
    );
    setNewItemDrafts(prev => ({ ...prev, [sectionId]: { name: '', qty: 1, price: 0 } }));
  };

  const updateDraft = (sectionId, field, value) => {
    setNewItemDrafts(prev => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || { name: '', qty: 1, price: 0 }), [field]: value },
    }));
  };

  const updateSectionBudget = (sectionId, value) => {
    setSections(prev =>
      prev.map(sec => (sec.id !== sectionId ? sec : { ...sec, budget: Number(value) || 0 }))
    );
  };

  const updateOtherCost = (id, field, value) => {
    setOtherCosts(prev =>
      prev.map(c => (c.id !== id ? c : { ...c, [field]: Number(value) || 0 }))
    );
  };

  const toggleSection = (id) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  const resetAll = () => {
    if (window.confirm('Bo tick + xoa so lieu da nhap? (khong the hoan tac)')) {
      setSections(INIT_SECTIONS.map(s => ({ ...s, items: s.items.map(it => ({ ...it, price: 0, checked: false })) })));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-blue-700 flex items-center justify-center gap-2">
            <Rocket className="w-6 h-6" />
            Chuan Bi Don Be Trai Thang 8
            <Star className="w-5 h-5 text-yellow-400" />
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            <Cloud className="w-4 h-4 text-sky-400" />
            BV Phu San Ha Noi - Sinh mo
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('checklist')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm ${tab === 'checklist' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-blue-200'}`}
          >
            Checklist
          </button>
          <button
            onClick={() => setTab('budget')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm ${tab === 'budget' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-blue-200'}`}
          >
            Ngan sach
          </button>
        </div>

        {tab === 'checklist' && (
          <>
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Da mua: {totalCheckedCount}/{totalItemsCount} mon
                </span>
                <span className="text-sm font-bold text-blue-600">{overallPercent}%</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-3 mb-3">
                <div className="bg-blue-500 h-3 rounded-full transition-all" style={{ width: `${overallPercent}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Chi tieu thuc te (mua sam)</span>
                <span className={`font-bold ${totalShoppingActual > totalShoppingPlanned ? 'text-red-600' : 'text-gray-800'}`}>
                  {fmt(totalShoppingActual)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Ngan sach ke hoach</span>
                <span>{fmt(totalShoppingPlanned)}</span>
              </div>
              {totalShoppingActual > totalShoppingPlanned && (
                <div className="mt-2 flex items-center gap-1 text-red-600 text-xs font-medium bg-red-50 p-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  Vuot ngan sach mua sam {fmt(totalShoppingActual - totalShoppingPlanned)}!
                </div>
              )}
              <button onClick={resetAll} className="mt-3 text-xs text-gray-400 flex items-center gap-1 hover:text-blue-500">
                <RotateCcw className="w-3 h-3" />
                Dat lai gia & tick
              </button>
            </div>

            <div className="space-y-3">
              {sections.map((section) => {
                const Icon = section.icon;
                const actual = sectionActual(section);
                const done = sectionDone(section);
                const total = section.items.length;
                const over = section.budget > 0 && actual > section.budget;
                const isOpen = open[section.id];
                const draft = newItemDrafts[section.id] || { name: '', qty: 1, price: 0 };

                return (
                  <div key={section.id} className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
                    <button onClick={() => toggleSection(section.id)} className="w-full flex items-center justify-between p-3">
                      <div className="flex items-center gap-2 text-left">
                        <Icon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{section.title}</p>
                          <p className={`text-xs ${over ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                            {done}/{total} mon - {fmt(actual)}
                            {over && ' !'}
                          </p>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="px-3 pb-3">
                        {section.note && <p className="text-xs text-blue-400 italic mb-2">{section.note}</p>}

                        <div className="space-y-2">
                          {section.items.map((item) => {
                            const lineTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
                            return (
                              <div key={item.id} className="flex items-center gap-2 bg-blue-50/50 rounded-lg p-2">
                                <button onClick={() => toggleItemChecked(section.id, item.id)} className="flex-shrink-0">
                                  {item.checked ? <CheckCircle2 className="w-4 h-4 text-blue-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
                                </button>
                                <span className={`flex-1 text-sm min-w-0 truncate ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                  {item.name}
                                </span>
                                <input
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => updateItem(section.id, item.id, 'qty', e.target.value)}
                                  className="w-12 text-xs text-center border border-blue-200 rounded px-1 py-1"
                                  min="0"
                                />
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => updateItem(section.id, item.id, 'price', e.target.value)}
                                  placeholder="Gia"
                                  className="w-20 text-xs text-right border border-blue-200 rounded px-1 py-1"
                                  min="0"
                                />
                                <span className="text-xs text-gray-500 w-16 text-right flex-shrink-0">{fmt(lineTotal)}</span>
                                <button onClick={() => deleteItem(section.id, item.id)} className="flex-shrink-0 text-gray-300 hover:text-red-500">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-blue-100">
                          <input
                            type="text"
                            value={draft.name}
                            onChange={(e) => updateDraft(section.id, 'name', e.target.value)}
                            placeholder="+ Them mon do..."
                            className="flex-1 min-w-0 text-sm border border-blue-200 rounded px-2 py-1"
                          />
                          <input
                            type="number"
                            value={draft.qty}
                            onChange={(e) => updateDraft(section.id, 'qty', e.target.value)}
                            className="w-12 text-xs text-center border border-blue-200 rounded px-1 py-1"
                            placeholder="SL"
                          />
                          <button onClick={() => addItem(section.id)} className="flex-shrink-0 bg-blue-500 text-white rounded-lg p-1.5 hover:bg-blue-600">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'budget' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <h2 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-500" />
                Ngan sach theo tung nhom mua sam
              </h2>
              <div className="space-y-2">
                {sections.map((sec) => {
                  const actual = sectionActual(sec);
                  const over = sec.budget > 0 && actual > sec.budget;
                  const pct = sec.budget > 0 ? Math.min(200, Math.round((actual / sec.budget) * 100)) : 0;
                  return (
                    <div key={sec.id} className="border-b border-blue-50 pb-2">
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-gray-700">{sec.title}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400">Du kien:</span>
                          <input
                            type="number"
                            value={sec.budget}
                            onChange={(e) => updateSectionBudget(sec.id, e.target.value)}
                            className="w-24 text-xs text-right border border-blue-200 rounded px-1 py-0.5"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className={over ? 'text-red-500 font-medium flex items-center gap-1' : 'text-gray-500'}>
                          {over && <AlertTriangle className="w-3 h-3" />}
                          Thuc te: {fmt(actual)}
                        </span>
                        <span className={over ? 'text-red-500 font-semibold' : 'text-gray-400'}>{pct}%</span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${over ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t-2 border-blue-200">
                <span className="font-semibold text-sm text-gray-800">Tong mua sam</span>
                <div className="text-right">
                  <p className={`font-bold text-sm ${totalShoppingActual > totalShoppingPlanned ? 'text-red-600' : 'text-blue-600'}`}>
                    {fmt(totalShoppingActual)}
                  </p>
                  <p className="text-xs text-gray-400">/ {fmt(totalShoppingPlanned)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <h2 className="font-semibold text-sm text-gray-800 mb-3 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-500" />
                Chi phi khac (vien phi, o cu...)
              </h2>
              {otherCosts.map((c) => {
                const over = c.planned > 0 && c.actual > c.planned;
                return (
                  <div key={c.id} className="flex items-center gap-2 py-1.5 border-b border-blue-50 text-sm">
                    <span className="flex-1 text-gray-700">{c.name}</span>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Du kien</p>
                      <input
                        type="number"
                        value={c.planned}
                        onChange={(e) => updateOtherCost(c.id, 'planned', e.target.value)}
                        className="w-24 text-xs text-right border border-blue-200 rounded px-1 py-0.5"
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Thuc te</p>
                      <input
                        type="number"
                        value={c.actual}
                        onChange={(e) => updateOtherCost(c.id, 'actual', e.target.value)}
                        className={`w-24 text-xs text-right border rounded px-1 py-0.5 ${over ? 'border-red-400 text-red-600' : 'border-blue-200'}`}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between items-center mt-3 pt-2 border-t-2 border-blue-200 text-sm">
                <span className="font-semibold text-gray-800">Tong chi phi khac</span>
                <span className={`font-bold ${totalOtherActual > totalOtherPlanned ? 'text-red-600' : 'text-blue-600'}`}>
                  {fmt(totalOtherActual)} / {fmt(totalOtherPlanned)}
                </span>
              </div>
            </div>

            <div className={`rounded-xl p-4 shadow-sm border-2 ${grandActual > grandPlanned ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-white'}`}>
              <h2 className="font-semibold text-sm text-gray-800 mb-2">Tong ngan sach toan bo ke hoach</h2>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Du kien</span>
                <span className="font-medium text-gray-800">{fmt(grandPlanned)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Thuc te</span>
                <span className={`font-bold ${grandActual > grandPlanned ? 'text-red-600' : 'text-gray-800'}`}>{fmt(grandActual)}</span>
              </div>
              {grandActual > grandPlanned ? (
                <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  Vuot tong ngan sach {fmt(grandActual - grandPlanned)}!
                </div>
              ) : (
                <div className="text-green-600 text-sm font-medium">
                  Con du {fmt(grandPlanned - grandActual)} so voi ke hoach
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
