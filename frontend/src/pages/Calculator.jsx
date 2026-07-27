import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Leaf, 
  Scale, 
  Droplets, 
  Flame, 
  Zap, 
  Container, 
  Beaker, 
  Sprout, 
  Wind,
  Calculator as CalcIcon,
  RefreshCw,
  ChevronDown
} from "lucide-react";

const substrates = [
  { id: "cow_manure", name: "Kotoran Sapi", yieldFactor: 0.04 },
  { id: "poultry_manure", name: "Kotoran Ayam", yieldFactor: 0.065 },
  { id: "pig_manure", name: "Kotoran Babi", yieldFactor: 0.05 },
  { id: "food_waste", name: "Sisa Makanan", yieldFactor: 0.15 },
  { id: "agricultural_waste", name: "Limbah Pertanian", yieldFactor: 0.08 },
];

export default function Calculator() {
  const [formData, setFormData] = useState({
    substrate: "cow_manure",
    quantity: "",
    dryMatter: "",
  });

  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    setIsCalculating(true);
    
    setTimeout(() => {
      const quantity = parseFloat(formData.quantity) || 0;
      const dryMatter = parseFloat(formData.dryMatter) || 0;
      const selectedSubstrate = substrates.find(s => s.id === formData.substrate);
      
      const effectiveYield = selectedSubstrate ? selectedSubstrate.yieldFactor : 0.04;
      const gasOutput = quantity * (dryMatter / 100) * effectiveYield * 100; 
      
      const calcResults = [
        { id: "gas", value: gasOutput.toFixed(2), unit: "m³", label: "Gas Output", icon: Flame, color: "text-orange-600", bg: "bg-orange-50", borderColor: "border-orange-100" },
        { id: "electricity", value: (gasOutput * 1.5).toFixed(2), unit: "kWh", label: "Electricity", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50", borderColor: "border-yellow-100" },
        { id: "lpg", value: (gasOutput * 0.46).toFixed(2), unit: "kg", label: "LPG Equivalent", icon: Container, color: "text-sky-600", bg: "bg-sky-50", borderColor: "border-sky-100" },
        { id: "slurry", value: (quantity * 0.85).toFixed(2), unit: "kg", label: "Slurry Output", icon: Beaker, color: "text-indigo-600", bg: "bg-indigo-50", borderColor: "border-indigo-100" },
        { id: "fertilizer", value: (quantity * 0.15).toFixed(2), unit: "kg", label: "Bio Fertilizer", icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-50", borderColor: "border-emerald-100" },
        { id: "co2", value: (gasOutput * 2.5).toFixed(2), unit: "kg", label: "CO₂ Reduction", icon: Wind, color: "text-teal-600", bg: "bg-teal-50", borderColor: "border-teal-100" },
      ];

      setResults(calcResults);
      setIsCalculating(false);
    }, 600);
  };

  const resetCalculator = () => {
    setFormData({
      substrate: "cow_manure",
      quantity: "",
      dryMatter: "",
    });
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-32 pb-16 px-4 sm:px-6 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Background ambient pattern/gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-start overflow-hidden opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-teal-50 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 relative">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm text-xs font-semibold text-gray-500"
          >
            <CalcIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Biogas Calculator Engine</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
          >
            Kalkulasi <span className="text-emerald-600">Potensi Energi</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed"
          >
            Sistem prediksi untuk mengonversi data kuantitas limbah organik Anda menjadi analisis estimasi output energi dan dampak lingkungan secara presisi.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 bg-white shadow-sm border border-gray-200 rounded-2xl p-7 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            
            <div className="mb-6">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Parameter Input</h2>
              <p className="text-xs text-gray-500 mt-1">Lengkapi data limbah Anda</p>
            </div>
            
            <form onSubmit={handleCalculate} className="space-y-6 flex-1 flex flex-col relative z-10">
              <div className="space-y-5">
                
                {/* Substrate */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Jenis Substrat
                  </label>
                  <div className="relative">
                    <select
                      name="substrate"
                      value={formData.substrate}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer font-medium"
                      required
                    >
                      {substrates.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" /> Kuantitas (kg)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                    required
                  />
                </div>

                {/* Dry Matter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-emerald-600" /> Kadar Kering (%)
                  </label>
                  <input
                    type="number"
                    name="dryMatter"
                    value={formData.dryMatter}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0.0"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto pt-8 flex gap-3">
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-sm shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Jalankan Kalkulasi"
                  )}
                </button>
                {results && (
                  <button
                    type="button"
                    onClick={resetCalculator}
                    className="p-3 bg-white hover:bg-gray-50 text-gray-600 rounded-xl transition-all border border-gray-200 shadow-sm active:scale-[0.98]"
                    title="Reset Form"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {!results && !isCalculating ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-gray-50/50"
                >
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 border border-gray-100">
                    <CalcIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-gray-700 font-bold mb-2">Menunggu Input</h3>
                  <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                    Masukkan parameter limbah Anda di panel sebelah kiri untuk memproses dan melihat hasil analisis potensi energi.
                  </p>
                </motion.div>
              ) : isCalculating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] border border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-white shadow-sm"
                >
                  <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                  <p className="text-gray-500 text-sm font-semibold tracking-wide animate-pulse">Menghitung formulasi...</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {results.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative bg-white border ${item.borderColor} hover:shadow-md hover:-translate-y-0.5 rounded-2xl p-5 overflow-hidden transition-all duration-300 flex flex-col`}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className={`p-2.5 rounded-xl ${item.bg}`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                          </div>
                        </div>
                        
                        <div className="space-y-1.5 mt-auto">
                          <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">{item.label}</div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-black text-gray-900 tracking-tight">
                              {item.value}
                            </span>
                            <span className="text-gray-500 text-sm font-semibold">
                              {item.unit}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary/Info box */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-3"
                  >
                    <div className="mt-0.5 p-1 rounded-full bg-white shadow-sm border border-emerald-100">
                      <Wind className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed font-medium">
                      Berdasarkan <span className="text-emerald-700 font-bold">{formData.quantity}kg {substrates.find(s => s.id === formData.substrate)?.name}</span>. Kalkulasi ini merupakan estimasi teoretis; hasil aktual lapangan dapat berbeda sesuai efisiensi digester dan temperatur.
                    </div>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}


