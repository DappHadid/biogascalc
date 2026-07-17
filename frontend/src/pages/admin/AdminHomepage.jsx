import { useState, useEffect, useRef } from "react";
import {
  Home,
  Workflow,
  HelpCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Upload,
  ImageIcon,
  X,
  Loader2,
  GripVertical,
} from "lucide-react";
import api from "../../api/axios";
import { toast } from "sonner";

const TABS = [
  { id: "how-it-works", label: "Cara Kerja", icon: Workflow },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

const FAQ_CATEGORIES = ["Umum", "Teknis & Fitur", "Langkah Selanjutnya"];

export default function AdminHomepage() {
  const [activeTab, setActiveTab] = useState("how-it-works");

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <h1
            className="admin-dashboard__title"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            Kelola Beranda
          </h1>
          <p className="admin-dashboard__subtitle">
            Atur konten halaman Beranda secara dinamis
          </p>
        </div>
      </div>

      <div className="ahp-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`ahp-tabs__btn ${activeTab === tab.id ? "ahp-tabs__btn--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "how-it-works" && <HowItWorksManager />}
      {activeTab === "faq" && <FaqManager />}
    </div>
  );
}

function HowItWorksManager() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/homepage/how-it-works");
      setSteps(
        data.data.map((s) => ({
          stepNumber: s.stepNumber,
          title: s.title,
          description: s.description,
          imageUrl: s.imageUrl || "",
          sortOrder: s.sortOrder,
        }))
      );
    } catch (err) {
      toast.error("Gagal mengambil data Cara Kerja");
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => {
    const nextNum = String(steps.length + 1).padStart(2, "0");
    setSteps([
      ...steps,
      {
        stepNumber: nextNum,
        title: "",
        description: "",
        imageUrl: "",
        sortOrder: steps.length,
      },
    ]);
  };

  const removeStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    updated.forEach((s, i) => {
      s.stepNumber = String(i + 1).padStart(2, "0");
      s.sortOrder = i;
    });
    setSteps([...updated]);
  };

  const moveStep = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= steps.length) return;
    const updated = [...steps];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated.forEach((s, i) => {
      s.stepNumber = String(i + 1).padStart(2, "0");
      s.sortOrder = i;
    });
    setSteps(updated);
  };

  const updateField = (index, field, value) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleImageUpload = async (index, file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post("/homepage/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      updateField(index, "imageUrl", data.imageUrl);
      toast.success("Gambar berhasil diunggah");
    } catch (err) {
      toast.error("Gagal mengunggah gambar");
    }
  };

  const removeImage = async (index) => {
    const imageUrl = steps[index].imageUrl;
    if (imageUrl) {
      try {
        const token = localStorage.getItem("token");
        await api.delete("/homepage/delete-image", {
          data: { imageUrl },
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
      }
    }
    updateField(index, "imageUrl", "");
  };

  const handleSave = async () => {
    for (const step of steps) {
      if (!step.title.trim() || !step.description.trim()) {
        toast.error("Judul dan deskripsi setiap langkah wajib diisi.");
        return;
      }
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      await api.put(
        "/homepage/how-it-works",
        { steps },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Langkah Cara Kerja berhasil disimpan!");
      fetchSteps();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="ahp-loading">
        <div className="admin-spinner" />
        <span>Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="ahp-section">
      <div className="ahp-section__header">
        <div>
          <h2 className="ahp-section__title">Langkah-Langkah Cara Kerja</h2>
          <p className="ahp-section__desc">
            Kelola langkah-langkah yang ditampilkan di section "Cara Kerja" pada Beranda.
          </p>
        </div>
        <button className="ahp-btn ahp-btn--primary" onClick={addStep}>
          <Plus size={16} />
          Tambah Langkah
        </button>
      </div>

      <div className="ahp-cards">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            step={step}
            index={index}
            total={steps.length}
            onUpdate={(field, value) => updateField(index, field, value)}
            onRemove={() => removeStep(index)}
            onMove={(dir) => moveStep(index, dir)}
            onImageUpload={(file) => handleImageUpload(index, file)}
            onImageRemove={() => removeImage(index)}
          />
        ))}
      </div>

      {steps.length === 0 && (
        <div className="ahp-empty">
          <Workflow size={48} strokeWidth={1} />
          <p>Belum ada langkah. Klik "Tambah Langkah" untuk memulai.</p>
        </div>
      )}

      <div className="ahp-actions">
        <button
          className="ahp-btn ahp-btn--save"
          onClick={handleSave}
          disabled={saving || steps.length === 0}
        >
          {saving ? <Loader2 size={16} className="ahp-spin" /> : <Save size={16} />}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}

function StepCard({ step, index, total, onUpdate, onRemove, onMove, onImageUpload, onImageRemove }) {
  const fileRef = useRef(null);

  return (
    <div className="ahp-step-card">
      <div className="ahp-step-card__header">
        <div className="ahp-step-card__badge">
          <GripVertical size={14} />
          LANGKAH {step.stepNumber}
        </div>
        <div className="ahp-step-card__actions">
          <button
            className="ahp-icon-btn"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Pindah ke atas"
          >
            <ArrowUp size={14} />
          </button>
          <button
            className="ahp-icon-btn"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Pindah ke bawah"
          >
            <ArrowDown size={14} />
          </button>
          <button
            className="ahp-icon-btn ahp-icon-btn--danger"
            onClick={onRemove}
            title="Hapus langkah"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="ahp-step-card__body">
        <div className="ahp-field">
          <label className="ahp-label">Judul</label>
          <input
            className="ahp-input"
            type="text"
            placeholder="Masukkan judul langkah..."
            value={step.title}
            onChange={(e) => onUpdate("title", e.target.value)}
            maxLength={150}
          />
        </div>

        <div className="ahp-field">
          <label className="ahp-label">Deskripsi</label>
          <textarea
            className="ahp-textarea"
            placeholder="Masukkan deskripsi langkah..."
            value={step.description}
            onChange={(e) => onUpdate("description", e.target.value)}
            rows={3}
          />
        </div>

        <div className="ahp-field">
          <label className="ahp-label">Gambar (Opsional)</label>
          {step.imageUrl ? (
            <div className="ahp-image-preview">
              <img src={step.imageUrl} alt={`Step ${step.stepNumber}`} />
              <button className="ahp-image-preview__remove" onClick={onImageRemove}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              className="ahp-image-upload"
              onClick={() => fileRef.current?.click()}
            >
              <ImageIcon size={24} strokeWidth={1.5} />
              <span>Klik untuk unggah gambar</span>
              <span className="ahp-image-upload__hint">JPG, PNG, WebP, SVG — Maks 5MB</span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onImageUpload(e.target.files[0]);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

function FaqManager() {
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Umum");

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/homepage/faq");
      const flat = [];
      for (const group of data.data) {
        for (const item of group.items) {
          flat.push({
            category: group.category,
            question: item.q,
            answer: item.a,
            sortOrder: item.sortOrder,
          });
        }
      }
      setFaqItems(flat);
    } catch (err) {
      toast.error("Gagal mengambil data FAQ");
    } finally {
      setLoading(false);
    }
  };

  const totalCount = faqItems.length;

  const addFaqItem = () => {
    if (totalCount >= 5) {
      toast.error("Maksimal 5 FAQ secara keseluruhan.");
      return;
    }
    const catItems = faqItems.filter((f) => f.category === activeCategory);
    setFaqItems([
      ...faqItems,
      {
        category: activeCategory,
        question: "",
        answer: "",
        sortOrder: catItems.length,
      },
    ]);
  };

  const removeFaqItem = (globalIndex) => {
    setFaqItems(faqItems.filter((_, i) => i !== globalIndex));
  };

  const updateFaqField = (globalIndex, field, value) => {
    const updated = [...faqItems];
    updated[globalIndex] = { ...updated[globalIndex], [field]: value };
    setFaqItems(updated);
  };

  const moveFaqItem = (globalIndex, direction) => {
    const item = faqItems[globalIndex];
    const categoryItems = faqItems
      .map((f, i) => ({ ...f, _gi: i }))
      .filter((f) => f.category === item.category);

    const catIdx = categoryItems.findIndex((f) => f._gi === globalIndex);
    const newCatIdx = catIdx + direction;
    if (newCatIdx < 0 || newCatIdx >= categoryItems.length) return;

    const swapGlobalIdx = categoryItems[newCatIdx]._gi;
    const updated = [...faqItems];
    [updated[globalIndex], updated[swapGlobalIdx]] = [
      updated[swapGlobalIdx],
      updated[globalIndex],
    ];
    setFaqItems(updated);
  };

  const handleSave = async () => {
    for (const item of faqItems) {
      if (!item.question.trim() || !item.answer.trim()) {
        toast.error("Pertanyaan dan jawaban setiap FAQ wajib diisi.");
        return;
      }
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const items = faqItems.map((item, i) => ({
        ...item,
        sortOrder: i,
      }));
      await api.put(
        "/homepage/faq",
        { items },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("FAQ berhasil disimpan!");
      fetchFaq();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  const currentCatItems = faqItems
    .map((f, i) => ({ ...f, _globalIndex: i }))
    .filter((f) => f.category === activeCategory);

  if (loading) {
    return (
      <div className="ahp-loading">
        <div className="admin-spinner" />
        <span>Memuat data...</span>
      </div>
    );
  }

  return (
    <div className="ahp-section">
      <div className="ahp-section__header">
        <div>
          <h2 className="ahp-section__title">Pertanyaan yang Sering Diajukan</h2>
          <p className="ahp-section__desc">
            Kelola FAQ di Beranda. Maksimal <strong>5 FAQ</strong> secara keseluruhan.
          </p>
        </div>
        <div className="ahp-faq-counter">
          <span
            className={`ahp-faq-counter__badge ${totalCount >= 5 ? "ahp-faq-counter__badge--full" : ""}`}
          >
            {totalCount} / 5
          </span>
        </div>
      </div>

      <div className="ahp-cat-tabs">
        {FAQ_CATEGORIES.map((cat) => {
          const count = faqItems.filter((f) => f.category === cat).length;
          return (
            <button
              key={cat}
              className={`ahp-cat-tabs__btn ${activeCategory === cat ? "ahp-cat-tabs__btn--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {count > 0 && <span className="ahp-cat-tabs__count">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="ahp-cards">
        {currentCatItems.map((item, catIdx) => (
          <div key={item._globalIndex} className="ahp-faq-card">
            <div className="ahp-faq-card__header">
              <div className="ahp-step-card__badge">
                <HelpCircle size={14} />
                FAQ #{catIdx + 1}
              </div>
              <div className="ahp-step-card__actions">
                <button
                  className="ahp-icon-btn"
                  onClick={() => moveFaqItem(item._globalIndex, -1)}
                  disabled={catIdx === 0}
                  title="Pindah ke atas"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  className="ahp-icon-btn"
                  onClick={() => moveFaqItem(item._globalIndex, 1)}
                  disabled={catIdx === currentCatItems.length - 1}
                  title="Pindah ke bawah"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  className="ahp-icon-btn ahp-icon-btn--danger"
                  onClick={() => removeFaqItem(item._globalIndex)}
                  title="Hapus FAQ"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="ahp-faq-card__body">
              <div className="ahp-field">
                <label className="ahp-label">Pertanyaan</label>
                <input
                  className="ahp-input"
                  type="text"
                  placeholder="Masukkan pertanyaan..."
                  value={item.question}
                  onChange={(e) =>
                    updateFaqField(item._globalIndex, "question", e.target.value)
                  }
                  maxLength={500}
                />
              </div>
              <div className="ahp-field">
                <label className="ahp-label">Jawaban</label>
                <textarea
                  className="ahp-textarea"
                  placeholder="Masukkan jawaban..."
                  value={item.answer}
                  onChange={(e) =>
                    updateFaqField(item._globalIndex, "answer", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentCatItems.length === 0 && (
        <div className="ahp-empty">
          <HelpCircle size={48} strokeWidth={1} />
          <p>Belum ada FAQ di kategori "{activeCategory}".</p>
        </div>
      )}

      <div className="ahp-actions" style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="ahp-btn ahp-btn--primary"
          onClick={addFaqItem}
          disabled={totalCount >= 5}
        >
          <Plus size={16} />
          Tambah FAQ ke "{activeCategory}"
        </button>
        <button
          className="ahp-btn ahp-btn--save"
          onClick={handleSave}
          disabled={saving || totalCount === 0}
        >
          {saving ? <Loader2 size={16} className="ahp-spin" /> : <Save size={16} />}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
