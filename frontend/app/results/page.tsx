// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
//   PieChart, Pie, Cell,
//   LineChart, Line
// } from 'recharts';
// import Select from 'react-select';
// import AnalyticsSection from "./AnalyticsSection";
// import GlobalAnalyticsSection from "./GlobalAnalyticsSection";

// // Type definitions for react-select and data
// interface OptionType {
//   value: string;
//   label: string;
// }

// // Define types for all data arrays
// interface FeatureSummary {
//   feature: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
//   Brand?: string;
// }
// interface OverallSummary {
//   sentiment: string;
//   count: number;
//   'Product Name': string;
//   Month?: string;
//   Brand?: string;
// }
// interface BrandSummary {
//   Brand: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface ProductSummary {
//   'Product Name': string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   Month?: string;
//   Brand?: string;
// }
// interface RatingSummary {
//   Rating: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface PlatformSummary {
//   Platform: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface GenderSummary {
//   Gender: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface VerifiedSummary {
//   'Verified Purchase': string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface AgeSummary {
//   Age: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface SentimentData {
//   feature_summary?: FeatureSummary[];
//   overall_summary?: OverallSummary[];
//   sentiment_by_brand?: BrandSummary[];
//   sentiment_by_product?: ProductSummary[];
//   sentiment_by_rating?: RatingSummary[];
//   sentiment_by_platform?: PlatformSummary[];
//   sentiment_by_gender?: GenderSummary[];
//   sentiment_by_verified?: VerifiedSummary[];
//   sentiment_by_age?: AgeSummary[];
// }
// interface FilteredPhoneData {
//   phone: string;
//   feature_summary: FeatureSummary[];
//   overall_summary: OverallSummary[];
//   sentiment_by_brand: BrandSummary[];
//   sentiment_by_product: ProductSummary[];
//   sentiment_by_rating: RatingSummary[];
//   sentiment_by_platform: PlatformSummary[];
//   sentiment_by_gender: GenderSummary[];
//   sentiment_by_verified: VerifiedSummary[];
//   sentiment_by_age: AgeSummary[];
// }

// export default function ResultsPage() {
//   const [data, setData] = useState<SentimentData | null>(null);
//   const [selectedPhones, setSelectedPhones] = useState<OptionType[]>([]);
//   const [selectedMonths, setSelectedMonths] = useState<OptionType[]>([]);
//   const [filteredData, setFilteredData] = useState<FilteredPhoneData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showDebug, setShowDebug] = useState(false);
//   const formRef = useRef<HTMLFormElement>(null);
//   const reportRef = useRef<HTMLDivElement>(null);
//   // State for modal
//   const [modalChart, setModalChart] = useState<React.ReactNode | null>(null);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("analysis");
//       if (stored) setData(JSON.parse(stored));
//       setLoading(false);
//     } catch {
//       setError("Failed to load analysis data. Please upload a file again.");
//       setLoading(false);
//     }
//   }, []);

//   // Helper: Extract unique phone models and months from data
//   function getFullPhoneName(brand?: string, productName?: string) {
//     if (!productName) return '';
//     return `${brand ? brand + ' ' : ''}${productName}`.trim();
//   }

//   const getPhoneModels = (): string[] => {
//     if (!data?.sentiment_by_product) return [];
//     return Array.from(
//       new Set(
//         data.sentiment_by_product
//           .map((d) => getFullPhoneName(d["Brand"], d["Product Name"]))
//       )
//     ).filter((v) => v && v.trim() !== "");
//   };

//   const getMonths = (): string[] => {
//     if (!data?.sentiment_by_product) return [];
//     const monthSet = new Set(
//       data.sentiment_by_product
//         .map((d) => d["Month"])
//         .filter((m): m is string => typeof m === 'string' && m.length === 7)
//         .map((ym) => {
//           const [year, month] = ym.split("-");
//           const date = new Date(Number(year), Number(month) - 1);
//           return date.toLocaleString('default', { month: 'long', year: 'numeric' });
//         })
//     );
//     return Array.from(monthSet);
//   };

//   // Fix react-select onChange typing
//   const handlePhoneChange = (newValue: readonly OptionType[]) => setSelectedPhones([...newValue]);
//   const handleMonthChange = (newValue: readonly OptionType[]) => setSelectedMonths([...newValue]);

//   // Filter data by selected phones and months
//   const filterData = () => {
//     if (!data) return [];
//     const phones = selectedPhones.map((p) => p.value);
//     const months = selectedMonths.map((m) => m.value);
//     function matchPhone(d: { Brand?: string; 'Product Name'?: string }, phone: string) {
//       const dBrand = d["Brand"] || '';
//       const dModel = d["Product Name"] || '';
//       return getFullPhoneName(dBrand, dModel) === phone;
//     }
//     function matchMonth(d: { Month?: string }) {
//       if (!months.length) return true;
//       const ym = d["Month"];
//       if (!ym || typeof ym !== 'string') return false;
//       const [year, month] = ym.split("-");
//       const dateStr = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
//       return months.includes(dateStr);
//     }
//     return phones.map((phone) => {
//       return {
//         phone,
//         feature_summary: data.feature_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         overall_summary: data.overall_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_brand: data.sentiment_by_brand?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_product: data.sentiment_by_product?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_rating: data.sentiment_by_rating?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_platform: data.sentiment_by_platform?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_gender: data.sentiment_by_gender?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_verified: data.sentiment_by_verified?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_age: data.sentiment_by_age?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       };
//     });
//   };

//   // Handle form submit: open new tab with filtered report
//   const handleGenerateReport = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const filtered = filterData();
//     // Save filtered data to localStorage and open new tab
//     localStorage.setItem("filtered_analysis", JSON.stringify(filtered));
//     window.open("/results?filtered=1", "_blank");
//   };

//   // If this is a filtered report, load filtered data
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const params = new URLSearchParams(window.location.search);
//         if (params.get('filtered')) {
//           const stored = localStorage.getItem("filtered_analysis");
//           if (stored) setFilteredData(JSON.parse(stored));
//         }
//       } catch {
//         setError("Failed to load filtered report. Please try again.");
//       }
//     }
//   }, []);

//   // Helper: Aggregate array of objects by a key, summing POSITIVE and NEGATIVE
//   function aggregateByKey<T extends { POSITIVE: number; NEGATIVE: number }>(arr: T[], key: keyof T): T[] {
//     const map = new Map<string, T>();
//     arr.forEach(item => {
//       const k = item[key];
//       if (k === undefined || k === null || k === '') return;
//       const kStr = k.toString();
//       if (!map.has(kStr)) {
//         map.set(kStr, { ...item, [key]: kStr });
//       } else {
//         const existing = map.get(kStr)!;
//         existing.POSITIVE = (existing.POSITIVE || 0) + (item.POSITIVE || 0);
//         existing.NEGATIVE = (existing.NEGATIVE || 0) + (item.NEGATIVE || 0);
//       }
//     });
//     return Array.from(map.values());
//   }

//   const handleDownloadPDF = async () => {
//     if (reportRef.current) {
//       const element = reportRef.current;
//       const canvas = await html2canvas(element, { scale: 2 });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = pageWidth;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let position = 0;
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       let remainingHeight = imgHeight - pageHeight;
//       while (remainingHeight > 0) {
//         position = position - pageHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         remainingHeight -= pageHeight;
//       }
//       pdf.save('Sentiment-Analysis-Report.pdf');
//     }
//   };

//   // Modal close handler
//   const closeModal = () => setModalChart(null);

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//           <span role='img' aria-label='Chart'>📈</span> Loading analysis data...
//         </h2>
//         <p className="text-gray-600 text-center">Please wait.</p>
//       </div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//         <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
//           <span role='img' aria-label='Error'>❌</span> Error
//         </h2>
//         <p className="text-gray-600 text-center">{error}</p>
//         <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => window.location.href = '/upload'}>Go to Upload</button>
//       </div>
//     </div>
//   );

//   if (!data && !filteredData.length) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//           <span role='img' aria-label='Chart'>📈</span> No analysis data found.
//         </h2>
//         <p className="text-gray-600 text-center">Please upload a file first.</p>
//         <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => window.location.href = '/upload'}>Go to Upload</button>
//       </div>
//     </div>
//   );

//   // If filteredData exists, render filtered report, else render form
//   if (filteredData.length) {
//     return (
//       <div className="flex flex-col items-center min-h-screen px-4 py-12" style={{ background: "radial-gradient(ellipse at 50% 40%, #17213a 0%, #0a0c23 100%)" }}>
//         <div className="bg-[#0a0c23] rounded-2xl shadow-2xl p-8 w-full max-w-4xl flex flex-col items-center border border-[#23243a]">
//           <div className="flex justify-end w-full mb-4">
//             <button
//               onClick={handleDownloadPDF}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             >
//               Download Full Report as PDF
//             </button>
//           </div>
//           <div ref={reportRef} id="full-report-pdf" className="pdf-export w-full">
//             <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
//               <span role='img' aria-label='Chart'>📈</span> Filtered Analysis Results
//             </h2>
//             {filteredData.map((phoneData) => (
//               <div key={phoneData.phone} className="w-full mb-12">
//                 {/* Collect charts for this phone in a grid layout */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                   {/* Feature-wise Sentiment */}
//                   {phoneData.feature_summary?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         <BarChart width={800} height={400} data={aggregateByKey(phoneData.feature_summary, "feature")}>
//                           <XAxis dataKey="feature" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>📊</span> Feature-wise Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.feature_summary, "feature")}>
//                           <XAxis dataKey="feature" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                   {/* Monthly Sentiment Trend (Line Graph) */}
//                   {phoneData.overall_summary?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         (() => {
//                           const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
//                           phoneData.overall_summary.forEach(d => {
//                             if (!d.Month) return;
//                             if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
//                             if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
//                             if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
//                           });
//                           const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
//                           const displayData = data.map(d => {
//                             const [year, month] = d.Month.split('-');
//                             const date = new Date(Number(year), Number(month) - 1);
//                             return {
//                               ...d,
//                               label: date.toLocaleString('default', { month: 'short', year: '2-digit' })
//                             };
//                           });
//                           return (
//                             <LineChart width={800} height={400} data={displayData}>
//                               <XAxis dataKey="label" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Line type="monotone" dataKey="POSITIVE" stroke="#22c55e" name="Positive" strokeWidth={3} />
//                               <Line type="monotone" dataKey="NEGATIVE" stroke="#ef4444" name="Negative" strokeWidth={3} />
//                             </LineChart>
//                           );
//                         })()
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>📈</span> Monthly Sentiment Trend for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         {(() => {
//                           const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
//                           phoneData.overall_summary.forEach(d => {
//                             if (!d.Month) return;
//                             if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
//                             if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
//                             if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
//                           });
//                           const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
//                           const displayData = data.map(d => {
//                             const [year, month] = d.Month.split('-');
//                             const date = new Date(Number(year), Number(month) - 1);
//                             return {
//                               ...d,
//                               label: date.toLocaleString('default', { month: 'short', year: '2-digit' })
//                             };
//                           });
//                           return (
//                             <LineChart width={300} height={200} data={displayData}>
//                               <XAxis dataKey="label" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Line type="monotone" dataKey="POSITIVE" stroke="#22c55e" name="Positive" strokeWidth={3} />
//                               <Line type="monotone" dataKey="NEGATIVE" stroke="#ef4444" name="Negative" strokeWidth={3} />
//                             </LineChart>
//                           );
//                         })()}
//                       </div>
//                     </div>
//                   )}
//                   {/* Overall Sentiment */}
//                   {phoneData.overall_summary?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         (() => {
//                           const agg = phoneData.overall_summary.reduce(
//                             (acc, cur) => {
//                               if (cur.sentiment === "POSITIVE") acc.POSITIVE += cur.count;
//                               if (cur.sentiment === "NEGATIVE") acc.NEGATIVE += cur.count;
//                               return acc;
//                             },
//                             { POSITIVE: 0, NEGATIVE: 0 }
//                           );
//                           const pieData = [
//                             { name: "Positive", value: agg.POSITIVE },
//                             { name: "Negative", value: agg.NEGATIVE }
//                           ];
//                           return (
//                             <PieChart width={600} height= {400}>
//                               <Pie data={pieData} cx={300} cy={200} outerRadius={150} label dataKey="value">
//                                 <Cell fill="#82ca9d" />
//                                 <Cell fill="#ff7f7f" />
//                               </Pie>
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             </PieChart>
//                           );
//                         })()
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>🧠</span> Overall Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto flex justify-center">
//                         {(() => {
//                           const agg = phoneData.overall_summary.reduce(
//                             (acc, cur) => {
//                               if (cur.sentiment === "POSITIVE") acc.POSITIVE += cur.count;
//                               if (cur.sentiment === "NEGATIVE") acc.NEGATIVE += cur.count;
//                               return acc;
//                             },
//                             { POSITIVE: 0, NEGATIVE: 0 }
//                           );
//                           const pieData = [
//                             { name: "Positive", value: agg.POSITIVE },
//                             { name: "Negative", value: agg.NEGATIVE }
//                           ];
//                           return (
//                             <PieChart width={300} height={200}>
//                               <Pie data={pieData} cx={150} cy={100} outerRadius={80} label dataKey="value">
//                                 <Cell fill="#82ca9d" />
//                                 <Cell fill="#ff7f7f" />
//                               </Pie>
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           </PieChart>
//                           );
//                         })()}
//                       </div>
//                     </div>
//                   )}
//                   {/* Brand Sentiment Chart */}
//                   {phoneData.sentiment_by_brand?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_brand, "Brand")}>
//                           <XAxis dataKey="Brand" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>🏷️</span> Sentiment by Brand for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_brand, "Brand")}>
//                           <XAxis dataKey="Brand" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                   {/* Product Sentiment Chart */}
//                   {phoneData.sentiment_by_product?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_product, "Product Name").map(p => ({...p, fullName: getFullPhoneName(p.Brand, p["Product Name"])}))}>
//                           <XAxis dataKey="fullName" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>📱</span> Sentiment by Product for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_product, "Product Name").map(p => ({...p, fullName: getFullPhoneName(p.Brand, p["Product Name"])}))}>
//                           <XAxis dataKey="fullName" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                   {/* Rating Sentiment Chart */}
//                   {phoneData.sentiment_by_rating?.length > 0 && (() => {
//                     // Only show chart if at least one entry has a non-empty Rating
//                     const hasValid = phoneData.sentiment_by_rating.some(v => v.Rating !== undefined && v.Rating !== null && v.Rating !== '');
//                     if (!hasValid) return null;
//                     // Ensure all entries have a string value for Rating and sort numerically
//                     const chartData = aggregateByKey(phoneData.sentiment_by_rating, "Rating")
//                       .map(v => ({
//                         ...v,
//                         Rating: v.Rating?.toString() ?? ''
//                       }))
//                       .filter(v => v.Rating !== '')
//                       .sort((a, b) => {
//                         // Try to sort numerically if possible
//                         const na = Number(a.Rating), nb = Number(b.Rating);
//                         if (!isNaN(na) && !isNaN(nb)) return na - nb;
//                         return a.Rating.localeCompare(b.Rating);
//                       });
//                     return (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         onClick={() => setModalChart(
//                           <BarChart width={800} height={400} data={chartData}>
//                             <XAxis dataKey="Rating" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         )}
//                       >
//                         <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                           <span>⭐</span> Sentiment by Rating for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto">
//                           <BarChart width={300} height={200} data={chartData}>
//                             <XAxis dataKey="Rating" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         </div>
//                       </div>
//                     );
//                   })()}
//                   {/* Verified Purchase Sentiment Chart */}
//                   {phoneData.sentiment_by_verified?.length > 0 && (() => {
//                     // Only show chart if at least one entry has a non-empty Verified Purchase
//                     const hasValid = phoneData.sentiment_by_verified.some(v => v['Verified Purchase'] !== undefined && v['Verified Purchase'] !== null && v['Verified Purchase'] !== '');
//                     if (!hasValid) return null;
//                     // Ensure all entries have a string value for Verified Purchase and sort Yes/No
//                     const chartData = aggregateByKey(phoneData.sentiment_by_verified, "Verified Purchase")
//                       .map(v => ({
//                         ...v,
//                         ['Verified Purchase']: v['Verified Purchase']?.toString() ?? ''
//                       }))
//                       .filter(v => v['Verified Purchase'] !== '')
//                       .sort((a, b) => {
//                         // Sort Yes before No, otherwise alphabetically
//                         if (a['Verified Purchase'] === 'Yes' && b['Verified Purchase'] === 'No') return -1;
//                         if (a['Verified Purchase'] === 'No' && b['Verified Purchase'] === 'Yes') return 1;
//                         return a['Verified Purchase'].localeCompare(b['Verified Purchase']);
//                       });
//                     return (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         onClick={() => setModalChart(
//                           <BarChart width={800} height={400} data={chartData}>
//                             <XAxis dataKey="Verified Purchase" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         )}
//                       >
//                         <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                           <span>✅</span> Sentiment by Verified Purchase for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto">
//                           <BarChart width={300} height={200} data={chartData}>
//                             <XAxis dataKey="Verified Purchase" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         </div>
//                       </div>
//                     );
//                   })()}
//                   {/* Age Sentiment Chart */}
//                   {phoneData.sentiment_by_age?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_age, "Age")}>
//                           <XAxis dataKey="Age" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>🎂</span> Sentiment by Age for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_age, "Age")}>
//                           <XAxis dataKey="Age" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 {/* Analytics Section below charts */}
//                 <AnalyticsSection phoneData={phoneData} />
//               </div>
//             ))}
//             <GlobalAnalyticsSection data={data!} selectedPhoneNames={filteredData.map(fd => fd.phone)} />
//           </div>
//         </div>
//         {/* Modal for enlarged chart */}
//         {modalChart && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-[#0a0c23] rounded-2xl p-8 max-w-4xl w-full border border-[#23243a] relative">
//               <button
//                 className="absolute top-4 right-4 text-white text-xl font-bold hover:text-blue-300"
//                 onClick={closeModal}
//               >
//                 &times;
//               </button>
//               <div className="flex justify-center">
//                 {modalChart}
//               </div>
//             </div>
//           </div>
//         )}
//         <style jsx global>{`
//           .pdf-export, .pdf-export * {
//             color: #fff !important;
//             background-color: #0a0c23 !important;
//           }
//           .pdf-export .text-blue-300 { color: #93c5fd !important; }
//           .pdf-export .text-green-400 { color: #4ade80 !important; }
//           .pdf-export .bg-[#4f46e5] { background-color: #4f46e5 !important; }
//           .pdf-export .bg-[#6366f1] { background-color: #6366f1 !important; }
//           /* Ensure charts in PDF export use larger sizes */
//           .pdf-export .grid {
//             display: block !important;
//           }
//           .pdf-export .grid > div {
//             width: 100% !important;
//             margin-bottom: 20px !important;
//           }
//           .pdf-export .grid > div .recharts-wrapper {
//             width: 600px !important;
//             height: 300px !important;
//           }
//         `}</style>
//       </div>
//     );
//   }

//   // Render the form for selecting phones and months
//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#181b23] via-[#23243a] to-[#0a0c23] px-4 py-12">
//       <div className="bg-[#0a0c23] rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center mb-8 border border-[#23243a]">
//         <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//           <span role='img' aria-label='Chart'>📈</span> Generate Custom Report
//         </h2>
//         <form ref={formRef} className="w-full flex flex-col gap-4" onSubmit={handleGenerateReport}>
//           <label className="font-semibold text-blue-200">Select Phone Models</label>
//           <Select
//             isMulti
//             options={getPhoneModels().map((p) => ({ value: p, label: p }))}
//             value={selectedPhones}
//             onChange={handlePhoneChange}
//             placeholder="Choose phone models..."
//             className="mb-2"
//             styles={{
//               control: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 borderColor: '#23243a',
//                 color: '#fff',
//                 '&:hover': { borderColor: '#4f46e5' }
//               }),
//               menu: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 color: '#fff'
//               }),
//               option: (base, { isFocused, isSelected }) => ({
//                 ...base,
//                 backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
//                 color: '#fff',
//                 '&:active': { backgroundColor: '#6366f1' }
//               }),
//               multiValue: (base) => ({
//                 ...base,
//                 backgroundColor: '#4f46e5'
//               }),
//               multiValueLabel: (base) => ({
//                 ...base,
//                 color: '#fff'
//               }),
//               multiValueRemove: (base) => ({
//                 ...base,
//                 color: '#fff',
//                 '&:hover': { backgroundColor: '#6366f1' }
//               }),
//               placeholder: (base) => ({
//                 ...base,
//                 color: '#93c5fd'
//               }),
//               input: (base) => ({
//                 ...base,
//                 color: '#fff'
//               })
//             }}
//           />
//           <label className="font-semibold text-blue-200">Select Months</label>
//           <Select
//             isMulti
//             options={getMonths().map((m) => ({ value: m, label: m }))}
//             value={selectedMonths}
//             onChange={handleMonthChange}
//             placeholder="Choose months..."
//             className="mb-2"
//             styles={{
//               control: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 borderColor: '#23243a',
//                 color: '#fff',
//                 '&:hover': { borderColor: '#4f46e5' }
//               }),
//               menu: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 color: '#fff'
//               }),
//               option: (base, { isFocused, isSelected }) => ({
//                 ...base,
//                 backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
//                 color: '#fff',
//                 '&:active': { backgroundColor: '#6366f1' }
//               }),
//               multiValue: (base) => ({
//                 ...base,
//                 backgroundColor: '#4f46e5'
//               }),
//               multiValueLabel: (base) => ({
//                 ...base,
//                 color: '#fff'
//               }),
//               multiValueRemove: (base) => ({
//                 ...base,
//                 color: '#fff',
//                 '&:hover': { backgroundColor: '#6366f1' }
//               }),
//               placeholder: (base) => ({
//                 ...base,
//                 color: '#93c5fd'
//               }),
//               input: (base) => ({
//                 ...base,
//                 color: '#fff'
//               })
//             }}
//           />
//           <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Generate Report</button>
//         </form>
//         <button
//           className="mt-4 text-xs text-blue-400 underline"
//           onClick={() => setShowDebug((v) => !v)}
//         >
//           {showDebug ? 'Hide' : 'Show'} Debug Data
//         </button>
//         {showDebug && (
//           <DebugTable data={data} />
//         )}
//       </div>
//       {/* Optionally, show default charts here or instructions */}
//     </div>
//   );
// }

// // Move DebugTable to a top-level component
// function DebugTable({ data }: { data: unknown }) {
//   return (
//     <div className="mt-4 p-2 bg-[#181b23] rounded text-xs max-h-96 overflow-auto w-full text-left text-white border border-[#23243a]">
//       <table className="min-w-full border border-gray-300">
//         <thead className="bg-gray-800 sticky top-0">
//           <tr>
//             <th className="px-2 py-1 border-b border-gray-300 text-left">Key</th>
//             <th className="px-2 py-1 border-b border-gray-300 text-left">Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data && typeof data === 'object' && data !== null && Object.entries(data as Record<string, unknown>).map(([key, value]) => (
//             <tr key={key} className="border-b border-gray-700 align-top">
//               <td className="px-2 py-1 font-semibold text-blue-300 align-top">{key}</td>
//               <td className="px-2 py-1 align-top whitespace-pre-wrap break-all text-white">
//                 {Array.isArray(value) ? (
//                   <div className="overflow-x-auto max-h-40">
//                     <table className="min-w-full border border-gray-700 text-xs">
//                       <thead className="bg-gray-900">
//                         <tr>
//                           {value.length > 0 && typeof value[0] === 'object'
//                             ? Object.keys(value[0]).map((col) => (
//                                 <th key={col} className="px-1 py-0.5 border-b border-gray-700 text-left">{col}</th>
//                               ))
//                             : <th className="px-1 py-0.5 border-b border-gray-700 text-left">Value</th>}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {value.length > 0 && typeof value[0] === 'object'
//                           ? value.map((row, i) => (
//                               <tr key={i} className="border-b border-gray-800">
//                                 {Object.values(row).map((cell, j) => (
//                                   <td key={j} className="px-1 py-0.5 align-top border-b border-gray-800 text-white">{String(cell)}</td>
//                                 ))}
//                               </tr>
//                             ))
//                           : value.map((v, i) => (
//                               <tr key={i} className="border-b border-gray-800">
//                                 <td className="px-1 py-0.5 align-top border-b border-gray-800 text-white">{String(v)}</td>
//                               </tr>
//                             ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : typeof value === 'object' && value !== null ? (
//                   <div className="overflow-x-auto max-h-40">
//                     <table className="min-w-full border border-gray-700 text-xs">
//                       <tbody>
//                         {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
//                           <tr key={k} className="border-b border-gray-800">
//                             <td className="px-1 py-0.5 font-semibold text-blue-300 align-top">{k}</td>
//                             <td className="px-1 py-0.5 align-top text-white">{String(v)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : String(value)}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
















// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
//   PieChart, Pie, Cell,
//   LineChart, Line
// } from 'recharts';
// import Select from 'react-select';
// import AnalyticsSection from "./AnalyticsSection";
// import GlobalAnalyticsSection from "./GlobalAnalyticsSection";
// import Loading from '../component/Loading';

// // Type definitions for react-select and data
// interface OptionType {
//   value: string;
//   label: string;
// }

// // Define types for all data arrays
// interface FeatureSummary {
//   feature: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
//   Brand?: string;
// }
// interface OverallSummary {
//   sentiment: string;
//   count: number;
//   'Product Name': string;
//   Month?: string;
//   Brand?: string;
// }
// interface BrandSummary {
//   Brand: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface ProductSummary {
//   'Product Name': string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   Month?: string;
//   Brand?: string;
// }
// interface RatingSummary {
//   Rating: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface PlatformSummary {
//   Platform: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface GenderSummary {
//   Gender: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface VerifiedSummary {
//   'Verified Purchase': string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface AgeSummary {
//   Age: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface SentimentData {
//   feature_summary?: FeatureSummary[];
//   overall_summary?: OverallSummary[];
//   sentiment_by_brand?: BrandSummary[];
//   sentiment_by_product?: ProductSummary[];
//   sentiment_by_rating?: RatingSummary[];
//   sentiment_by_platform?: PlatformSummary[];
//   sentiment_by_gender?: GenderSummary[];
//   sentiment_by_verified?: VerifiedSummary[];
//   sentiment_by_age?: AgeSummary[];
// }
// interface FilteredPhoneData {
//   phone: string;
//   feature_summary: FeatureSummary[];
//   overall_summary: OverallSummary[];
//   sentiment_by_brand: BrandSummary[];
//   sentiment_by_product: ProductSummary[];
//   sentiment_by_rating: RatingSummary[];
//   sentiment_by_platform: PlatformSummary[];
//   sentiment_by_gender: GenderSummary[];
//   sentiment_by_verified: VerifiedSummary[];
//   sentiment_by_age: AgeSummary[];
// }

// export default function ResultsPage() {
//   const [data, setData] = useState<SentimentData | null>(null);
//   const [selectedPhones, setSelectedPhones] = useState<OptionType[]>([]);
//   const [selectedMonths, setSelectedMonths] = useState<OptionType[]>([]);
//   const [filteredData, setFilteredData] = useState<FilteredPhoneData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showDebug, setShowDebug] = useState(false);
//   const formRef = useRef<HTMLFormElement>(null);
//   const reportRef = useRef<HTMLDivElement>(null);
//   // State for modal
//   const [modalChart, setModalChart] = useState<React.ReactNode | null>(null);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("analysis");
//       if (stored) setData(JSON.parse(stored));
//       setLoading(false);
//     } catch {
//       setError("Failed to load analysis data. Please upload a file again.");
//       setLoading(false);
//     }
//   }, []);

//   // Helper: Extract unique phone models and months from data
//   function getFullPhoneName(brand?: string, productName?: string) {
//     if (!productName) return '';
//     return `${brand ? brand + ' ' : ''}${productName}`.trim();
//   }

//   const getPhoneModels = (): string[] => {
//     if (!data?.sentiment_by_product) return [];
//     return Array.from(
//       new Set(
//         data.sentiment_by_product
//           .map((d) => getFullPhoneName(d["Brand"], d["Product Name"]))
//       )
//     ).filter((v) => v && v.trim() !== "");
//   };

//   const getMonths = (): string[] => {
//     if (!data?.sentiment_by_product) return [];
//     const monthSet = new Set(
//       data.sentiment_by_product
//         .map((d) => d["Month"])
//         .filter((m): m is string => typeof m === 'string' && m.length === 7)
//         .map((ym) => {
//           const [year, month] = ym.split("-");
//           const date = new Date(Number(year), Number(month) - 1);
//           return date.toLocaleString('default', { month: 'long', year: 'numeric' });
//         })
//     );
//     return Array.from(monthSet);
//   };

//   // Fix react-select onChange typing
//   const handlePhoneChange = (newValue: readonly OptionType[]) => setSelectedPhones([...newValue]);
//   const handleMonthChange = (newValue: readonly OptionType[]) => setSelectedMonths([...newValue]);

//   // Filter data by selected phones and months
//   const filterData = () => {
//     if (!data) return [];
//     const phones = selectedPhones.map((p) => p.value);
//     const months = selectedMonths.map((m) => m.value);
//     function matchPhone(d: { Brand?: string; 'Product Name'?: string }, phone: string) {
//       const dBrand = d["Brand"] || '';
//       const dModel = d["Product Name"] || '';
//       return getFullPhoneName(dBrand, dModel) === phone;
//     }
//     function matchMonth(d: { Month?: string }) {
//       if (!months.length) return true;
//       const ym = d["Month"];
//       if (!ym || typeof ym !== 'string') return false;
//       const [year, month] = ym.split("-");
//       const dateStr = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
//       return months.includes(dateStr);
//     }
//     return phones.map((phone) => {
//       return {
//         phone,
//         feature_summary: data.feature_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         overall_summary: data.overall_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_brand: data.sentiment_by_brand?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_product: data.sentiment_by_product?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_rating: data.sentiment_by_rating?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_platform: data.sentiment_by_platform?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_gender: data.sentiment_by_gender?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_verified: data.sentiment_by_verified?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//         sentiment_by_age: data.sentiment_by_age?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       };
//     });
//   };

//   // Handle form submit: open new tab with filtered report
//   const handleGenerateReport = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const filtered = filterData();
//     // Save filtered data to localStorage and open new tab
//     localStorage.setItem("filtered_analysis", JSON.stringify(filtered));
//     window.open("/results?filtered=1", "_blank");
//   };

//   // If this is a filtered report, load filtered data
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const params = new URLSearchParams(window.location.search);
//         if (params.get('filtered')) {
//           const stored = localStorage.getItem("filtered_analysis");
//           if (stored) setFilteredData(JSON.parse(stored));
//         }
//       } catch {
//         setError("Failed to load filtered report. Please try again.");
//       }
//     }
//   }, []);

//   // Helper: Aggregate array of objects by a key, summing POSITIVE and NEGATIVE
//   function aggregateByKey<T extends { POSITIVE: number; NEGATIVE: number }>(arr: T[], key: keyof T): T[] {
//     const map = new Map<string, T>();
//     arr.forEach(item => {
//       const k = item[key];
//       if (k === undefined || k === null || k === '') return;
//       const kStr = k.toString();
//       if (!map.has(kStr)) {
//         map.set(kStr, { ...item, [key]: kStr });
//       } else {
//         const existing = map.get(kStr)!;
//         existing.POSITIVE = (existing.POSITIVE || 0) + (item.POSITIVE || 0);
//         existing.NEGATIVE = (existing.NEGATIVE || 0) + (item.NEGATIVE || 0);
//       }
//     });
//     return Array.from(map.values());
//   }

//   const handleDownloadPDF = async () => {
//     if (reportRef.current) {
//       const element = reportRef.current;
//       const canvas = await html2canvas(element, { scale: 2 });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = pageWidth;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let position = 0;
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       let remainingHeight = imgHeight - pageHeight;
//       while (remainingHeight > 0) {
//         position = position - pageHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         remainingHeight -= pageHeight;
//       }
//       pdf.save('Sentiment-Analysis-Report.pdf');
//     }
//   };
  


//   // Modal close handler
//   const closeModal = () => setModalChart(null);

//   if (loading) return (
//     // <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//     //   <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//     //     <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//     //       <span role='img' aria-label='Chart'>📈</span> Loading analysis data...
//     //     </h2>
//     //     <p className="text-gray-600 text-center">Please wait.</p>
//     //   </div>
//     // </div>

//     <Loading/>
//   );

//   if (error) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//         <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
//           <span role='img' aria-label='Error'>❌</span> Error
//         </h2>
//         <p className="text-gray-600 text-center">{error}</p>
//         <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => window.location.href = '/upload'}>Go to Upload</button>
//       </div>
//     </div>
//   );

//   if (!data && !filteredData.length) return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//       <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//           <span role='img' aria-label='Chart'>📈</span> No analysis data found.
//         </h2>
//         <p className="text-gray-600 text-center">Please upload a file first.</p>
//         <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => window.location.href = '/upload'}>Go to Upload</button>
//       </div>
//     </div>
//   );

//   // If filteredData exists, render filtered report, else render form
//   if (filteredData.length) {
//     return (
//       <div className="flex flex-col items-center min-h-screen px-4 py-12" style={{ background: "radial-gradient(ellipse at 50% 40%, #17213a 0%, #0a0c23 100%)" }}>
//         <div className="bg-[#0a0c23] rounded-2xl shadow-2xl p-8 w-full max-w-4xl flex flex-col items-center border border-[#23243a]">
//           <div className="flex justify-end w-full mb-4">
//             <button
//               onClick={handleDownloadPDF}
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             >
//               Download Full Report as PDF
//             </button>
//           </div>
//           <div ref={reportRef} id="full-report-pdf" className="pdf-export w-full">
//             <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
//               <span role='img' aria-label='Chart'>📈</span> Filtered Analysis Results
//             </h2>
//             {filteredData.map((phoneData) => (
//               <div key={phoneData.phone} className="w-full mb-12">
//                 {/* Collect charts for this phone in a grid layout */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                   {/* Feature-wise Sentiment */}
//                   {phoneData.feature_summary?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         <BarChart width={800} height={400} data={aggregateByKey(phoneData.feature_summary, "feature")}>
//                           <XAxis dataKey="feature" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>📊</span> Feature-wise Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.feature_summary, "feature")}>
//                           <XAxis dataKey="feature" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                   {/* Monthly Sentiment Trend (Line Graph) */}
//                   {phoneData.overall_summary?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         (() => {
//                           const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
//                           phoneData.overall_summary.forEach(d => {
//                             if (!d.Month) return;
//                             if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
//                             if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
//                             if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
//                           });
//                           const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
//                           const displayData = data.map(d => {
//                             const [year, month] = d.Month.split('-');
//                             const date = new Date(Number(year), Number(month) - 1);
//                             return {
//                               ...d,
//                               label: date.toLocaleString('default', { month: 'short', year: '2-digit' })
//                             };
//                           });
//                           return (
//                             <LineChart width={800} height={400} data={displayData}>
//                               <XAxis dataKey="label" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Line type="monotone" dataKey="POSITIVE" stroke="#22c55e" name="Positive" strokeWidth={3} />
//                               <Line type="monotone" dataKey="NEGATIVE" stroke="#ef4444" name="Negative" strokeWidth={3} />
//                             </LineChart>
//                           );
//                         })()
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>📈</span> Monthly Sentiment Trend for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         {(() => {
//                           const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
//                           phoneData.overall_summary.forEach(d => {
//                             if (!d.Month) return;
//                             if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
//                             if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
//                             if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
//                           });
//                           const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
//                           const displayData = data.map(d => {
//                             const [year, month] = d.Month.split('-');
//                             const date = new Date(Number(year), Number(month) - 1);
//                             return {
//                               ...d,
//                               label: date.toLocaleString('default', { month: 'short', year: '2-digit' })
//                             };
//                           });
//                           return (
//                             <LineChart width={300} height={200} data={displayData}>
//                               <XAxis dataKey="label" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Line type="monotone" dataKey="POSITIVE" stroke="#22c55e" name="Positive" strokeWidth={3} />
//                               <Line type="monotone" dataKey="NEGATIVE" stroke="#ef4444" name="Negative" strokeWidth={3} />
//                             </LineChart>
//                           );
//                         })()}
//                       </div>
//                     </div>
//                   )}
//                   {/* Overall Sentiment */}
//                   {phoneData.overall_summary?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         (() => {
//                           const agg = phoneData.overall_summary.reduce(
//                             (acc, cur) => {
//                               if (cur.sentiment === "POSITIVE") acc.POSITIVE += cur.count;
//                               if (cur.sentiment === "NEGATIVE") acc.NEGATIVE += cur.count;
//                               return acc;
//                             },
//                             { POSITIVE: 0, NEGATIVE: 0 }
//                           );
//                           const pieData = [
//                             { name: "Positive", value: agg.POSITIVE },
//                             { name: "Negative", value: agg.NEGATIVE }
//                           ];
//                           return (
//                             <PieChart width={600} height= {400}>
//                               <Pie data={pieData} cx={300} cy={200} outerRadius={150} label dataKey="value">
//                                 <Cell fill="#82ca9d" />
//                                 <Cell fill="#ff7f7f" />
//                               </Pie>
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             </PieChart>
//                           );
//                         })()
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>🧠</span> Overall Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto flex justify-center">
//                         {(() => {
//                           const agg = phoneData.overall_summary.reduce(
//                             (acc, cur) => {
//                               if (cur.sentiment === "POSITIVE") acc.POSITIVE += cur.count;
//                               if (cur.sentiment === "NEGATIVE") acc.NEGATIVE += cur.count;
//                               return acc;
//                             },
//                             { POSITIVE: 0, NEGATIVE: 0 }
//                           );
//                           const pieData = [
//                             { name: "Positive", value: agg.POSITIVE },
//                             { name: "Negative", value: agg.NEGATIVE }
//                           ];
//                           return (
//                             <PieChart width={300} height={200}>
//                               <Pie data={pieData} cx={150} cy={100} outerRadius={80} label dataKey="value">
//                                 <Cell fill="#82ca9d" />
//                                 <Cell fill="#ff7f7f" />
//                               </Pie>
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             </PieChart>
//                           );
//                         })()}
//                       </div>
//                     </div>
//                   )}
//                   {/* Brand Sentiment Chart */}
//                   {phoneData.sentiment_by_brand?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_brand, "Brand")}>
//                           <XAxis dataKey="Brand" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>🏷️</span> Sentiment by Brand for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_brand, "Brand")}>
//                           <XAxis dataKey="Brand" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                   {/* Product Sentiment Chart */}
//                   {phoneData.sentiment_by_product?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_product, "Product Name").map(p => ({...p, fullName: getFullPhoneName(p.Brand, p["Product Name"])}))}>
//                           <XAxis dataKey="fullName" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>📱</span> Sentiment by Product for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_product, "Product Name").map(p => ({...p, fullName: getFullPhoneName(p.Brand, p["Product Name"])}))}>
//                           <XAxis dataKey="fullName" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                   {/* Rating Sentiment Chart */}
//                   {phoneData.sentiment_by_rating?.length > 0 && (() => {
//                     // Only show chart if at least one entry has a non-empty Rating
//                     const hasValid = phoneData.sentiment_by_rating.some(v => v.Rating !== undefined && v.Rating !== null && v.Rating !== '');
//                     if (!hasValid) return null;
//                     // Ensure all entries have a string value for Rating and sort numerically
//                     const chartData = aggregateByKey(phoneData.sentiment_by_rating, "Rating")
//                       .map(v => ({
//                         ...v,
//                         Rating: v.Rating?.toString() ?? ''
//                       }))
//                       .filter(v => v.Rating !== '')
//                       .sort((a, b) => {
//                         // Try to sort numerically if possible
//                         const na = Number(a.Rating), nb = Number(b.Rating);
//                         if (!isNaN(na) && !isNaN(nb)) return na - nb;
//                         return a.Rating.localeCompare(b.Rating);
//                       });
//                     return (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         onClick={() => setModalChart(
//                           <BarChart width={800} height={400} data={chartData}>
//                             <XAxis dataKey="Rating" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         )}
//                       >
//                         <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                           <span>⭐</span> Sentiment by Rating for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto">
//                           <BarChart width={300} height={200} data={chartData}>
//                             <XAxis dataKey="Rating" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         </div>
//                       </div>
//                     );
//                   })()}
//                   {/* Verified Purchase Sentiment Chart */}
//                   {phoneData.sentiment_by_verified?.length > 0 && (() => {
//                     // Only show chart if at least one entry has a non-empty Verified Purchase
//                     const hasValid = phoneData.sentiment_by_verified.some(v => v['Verified Purchase'] !== undefined && v['Verified Purchase'] !== null && v['Verified Purchase'] !== '');
//                     if (!hasValid) return null;
//                     // Ensure all entries have a string value for Verified Purchase and sort Yes/No
//                     const chartData = aggregateByKey(phoneData.sentiment_by_verified, "Verified Purchase")
//                       .map(v => ({
//                         ...v,
//                         ['Verified Purchase']: v['Verified Purchase']?.toString() ?? ''
//                       }))
//                       .filter(v => v['Verified Purchase'] !== '')
//                       .sort((a, b) => {
//                         // Sort Yes before No, otherwise alphabetically
//                         if (a['Verified Purchase'] === 'Yes' && b['Verified Purchase'] === 'No') return -1;
//                         if (a['Verified Purchase'] === 'No' && b['Verified Purchase'] === 'Yes') return 1;
//                         return a['Verified Purchase'].localeCompare(b['Verified Purchase']);
//                       });
//                     return (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         onClick={() => setModalChart(
//                           <BarChart width={800} height={400} data={chartData}>
//                             <XAxis dataKey="Verified Purchase" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         )}
//                       >
//                         <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                           <span>✅</span> Sentiment by Verified Purchase for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto">
//                           <BarChart width={300} height={200} data={chartData}>
//                             <XAxis dataKey="Verified Purchase" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         </div>
//                       </div>
//                     );
//                   })()}
//                   {/* Age Sentiment Chart */}
//                   {phoneData.sentiment_by_age?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       onClick={() => setModalChart(
//                         <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_age, "Age")}>
//                           <XAxis dataKey="Age" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       )}
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>🎂</span> Sentiment by Age for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_age, "Age")}>
//                           <XAxis dataKey="Age" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 {/* Analytics Section below charts */}
//                 <AnalyticsSection phoneData={phoneData} />
//               </div>
//             ))}
//             <GlobalAnalyticsSection data={data!} selectedPhoneNames={filteredData.map(fd => fd.phone)} />
//           </div>
//         </div>
//         {/* Modal for enlarged chart */}
//         {modalChart && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-[#0a0c23] rounded-2xl p-8 max-w-4xl w-full border border-[#23243a] relative">
//               <button
//                 className="absolute top-4 right-4 text-white text-xl font-bold hover:text-blue-300"
//                 onClick={closeModal}
//               >
//                 &times;
//               </button>
//               <div className="flex justify-center">
//                 {modalChart}
//               </div>
//             </div>
//           </div>
//         )}
//         <style jsx global>{`
//           .pdf-export, .pdf-export * {
//             color: #fff !important;
//             background-color: #0a0c23 !important;
//           }
//           .pdf-export .text-blue-300 { color: #93c5fd !important; }
//           .pdf-export .text-green-400 { color: #4ade80 !important; }
//           .pdf-export .bg-[#4f46e5] { background-color: #4f46e5 !important; }
//           .pdf-export .bg-[#6366f1] { background-color: #6366f1 !important; }
//           /* Ensure charts in PDF export use larger sizes */
//           .pdf-export .grid {
//             display: block !important;
//           }
//           .pdf-export .grid > div {
//             width: 100% !important;
//             margin-bottom: 20px !important;
//           }
//           .pdf-export .grid > div .recharts-wrapper {
//             width: 600px !important;
//             height: 300px !important;
//           }
//         `}</style>
//       </div>
//     );
//   }

//   // Render the form for selecting phones and months
//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#181b23] via-[#23243a] to-[#0a0c23] px-4 py-12">
//       <div className="bg-[#0a0c23] rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center mb-8 border border-[#23243a]">
//         <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//           <span role='img' aria-label='Chart'>📈</span> Generate Custom Report
//         </h2>
//         <form ref={formRef} className="w-full flex flex-col gap-4" onSubmit={handleGenerateReport}>
//           <label className="font-semibold text-blue-200">Select Phone Models</label>
//           <Select
//             isMulti
//             options={getPhoneModels().map((p) => ({ value: p, label: p }))}
//             value={selectedPhones}
//             onChange={handlePhoneChange}
//             placeholder="Choose phone models..."
//             className="mb-2"
//             styles={{
//               control: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 borderColor: '#23243a',
//                 color: '#fff',
//                 '&:hover': { borderColor: '#4f46e5' }
//               }),
//               menu: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 color: '#fff'
//               }),
//               option: (base, { isFocused, isSelected }) => ({
//                 ...base,
//                 backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
//                 color: '#fff',
//                 '&:active': { backgroundColor: '#6366f1' }
//               }),
//               multiValue: (base) => ({
//                 ...base,
//                 backgroundColor: '#4f46e5'
//               }),
//               multiValueLabel: (base) => ({
//                 ...base,
//                 color: '#fff'
//               }),
//               multiValueRemove: (base) => ({
//                 ...base,
//                 color: '#fff',
//                 '&:hover': { backgroundColor: '#6366f1' }
//               }),
//               placeholder: (base) => ({
//                 ...base,
//                 color: '#93c5fd'
//               }),
//               input: (base) => ({
//                 ...base,
//                 color: '#fff'
//               })
//             }}
//           />
//           <label className="font-semibold text-blue-200">Select Months</label>
//           <Select
//             isMulti
//             options={getMonths().map((m) => ({ value: m, label: m }))}
//             value={selectedMonths}
//             onChange={handleMonthChange}
//             placeholder="Choose months..."
//             className="mb-2"
//             styles={{
//               control: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 borderColor: '#23243a',
//                 color: '#fff',
//                 '&:hover': { borderColor: '#4f46e5' }
//               }),
//               menu: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 color: '#fff'
//               }),
//               option: (base, { isFocused, isSelected }) => ({
//                 ...base,
//                 backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
//                 color: '#fff',
//                 '&:active': { backgroundColor: '#6366f1' }
//               }),
//               multiValue: (base) => ({
//                 ...base,
//                 backgroundColor: '#4f46e5'
//               }),
//               multiValueLabel: (base) => ({
//                 ...base,
//                 color: '#fff'
//               }),
//               multiValueRemove: (base) => ({
//                 ...base,
//                 color: '#fff',
//                 '&:hover': { backgroundColor: '#6366f1' }
//               }),
//               placeholder: (base) => ({
//                 ...base,
//                 color: '#93c5fd'
//               }),
//               input: (base) => ({
//                 ...base,
//                 color: '#fff'
//               })
//             }}
//           />
//           <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Generate Report</button>
//         </form>
//         <button
//           className="mt-4 text-xs text-blue-400 underline"
//           onClick={() => setShowDebug((v) => !v)}
//         >
//           {showDebug ? 'Hide' : 'Show'} Debug Data
//         </button>
//         {showDebug && (
//           <DebugTable data={data} />
//         )}
//       </div>
//       {/* Optionally, show default charts here or instructions */}
//     </div>
//   );
// }

// // Move DebugTable to a top-level component
// function DebugTable({ data }: { data: unknown }) {
//   return (
//     <div className="mt-4 p-2 bg-[#181b23] rounded text-xs max-h-96 overflow-auto w-full text-left text-white border border-[#23243a]">
//       <table className="min-w-full border border-gray-300">
//         <thead className="bg-gray-800 sticky top-0">
//           <tr>
//             <th className="px-2 py-1 border-b border-gray-300 text-left">Key</th>
//             <th className="px-2 py-1 border-b border-gray-300 text-left">Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data && typeof data === 'object' && data !== null && Object.entries(data as Record<string, unknown>).map(([key, value]) => (
//             <tr key={key} className="border-b border-gray-700 align-top">
//               <td className="px-2 py-1 font-semibold text-blue-300 align-top">{key}</td>
//               <td className="px-2 py-1 align-top whitespace-pre-wrap break-all text-white">
//                 {Array.isArray(value) ? (
//                   <div className="overflow-x-auto max-h-40">
//                     <table className="min-w-full border border-gray-700 text-xs">
//                       <thead className="bg-gray-900">
//                         <tr>
//                           {value.length > 0 && typeof value[0] === 'object'
//                             ? Object.keys(value[0]).map((col) => (
//                                 <th key={col} className="px-1 py-0.5 border-b border-gray-700 text-left">{col}</th>
//                               ))
//                             : <th className="px-1 py-0.5 border-b border-gray-700 text-left">Value</th>}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {value.length > 0 && typeof value[0] === 'object'
//                           ? value.map((row, i) => (
//                               <tr key={i} className="border-b border-gray-800">
//                                 {Object.values(row).map((cell, j) => (
//                                   <td key={j} className="px-1 py-0.5 align-top border-b border-gray-800 text-white">{String(cell)}</td>
//                                 ))}
//                               </tr>
//                             ))
//                           : value.map((v, i) => (
//                               <tr key={i} className="border-b border-gray-800">
//                                 <td className="px-1 py-0.5 align-top border-b border-gray-800 text-white">{String(v)}</td>
//                               </tr>
//                             ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : typeof value === 'object' && value !== null ? (
//                   <div className="overflow-x-auto max-h-40">
//                     <table className="min-w-full border border-gray-700 text-xs">
//                       <tbody>
//                         {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
//                           <tr key={k} className="border-b border-gray-800">
//                             <td className="px-1 py-0.5 font-semibold text-blue-300 align-top">{k}</td>
//                             <td className="px-1 py-0.5 align-top text-white">{String(v)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : String(value)}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }




















// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
// import Select from 'react-select';
// import AnalyticsSection from './AnalyticsSection';
// import GlobalAnalyticsSection from './GlobalAnalyticsSection';
// import Loading from '../component/Loading';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// interface OptionType {
//   value: string;
//   label: string;
// }
// interface FeatureSummary {
//   feature: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
//   Brand?: string;
// }
// interface OverallSummary {
//   sentiment: string;
//   count: number;
//   'Product Name': string;
//   Month?: string;
//   Brand?: string;
// }
// interface BrandSummary {
//   Brand: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface ProductSummary {
//   'Product Name': string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   Month?: string;
//   Brand?: string;
// }
// interface RatingSummary {
//   Rating: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface PlatformSummary {
//   Platform: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface GenderSummary {
//   Gender: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface VerifiedSummary {
//   'Verified Purchase': string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface AgeSummary {
//   Age: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface SentimentData {
//   feature_summary?: FeatureSummary[];
//   overall_summary?: OverallSummary[];
//   sentiment_by_brand?: BrandSummary[];
//   sentiment_by_product?: ProductSummary[];
//   sentiment_by_rating?: RatingSummary[];
//   sentiment_by_platform?: PlatformSummary[];
//   sentiment_by_gender?: GenderSummary[];
//   sentiment_by_verified?: VerifiedSummary[];
//   sentiment_by_age?: AgeSummary[];
// }
// interface FilteredPhoneData {
//   phone: string;
//   feature_summary: FeatureSummary[];
//   overall_summary: OverallSummary[];
//   sentiment_by_brand: BrandSummary[];
//   sentiment_by_product: ProductSummary[];
//   sentiment_by_rating: RatingSummary[];
//   sentiment_by_platform: PlatformSummary[];
//   sentiment_by_gender: GenderSummary[];
//   sentiment_by_verified: VerifiedSummary[];
//   sentiment_by_age: AgeSummary[];
// }

// export default function ResultsPage() {
//   const [data, setData] = useState<SentimentData | null>(null);
//   const [selectedPhones, setSelectedPhones] = useState<OptionType[]>([]);
//   const [selectedMonths, setSelectedMonths] = useState<OptionType[]>([]);
//   const [filteredData, setFilteredData] = useState<FilteredPhoneData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showDebug, setShowDebug] = useState(false);
//   const formRef = useRef<HTMLFormElement>(null);
//   const chartRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
//   const [modalChart, setModalChart] = useState<React.ReactNode | null>(null);
//   const reportRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem('analysis');
//       if (stored) setData(JSON.parse(stored));
//       setLoading(false);
//     } catch {
//       setError('Failed to load analysis data. Please upload a file again.');
//       setLoading(false);
//     }
//   }, []);

//   function getFullPhoneName(brand?: string, productName?: string) {
//     if (!productName) return '';
//     return `${brand ? brand + ' ' : ''}${productName}`.trim();
//   }

//   const getPhoneModels = (): string[] => {
//     if (!data?.sentiment_by_product) return [];
//     return Array.from(
//       new Set(
//         data.sentiment_by_product.map((d) => getFullPhoneName(d['Brand'], d['Product Name']))
//       )
//     ).filter((v) => v && v.trim() !== '');
//   };

//   const getMonths = (): string[] => {
//     if (!data?.sentiment_by_product) return [];
//     const monthSet = new Set(
//       data.sentiment_by_product
//         .map((d) => d['Month'])
//         .filter((m): m is string => typeof m === 'string' && m.length === 7)
//         .map((ym) => {
//           const [year, month] = ym.split('-');
//           const date = new Date(Number(year), Number(month) - 1);
//           return date.toLocaleString('default', { month: 'long', year: 'numeric' });
//         })
//     );
//     return Array.from(monthSet);
//   };

//   const handlePhoneChange = (newValue: readonly OptionType[]) => setSelectedPhones([...newValue]);
//   const handleMonthChange = (newValue: readonly OptionType[]) => setSelectedMonths([...newValue]);

//   const filterData = () => {
//     if (!data) return [];
//     const phones = selectedPhones.map((p) => p.value);
//     const months = selectedMonths.map((m) => m.value);
//     function matchPhone(d: { Brand?: string; 'Product Name'?: string }, phone: string) {
//       const dBrand = d['Brand'] || '';
//       const dModel = d['Product Name'] || '';
//       return getFullPhoneName(dBrand, dModel) === phone;
//     }
//     function matchMonth(d: { Month?: string }) {
//       if (!months.length) return true;
//       const ym = d['Month'];
//       if (!ym || typeof ym !== 'string') return false;
//       const [year, month] = ym.split('-');
//       const dateStr = new Date(Number(year), Number(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
//       return months.includes(dateStr);
//     }
//     return phones.map((phone) => ({
//       phone,
//       feature_summary: data.feature_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       overall_summary: data.overall_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_brand: data.sentiment_by_brand?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_product: data.sentiment_by_product?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_rating: data.sentiment_by_rating?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_platform: data.sentiment_by_platform?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_gender: data.sentiment_by_gender?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_verified: data.sentiment_by_verified?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_age: data.sentiment_by_age?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//     }));
//   };

//   const handleGenerateReport = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const filtered = filterData();
//     localStorage.setItem('filtered_analysis', JSON.stringify(filtered));
//     window.open('/results?filtered=1', '_blank');
//   };

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const params = new URLSearchParams(window.location.search);
//         if (params.get('filtered')) {
//           const stored = localStorage.getItem('filtered_analysis');
//           if (stored) setFilteredData(JSON.parse(stored));
//         }
//       } catch {
//         setError('Failed to load filtered report. Please try again.');
//       }
//     }
//   }, []);

//   function aggregateByKey<T extends { POSITIVE: number; NEGATIVE: number }>(arr: T[], key: keyof T): T[] {
//     const map = new Map<string, T>();
//     arr.forEach((item) => {
//       const k = item[key];
//       if (k === undefined || k === null || k === '') return;
//       const kStr = k.toString();
//       if (!map.has(kStr)) {
//         map.set(kStr, { ...item, [key]: kStr });
//       } else {
//         const existing = map.get(kStr)!;
//         existing.POSITIVE = (existing.POSITIVE || 0) + (item.POSITIVE || 0);
//         existing.NEGATIVE = (existing.NEGATIVE || 0) + (item.NEGATIVE || 0);
//       }
//     });
//     return Array.from(map.values());
//   }

//     const handleDownloadPDF = async () => {
//     if (reportRef.current) {
//       const element = reportRef.current;
//       const canvas = await html2canvas(element, { scale: 2 });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = pageWidth;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let position = 0;
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       let remainingHeight = imgHeight - pageHeight;
//       while (remainingHeight > 0) {
//         position -= pageHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         remainingHeight -= pageHeight;
//       }
//       pdf.save('Sentiment-Analysis-Report.pdf');
//     }
//   };

//   const handleDownloadCSV = () => {
//     const csvRows: string[] = [];
//     filteredData.forEach((phoneData) => {
//       csvRows.push(`### Analysis for ${phoneData.phone} ###`);
//       const sections: { name: string; data: any[] }[] = [
//         { name: 'Feature Summary', data: phoneData.feature_summary },
//         { name: 'Overall Summary', data: phoneData.overall_summary },
//         { name: 'Sentiment by Brand', data: phoneData.sentiment_by_brand },
//         { name: 'Sentiment by Product', data: phoneData.sentiment_by_product },
//         { name: 'Sentiment by Rating', data: phoneData.sentiment_by_rating },
//         { name: 'Sentiment by Platform', data: phoneData.sentiment_by_platform },
//         { name: 'Sentiment by Gender', data: phoneData.sentiment_by_gender },
//         { name: 'Sentiment by Verified Purchase', data: phoneData.sentiment_by_verified },
//         { name: 'Sentiment by Age', data: phoneData.age_by_sentiment },
//       ];
//       sections.forEach((section) => {
//         if (!section.data) return;
//         csvRows.push(`## ${section.name} ##`);
//         const headers = section.data.length > 0 ? Object.keys(section.data[0]) : [];
//         if (headers.length === 0) return;
//         csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));
//         section.data.forEach((item) => {
//           const row = headers.map((header) => {
//             const value = item[header] ?? '';
//             return `"${String(value).replace(/"/g, '""')}"`;
//           });
//           csvRows.push(row.join(','));
//         });
//         csvRows.push('');
//       });
//     });
//     const csvContent = csvRows.join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'Sentiment-Analysis-Data.csv';
//     a.click();
//     URL.revokeObjectURL(url);
//   };
//   const closeModal = () => setModalChart(null);

//   if (loading) return <Loading />;

//   if (error)
//     return (
//       <>
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//         <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//           <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
//             <span role="img" aria-label="Error">
//               ❌
//             </span>{' '}
//             Error
//           </h2>
//           <p className="text-gray-600 text-center">{error}</p>
//           <button
//             className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//             onClick={() => (window.location.href = '/upload')}
//           >
//             Go to Upload
//           </button>
//         </div>
//       </div>
//       </>
//     );

//   if (!data && !filteredData.length)
//     return (
//       <>
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//         <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//             <span role="img" aria-label="Chart">
//               📈
//             </span>{' '}
//             No analysis data found.
//           </h2>
//           <p className="text-gray-600 text-center">Please upload a file first.</p>
//           <button
//             className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//             onClick={() => (window.location.href = '/upload')}
//           >
//             Go to Upload
//           </button>
//         </div>
//       </div>
//       </>
//     );

//   if (filteredData.length) {
//     return (
//       <>
//       <div
//         className="flex flex-col items-center min-h-screen px-4 py-12"
//         style={{ background: 'radial-gradient(ellipse at 50% 40%, #17213a 0%, #0a0c23 100%)' }}
//       >
//         <div className="bg-[#0a0c23] rounded-2xl shadow-2xl p-8 w-full max-w-4xl flex flex-col items-center border border-[#23243a]">
//           <div className="flex justify-end w-full mb-4 space-x-4">
//             <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
//               Download PDF
//             </button>
//             <button onClick={handleDownloadCSV} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
//               Download CSV
//             </button>
//           </div>
//           <div className="w-full">
//             <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
//               <span role="img" aria-label="Chart">
//                 📈
//               </span>{' '}
//               Filtered Analysis Results
//             </h2>
//             {filteredData.map((phoneData) => (
//               <div key={phoneData.phone} className="w-full mb-12">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                   {phoneData.feature_summary?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       ref={(el) => (chartRefs.current[`${phoneData.phone}-feature`] = el)}
//                       onClick={() =>
//                         setModalChart(
//                           <BarChart width={800} height={400} data={aggregateByKey(phoneData.feature_summary, 'feature')}>
//                             <XAxis dataKey="feature" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         )
//                       }
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>📊</span> Feature-wise Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.feature_summary, 'feature')}>
//                           <XAxis dataKey="feature" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                   {phoneData.overall_summary?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       ref={(el) => (chartRefs.current[`${phoneData.phone}-monthly`] = el)}
//                       onClick={() =>
//                         setModalChart(
//                           (() => {
//                             const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
//                             phoneData.overall_summary.forEach((d) => {
//                               if (!d.Month) return;
//                               if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
//                               if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
//                               if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
//                             });
//                             const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
//                             const displayData = data.map((d) => {
//                               const [year, month] = d.Month.split('-');
//                               const date = new Date(Number(year), Number(month) - 1);
//                               return {
//                                 ...d,
//                                 label: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
//                               };
//                             });
//                             return (
//                               <LineChart width={800} height={400} data={displayData}>
//                                 <XAxis dataKey="label" stroke="#fff" />
//                                 <YAxis stroke="#fff" />
//                                 <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                 <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                                 <Line type="monotone" dataKey="POSITIVE" stroke="#22c55e" name="Positive" strokeWidth={3} />
//                                 <Line type="monotone" dataKey="NEGATIVE" stroke="#ef4444" name="Negative" strokeWidth={3} />
//                               </LineChart>
//                             );
//                           })()
//                         )
//                       }
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>📈</span> Monthly Sentiment Trend for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         {(() => {
//                           const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
//                           phoneData.overall_summary.forEach((d) => {
//                             if (!d.Month) return;
//                             if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
//                             if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
//                             if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
//                           });
//                           const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
//                           const displayData = data.map((d) => {
//                             const [year, month] = d.Month.split('-');
//                             const date = new Date(Number(year), Number(month) - 1);
//                             return {
//                               ...d,
//                               label: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
//                             };
//                           });
//                           return (
//                             <LineChart width={300} height={200} data={displayData}>
//                               <XAxis dataKey="label" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Line type="monotone" dataKey="POSITIVE" stroke="#22c55e" name="Positive" strokeWidth={3} />
//                               <Line type="monotone" dataKey="NEGATIVE" stroke="#ef4444" name="Negative" strokeWidth={3} />
//                             </LineChart>
//                           );
//                         })()}
//                       </div>
//                     </div>
//                   )}
//                   {phoneData.overall_summary?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       ref={(el) => (chartRefs.current[`${phoneData.phone}-overall`] = el)}
//                       onClick={() =>
//                         setModalChart(
//                           (() => {
//                             const agg = phoneData.overall_summary.reduce(
//                               (acc, cur) => {
//                                 if (cur.sentiment === 'POSITIVE') acc.POSITIVE += cur.count;
//                                 if (cur.sentiment === 'NEGATIVE') acc.NEGATIVE += cur.count;
//                                 return acc;
//                               },
//                               { POSITIVE: 0, NEGATIVE: 0 }
//                             );
//                             const pieData = [
//                               { name: 'Positive', value: agg.POSITIVE },
//                               { name: 'Negative', value: agg.NEGATIVE },
//                             ];
//                             return (
//                               <PieChart width={600} height={400}>
//                                 <Pie data={pieData} cx={300} cy={200} outerRadius={150} label dataKey="value">
//                                   <Cell fill="#82ca9d" />
//                                   <Cell fill="#ff7f7f" />
//                                 </Pie>
//                                 <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               </PieChart>
//                             );
//                           })()
//                         )
//                       }
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>🧠</span> Overall Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto flex justify-center">
//                         {(() => {
//                           const agg = phoneData.overall_summary.reduce(
//                             (acc, cur) => {
//                               if (cur.sentiment === 'POSITIVE') acc.POSITIVE += cur.count;
//                               if (cur.sentiment === 'NEGATIVE') acc.NEGATIVE += cur.count;
//                               return acc;
//                             },
//                             { POSITIVE: 0, NEGATIVE: 0 }
//                           );
//                           const pieData = [
//                             { name: 'Positive', value: agg.POSITIVE },
//                             { name: 'Negative', value: agg.NEGATIVE },
//                           ];
//                           return (
//                             <PieChart width={300} height={200}>
//                               <Pie data={pieData} cx={150} cy={100} outerRadius={80} label dataKey="value">
//                                 <Cell fill="#82ca9d" />
//                                 <Cell fill="#ff7f7f" />
//                               </Pie>
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             </PieChart>
//                           );
//                         })()}
//                       </div>
//                     </div>
//                   )}
//                   {phoneData.sentiment_by_brand?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       ref={(el) => (chartRefs.current[`${phoneData.phone}-brand`] = el)}
//                       onClick={() =>
//                         setModalChart(
//                           <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_brand, 'Brand')}>
//                             <XAxis dataKey="Brand" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         )
//                       }
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>🏷️</span> Sentiment by Brand for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_brand, 'Brand')}>
//                           <XAxis dataKey="Brand" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                   {phoneData.sentiment_by_product?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       ref={(el) => (chartRefs.current[`${phoneData.phone}-product`] = el)}
//                       onClick={() =>
//                         setModalChart(
//                           <BarChart
//                             width={800}
//                             height={400}
//                             data={aggregateByKey(phoneData.sentiment_by_product, 'Product Name').map((p) => ({
//                               ...p,
//                               fullName: getFullPhoneName(p.Brand, p['Product Name']),
//                             }))}
//                           >
//                             <XAxis dataKey="fullName" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         )
//                       }
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>📱</span> Sentiment by Product for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart
//                           width={300}
//                           height={200}
//                           data={aggregateByKey(phoneData.sentiment_by_product, 'Product Name').map((p) => ({
//                             ...p,
//                             fullName: getFullPhoneName(p.Brand, p['Product Name']),
//                           }))}
//                         >
//                           <XAxis dataKey="fullName" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                   {phoneData.sentiment_by_rating?.length > 0 &&
//                     (() => {
//                       const hasValid = phoneData.sentiment_by_rating.some((v) => v.Rating !== undefined && v.Rating !== null && v.Rating !== '');
//                       if (!hasValid) return null;
//                       const chartData = aggregateByKey(phoneData.sentiment_by_rating, 'Rating')
//                         .map((v) => ({
//                           ...v,
//                           Rating: v.Rating?.toString() ?? '',
//                         }))
//                         .filter((v) => v.Rating !== '')
//                         .sort((a, b) => {
//                           const na = Number(a.Rating),
//                             nb = Number(b.Rating);
//                           if (!isNaN(na) && !isNaN(nb)) return na - nb;
//                           return a.Rating.localeCompare(b.Rating);
//                         });
//                       return (
//                         <div
//                           className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                           ref={(el) => (chartRefs.current[`${phoneData.phone}-rating`] = el)}
//                           onClick={() =>
//                             setModalChart(
//                               <BarChart width={800} height={400} data={chartData}>
//                                 <XAxis dataKey="Rating" stroke="#fff" />
//                                 <YAxis stroke="#fff" />
//                                 <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                 <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                                 <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                                 <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                               </BarChart>
//                             )
//                           }
//                         >
//                           <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                             <span>⭐</span> Sentiment by Rating for <span className="text-blue-300">{phoneData.phone}</span>
//                           </h4>
//                           <div className="overflow-x-auto">
//                             <BarChart width={300} height={200} data={chartData}>
//                               <XAxis dataKey="Rating" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                               <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                             </BarChart>
//                           </div>
//                         </div>
//                       );
//                     })()}
//                   {phoneData.sentiment_by_verified?.length > 0 &&
//                     (() => {
//                       const hasValid = phoneData.sentiment_by_verified.some((v) => v['Verified Purchase'] !== undefined && v['Verified Purchase'] !== null && v['Verified Purchase'] !== '');
//                       if (!hasValid) return null;
//                       const chartData = aggregateByKey(phoneData.sentiment_by_verified, 'Verified Purchase')
//                         .map((v) => ({
//                           ...v,
//                           ['Verified Purchase']: v['Verified Purchase']?.toString() ?? '',
//                         }))
//                         .filter((v) => v['Verified Purchase'] !== '')
//                         .sort((a, b) => {
//                           if (a['Verified Purchase'] === 'Yes' && b['Verified Purchase'] === 'No') return -1;
//                           if (a['Verified Purchase'] === 'No' && b['Verified Purchase'] === 'Yes') return 1;
//                           return a['Verified Purchase'].localeCompare(b['Verified Purchase']);
//                         });
//                       return (
//                         <div
//                           className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                           ref={(el) => (chartRefs.current[`${phoneData.phone}-verified`] = el)}
//                           onClick={() =>
//                             setModalChart(
//                               <BarChart width={800} height={400} data={chartData}>
//                                 <XAxis dataKey="Verified Purchase" stroke="#fff" />
//                                 <YAxis stroke="#fff" />
//                                 <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                 <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                                 <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                                 <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                               </BarChart>
//                             )
//                           }
//                         >
//                           <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                             <span>✅</span> Sentiment by Verified Purchase for <span className="text-blue-300">{phoneData.phone}</span>
//                           </h4>
//                           <div className="overflow-x-auto">
//                             <BarChart width={300} height={200} data={chartData}>
//                               <XAxis dataKey="Verified Purchase" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                               <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                             </BarChart>
//                           </div>
//                         </div>
//                       );
//                     })()}
//                   {phoneData.sentiment_by_age?.length > 0 && (
//                     <div
//                       className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                       ref={(el) => (chartRefs.current[`${phoneData.phone}-age`] = el)}
//                       onClick={() =>
//                         setModalChart(
//                           <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_age, 'Age')}>
//                             <XAxis dataKey="Age" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                             <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                           </BarChart>
//                         )
//                       }
//                     >
//                       <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                         <span>🎂</span> Sentiment by Age for <span className="text-blue-300">{phoneData.phone}</span>
//                       </h4>
//                       <div className="overflow-x-auto">
//                         <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_age, 'Age')}>
//                           <XAxis dataKey="Age" stroke="#fff" />
//                           <YAxis stroke="#fff" />
//                           <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                           <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                           <Bar dataKey="POSITIVE" fill="#82ca9d" />
//                           <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
//                         </BarChart>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <AnalyticsSection phoneData={phoneData} />
//               </div>
//             ))}
//             <GlobalAnalyticsSection data={data!} selectedPhoneNames={filteredData.map((fd) => fd.phone)} />
//           </div>
//         </div>
//         {modalChart && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-[#0a0c23] rounded-2xl p-8 max-w-4xl w-full border border-[#23243a] relative">
//               <button className="absolute top-4 right-4 text-white text-xl font-bold hover:text-blue-300" onClick={closeModal}>
//                 ×
//               </button>
//               <div className="flex justify-center">{modalChart}</div>
//             </div>
//           </div>
//         )}
//       </div>
//       </>
//     );
//   }

//   return (
//     <>
//     <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#181b23] via-[#23243a] to-[#0a0c23] px-4 py-12">
//       <div className="bg-[#0a0c23] rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center mb-8 border border-[#23243a]">
//         <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
//           <span role="img" aria-label="Chart">
//             📈
//           </span>{' '}
//           Generate Custom Report
//         </h2>
//         <form ref={formRef} className="w-full flex flex-col gap-4" onSubmit={handleGenerateReport}>
//           <label className="font-semibold text-blue-200">Select Phone Models</label>
//           <Select
//             isMulti
//             options={getPhoneModels().map((p) => ({ value: p, label: p }))}
//             value={selectedPhones}
//             onChange={handlePhoneChange}
//             placeholder="Choose phone models..."
//             className="mb-2"
//             styles={{
//               control: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 borderColor: '#23243a',
//                 color: '#fff',
//                 '&:hover': { borderColor: '#4f46e5' },
//               }),
//               menu: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 color: '#fff',
//               }),
//               option: (base, { isFocused, isSelected }) => ({
//                 ...base,
//                 backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
//                 color: '#fff',
//                 '&:active': { backgroundColor: '#6366f1' },
//               }),
//               multiValue: (base) => ({
//                 ...base,
//                 backgroundColor: '#4f46e5',
//               }),
//               multiValueLabel: (base) => ({
//                 ...base,
//                 color: '#fff',
//               }),
//               multiValueRemove: (base) => ({
//                 ...base,
//                 color: '#fff',
//                 '&:hover': { backgroundColor: '#6366f1' },
//               }),
//               placeholder: (base) => ({
//                 ...base,
//                 color: '#93c5fd',
//               }),
//               input: (base) => ({
//                 ...base,
//                 color: '#fff',
//               }),
//             }}
//           />
//           <label className="font-semibold text-blue-200">Select Months</label>
//           <Select
//             isMulti
//             options={getMonths().map((m) => ({ value: m, label: m }))}
//             value={selectedMonths}
//             onChange={handleMonthChange}
//             placeholder="Choose months..."
//             className="mb-2"
//             styles={{
//               control: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 borderColor: '#23243a',
//                 color: '#fff',
//                 '&:hover': { borderColor: '#4f46e5' },
//               }),
//               menu: (base) => ({
//                 ...base,
//                 backgroundColor: '#181b23',
//                 color: '#fff',
//               }),
//               option: (base, { isFocused, isSelected }) => ({
//                 ...base,
//                 backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
//                 color: '#fff',
//                 '&:active': { backgroundColor: '#6366f1' },
//               }),
//               multiValue: (base) => ({
//                 ...base,
//                 backgroundColor: '#4f46e5',
//               }),
//               multiValueLabel: (base) => ({
//                 ...base,
//                 color: '#fff',
//               }),
//               multiValueRemove: (base) => ({
//                 ...base,
//                 color: '#fff',
//                 '&:hover': { backgroundColor: '#6366f1' },
//               }),
//               placeholder: (base) => ({
//                 ...base,
//                 color: '#93c5fd',
//               }),
//               input: (base) => ({
//                 ...base,
//                 color: '#fff',
//               }),
//             }}
//           />
//           <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
//             Generate Report
//           </button>
//         </form>
//         <button className="mt-4 text-xs text-blue-400 underline" onClick={() => setShowDebug((v) => !v)}>
//           {showDebug ? 'Hide' : 'Show'} Debug Data
//         </button>
//         {showDebug && <DebugTable data={data} />}
//       </div>
//     </div>
//     </>
//   );
// }

// function DebugTable({ data }: { data: unknown }) {
//   return (
//     <>
//     <div className="mt-4 p-2 bg-[#181b23] rounded text-xs max-h-96 overflow-auto w-full text-left text-white border border-[#23243a]">
//       <table className="min-w-full border border-gray-300">
//         <thead className="bg-gray-800 sticky top-0">
//           <tr>
//             <th className="px-2 py-1 border-b border-gray-300 text-left">Key</th>
//             <th className="px-2 py-1 border-b border-gray-300 text-left">Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data &&
//             typeof data === 'object' &&
//             data !== null &&
//             Object.entries(data as Record<string, unknown>).map(([key, value]) => (
//               <tr key={key} className="border-b border-gray-700 align-top">
//                 <td className="px-2 py-1 font-semibold text-blue-300 align-top">{key}</td>
//                 <td className="px-2 py-1 align-top whitespace-pre-wrap break-all text-white">
//                   {Array.isArray(value) ? (
//                     <div className="overflow-x-auto max-h-40">
//                       <table className="min-w-full border border-gray-700 text-xs">
//                         <thead className="bg-gray-900">
//                           <tr>
//                             {value.length > 0 && typeof value[0] === 'object' ? (
//                               Object.keys(value[0]).map((col) => (
//                                 <th key={col} className="px-1 py-0.5 border-b border-gray-700 text-left">
//                                   {col}
//                                 </th>
//                               ))
//                             ) : (
//                               <th className="px-1 py-0.5 border-b border-gray-700 text-left">Value</th>
//                             )}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {value.length > 0 && typeof value[0] === 'object'
//                             ? value.map((row, i) => (
//                                 <tr key={i} className="border-b border-gray-800">
//                                   {Object.values(row).map((cell, j) => (
//                                     <td key={j} className="px-1 py-0.5 align-top border-b border-gray-800 text-white">
//                                       {String(cell)}
//                                     </td>
//                                   ))}
//                                 </tr>
//                               ))
//                             : value.map((v, i) => (
//                                 <tr key={i} className="border-b border-gray-800">
//                                   <td className="px-1 py-0.5 align-top border-b border-gray-800 text-white">{String(v)}</td>
//                                 </tr>
//                               ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : typeof value === 'object' && value !== null ? (
//                     <div className="overflow-x-auto max-h-40">
//                       <table className="min-w-full border border-gray-700 text-xs">
//                         <tbody>
//                           {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
//                             <tr key={k} className="border-b border-gray-800">
//                               <td className="px-1 py-0.5 font-semibold text-blue-300 align-top">{k}</td>
//                               <td className="px-1 py-0.5 align-top text-white">{String(v)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     String(value)
//                   )}
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//     </>
//   );
// }







// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
// import Select from 'react-select';
// import AnalyticsSection from './AnalyticsSection';
// import GlobalAnalyticsSection from './GlobalAnalyticsSection';
// import Loading from '../component/Loading';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// interface OptionType {
//   value: string;
//   label: string;
// }
// interface FeatureSummary {
//   feature: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
//   Brand?: string;
// }
// interface OverallSummary {
//   sentiment: string;
//   count: number;
//   'Product Name': string;
//   Month?: string;
//   Brand?: string;
// }
// interface BrandSummary {
//   Brand: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface ProductSummary {
//   'Product Name': string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   Month?: string;
//   Brand?: string;
// }
// interface RatingSummary {
//   Rating: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface PlatformSummary {
//   Platform: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface GenderSummary {
//   Gender: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface VerifiedSummary {
//   'Verified Purchase': string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface AgeSummary {
//   Age: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   'Product Name': string;
//   Month?: string;
// }
// interface SentimentData {
//   feature_summary?: FeatureSummary[];
//   overall_summary?: OverallSummary[];
//   sentiment_by_brand?: BrandSummary[];
//   sentiment_by_product?: ProductSummary[];
//   sentiment_by_rating?: RatingSummary[];
//   sentiment_by_platform?: PlatformSummary[];
//   sentiment_by_gender?: GenderSummary[];
//   sentiment_by_verified?: VerifiedSummary[];
//   sentiment_by_age?: AgeSummary[];
// }
// interface FilteredPhoneData {
//   phone: string;
//   feature_summary: FeatureSummary[];
//   overall_summary: OverallSummary[];
//   sentiment_by_brand: BrandSummary[];
//   sentiment_by_product: ProductSummary[];
//   sentiment_by_rating: RatingSummary[];
//   sentiment_by_platform: PlatformSummary[];
//   sentiment_by_gender: GenderSummary[];
//   sentiment_by_verified: VerifiedSummary[];
//   sentiment_by_age: AgeSummary[];
// }

// export default function ResultsPage() {
//   const [data, setData] = useState<SentimentData | null>(null);
//   const [selectedPhones, setSelectedPhones] = useState<OptionType[]>([]);
//   const [selectedMonths, setSelectedMonths] = useState<OptionType[]>([]);
//   const [filteredData, setFilteredData] = useState<FilteredPhoneData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showDebug, setShowDebug] = useState(false);
//   const formRef = useRef<HTMLFormElement>(null);
//   const chartRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
//   const reportRef = useRef<HTMLDivElement>(null);
//   const [modalChart, setModalChart] = useState<React.ReactNode | null>(null);

//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem('analysis');
//       if (stored) setData(JSON.parse(stored));
//       setLoading(false);
//     } catch {
//       setError('Failed to load analysis data. Please upload a file again.');
//       setLoading(false);
//     }
//   }, []);

//   function getFullPhoneName(brand?: string, productName?: string) {
//     if (!productName) return '';
//     return `${brand ? brand + ' ' : ''}${productName}`.trim();
//   }

//   const getPhoneNames = (): string[] => {
//     if (!data?.sentiment_by_product) return [];
//     return Array.from(
//       new Set(
//         data.sentiment_by_product.map((d) => getFullPhoneName(d['Brand'], d['Product Name']))
//       )
//     ).filter((v) => v && v.trim() !== '');
//   };

//   const getMonths = (): string[] => {
//     if (!data?.sentiment_by_product) return [];
//     const monthSet = new Set(
//       data.sentiment_by_product
//         .map((d) => d['Month'])
//         .filter((m): m is string => typeof m === 'string' && m.length === 7)
//         .map((ym) => {
//           const [year, month] = ym.split('-');
//           const date = new Date(Number(year), Number(month) - 1);
//           return date.toLocaleString('en', { month: 'long', year: 'numeric' });
//         })
//     );
//     return Array.from(monthSet);
//   };

//   const handlePhoneChange = (newValue: readonly OptionType[]) => setSelectedPhones([...newValue]);
//   const handleMonthChange = (newValue: readonly OptionType[]) => setSelectedMonths([...newValue]);

//   const filterData = () => {
//     if (!data) return [];
//     const phones = selectedPhones.map((p) => p.value);
//     const months = selectedMonths.map((m) => m.value);
//     function matchPhone(d: { Brand?: string; 'Product Name'?: string }, phone: string) {
//       const dBrand = d['Brand'] || '';
//       const dModel = d['Product Name'] ?? '';
//       return getFullPhoneName(dBrand, dModel) === phone;
//     }
//     function matchMonth(d: { Month?: string }) {
//       if (!months.length) return true;
//       const ym = d['Month'];
//       if (!ym || typeof ym !== 'string') return false;
//       const [year, month] = ym.split('-');
//       const dateStr = new Date(Number(year), Number(month) - 1).toLocaleString('en', { month: 'long', year: 'numeric' });
//       return months.includes(dateStr);
//     }
//     return phones.map((phone) => ({
//       phone,
//       feature_summary: data.feature_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       overall_summary: data.overall_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_brand: data.sentiment_by_brand?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_product: data.sentiment_by_product?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_rating: data.sentiment_by_rating?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_platform: data.sentiment_by_platform?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_gender: data.sentiment_by_gender?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_verified: data.sentiment_by_verified?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//       sentiment_by_age: data.sentiment_by_age?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
//     }));
//   };

//   const handleGenerateReport = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const filtered = filterData();
//     localStorage.setItem('filtered_data', JSON.stringify(filtered));
//     window.open('/results?filtered=1', '_blank');
//   };

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const params = new URLSearchParams(window.location.search);
//         if (params.get('filtered')) {
//           const stored = localStorage.getItem('filtered_data');
//           if (stored) setFilteredData(JSON.parse(stored));
//         }
//       } catch {
//         setError('Failed to load filtered report.');
//       }
//     }
//   }, []);

//   function aggregateByKey<T extends { POSITIVE: number; NEGATIVE: number }>(arr: T[], key: keyof T): T[] {
//     const keyMap = new Map<string, T>();
//     arr.forEach((item) => {
//       const k = item[key];
//       if (k === undefined || k === null || k === '') return;
//       const kStr = k.toString();
//       if (!keyMap.has(kStr)) {
//         keyMap.set(kStr, { ...item });
//       } else {
//         const existing = keyMap.get(kStr)!;
//         existing.POSITIVE = (existing.POSITIVE || 0) + (item.POSITIVE || 0);
//         existing.NEGATIVE = (existing.NEGATIVE || 0) + (item.NEGATIVE || 0);
//       }
//     });
//     return Array.from(keyMap.values());
//   }

//   const handleDownloadPDF = async () => {
//     if (reportRef.current) {
//       const element = reportRef.current;
//       const canvas = await html2canvas(element, { scale: 2 });
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
//       const pageWidth = pdf.internal.pageSize.getWidth();
//       const pageHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = pageWidth;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let position = 0;
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       let remainingHeight = imgHeight - pageHeight;
//       while (remainingHeight > 0) {
//         position -= pageHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         remainingHeight -= pageHeight;
//       }
//       pdf.save('Sentiment-Analysis-Report.pdf');
//     }
//   };

//   const handleDownloadCSV = () => {
//     const csvRows: string[] = [];
//     filteredData.forEach((phoneData) => {
//       csvRows.push(`### Analysis for ${phoneData.phone} ###`);
//       const sections: { name: string; data: any[] }[] = [
//         { name: 'Feature Summary', data: phoneData.feature_summary },
//         { name: 'Overall Summary', data: phoneData.overall_summary },
//         { name: 'Sentiment by Brand', data: phoneData.sentiment_by_brand },
//         { name: 'Sentiment by Product', data: phoneData.sentiment_by_product },
//         { name: 'Sentiment by Rating', data: phoneData.sentiment_by_rating },
//         { name: 'Sentiment by Platform', data: phoneData.sentiment_by_platform },
//         { name: 'Sentiment by Gender', data: phoneData.sentiment_by_gender },
//         { name: 'Sentiment by Verified Purchase', data: phoneData.sentiment_by_verified },
//         { name: 'Sentiment by Age', data: phoneData.age_by_sentiment },
//       ];
//       sections.forEach((section) => {
//         if (!section.data) return;
//         csvRows.push(`## ${section.name} ##`);
//         const headers = section.data.length > 0 ? Object.keys(section.data[0]) : [];
//         if (headers.length === 0) return;
//         csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));
//         section.data.forEach((item) => {
//           const row = headers.map((header) => {
//             const value = item[header] ?? '';
//             return `"${String(value).replace(/"/g, '""')}"`;
//           });
//           csvRows.push(row.join(','));
//         });
//         csvRows.push('');
//       });
//     });
//     const csvContent = csvRows.join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'Sentiment-Analysis-Data.csv';
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const closeModal = () => setModalChart(null);

//   if (loading) {
//     return (
//       <>
//         <Loading />
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//           <div className="bg-blue-900 rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//             <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
//               <span role="img" aria-label="Error">❌</span> Error
//             </h2>
//             <p className="text-gray-600 text-center">{error}</p>
//             <button
//               className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//               onClick={() => (window.location.href = '/upload')}
//             >
//               Go to Upload
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (!data && !filteredData.length) {
//     return (
//       <>
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
//           <div className="bg-blue-950 rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//               <span role="img" aria-label="Chart">📈</span> No analysis data found.
//             </h2>
//             <p className="text-gray-600 text-center">Please upload a file first.</p>
//             <button
//               className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
//               onClick={() => (window.location.href = '/upload')}
//             >
//               Go to Upload
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (filteredData.length) {
//     return (
//       <>
//         <div
//           className="flex flex-col items-center min-h-screen px-4 py-12"
//           style={{ background: 'radial-gradient(ellipse at 50% 40%, #17213a 0%, #0a0c23 100%)' }}
//         >
//           <div className="bg-[#0a0c23] rounded-2xl shadow-2xl p-8 w-full max-w-4xl flex flex-col items-center border border-[#23243a]">
//             <div className="flex justify-end w-full mb-4 space-x-4">
//               <button onClick={handleDownloadPDF} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
//                 Download PDF
//               </button>
//               <button onClick={handleDownloadCSV} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
//                 Download CSV
//               </button>
//             </div>
//             <div className="w-full pdf-export" ref={reportRef}>
//               <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
//                 <span role="img" aria-label="Chart">📈</span> Filtered Analysis Results
//               </h2>
//               {filteredData.map((phoneData) => (
//                 <div key={phoneData.phone} className="w-full mb-12">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//                     {phoneData.feature_summary?.length > 0 && (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         ref={(el) => (chartRefs.current[`${phoneData.phone}-feature`] = el)}
//                         onClick={() =>
//                           setModalChart(
//                             <BarChart width={800} height={400} data={aggregateByKey(phoneData.feature_summary, 'feature')}>
//                               <XAxis dataKey="feature" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Bar dataKey="POSITIVE" fill="#FFD700" />
//                               <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                             </BarChart>
//                           )
//                         }
//                       >
//                         <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
//                           <span>📊</span> Feature-wise Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto">
//                           <BarChart width={300} height={200} data={aggregateByKey(phoneData.feature_summary, 'feature')}>
//                             <XAxis dataKey="feature" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#FFD700" />
//                             <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                           </BarChart>
//                         </div>
//                       </div>
//                     )}
//                     {phoneData.overall_summary?.length > 0 && (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         ref={(el) => (chartRefs.current[`${phoneData.phone}-monthly`] = el)}
//                         onClick={() =>
//                           setModalChart(
//                             (() => {
//                               const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
//                               phoneData.overall_summary.forEach((d) => {
//                                 if (!d.Month) return;
//                                 if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
//                                 if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
//                                 if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
//                               });
//                               const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
//                               const displayData = data.map((d) => {
//                                 const [year, month] = d.Month.split('-');
//                                 const date = new Date(Number(year), Number(month) - 1);
//                                 return {
//                                   ...d,
//                                   label: date.toLocaleString('en', { month: 'short', year: '2-digit' }),
//                                 };
//                               });
//                               return (
//                                 <LineChart width={800} height={400} data={displayData}>
//                                   <XAxis dataKey="label" stroke="#fff" />
//                                   <YAxis stroke="#fff" />
//                                   <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                   <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                                   <Line type="monotone" dataKey="POSITIVE" stroke="#FFD700" name="Positive" strokeWidth={3} />
//                                   <Line type="monotone" dataKey="NEGATIVE" stroke="#FF4500" name="Negative" strokeWidth={3} />
//                                 </LineChart>
//                               );
//                             })()
//                           )
//                         }
//                       >
//                         <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
//                           <span>📈</span> Monthly Sentiment Trend for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto">
//                           {(() => {
//                             const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
//                             phoneData.overall_summary.forEach((d) => {
//                               if (!d.Month) return;
//                               if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
//                               if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
//                               if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
//                             });
//                             const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
//                             const displayData = data.map((d) => {
//                               const [year, month] = d.Month.split('-');
//                               const date = new Date(Number(year), Number(month) - 1);
//                               return {
//                                 ...d,
//                                 label: date.toLocaleString('en', { month: 'short', year: '2-digit' }),
//                               };
//                             });
//                             return (
//                               <LineChart width={300} height={200} data={displayData}>
//                                 <XAxis dataKey="label" stroke="#fff" />
//                                 <YAxis stroke="#fff" />
//                                 <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                 <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                                 <Line type="monotone" dataKey="POSITIVE" stroke="#FFD700" name="Positive" strokeWidth={3} />
//                                 <Line type="monotone" dataKey="NEGATIVE" stroke="#FF4500" name="Negative" strokeWidth={3} />
//                               </LineChart>
//                             );
//                           })()}
//                         </div>
//                       </div>
//                     )}
//                     {phoneData.overall_summary?.length > 0 && (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         ref={(el) => (chartRefs.current[`${phoneData.phone}-overall`] = el)}
//                         onClick={() =>
//                           setModalChart(
//                             (() => {
//                               const agg = phoneData.overall_summary.reduce(
//                                 (acc, cur) => {
//                                   if (cur.sentiment === 'POSITIVE') acc.POSITIVE += cur.count;
//                                   if (cur.sentiment === 'NEGATIVE') acc.NEGATIVE += cur.count;
//                                   return acc;
//                                 },
//                                 { POSITIVE: 0, NEGATIVE: 0 }
//                               );
//                               const pieData = [
//                                 { name: 'Positive', value: agg.POSITIVE },
//                                 { name: 'Negative', value: agg.NEGATIVE },
//                               ];
//                               return (
//                                 <PieChart width={600} height={400}>
//                                   <Pie data={pieData} cx={300} cy={200} outerRadius={150} label dataKey="value">
//                                     <Cell fill="#FFD700" />
//                                     <Cell fill="#FF4500" />
//                                   </Pie>
//                                   <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                 </PieChart>
//                               );
//                             })()
//                           )
//                         }
//                       >
//                         <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
//                           <span>🧠</span> Overall Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto flex justify-center">
//                           {(() => {
//                             const agg = phoneData.overall_summary.reduce(
//                               (acc, cur) => {
//                                 if (cur.sentiment === 'POSITIVE') acc.POSITIVE += cur.count;
//                                 if (cur.sentiment === 'NEGATIVE') acc.NEGATIVE += cur.count;
//                                 return acc;
//                               },
//                               { POSITIVE: 0, NEGATIVE: 0 }
//                             );
//                             const pieData = [
//                               { name: 'Positive', value: agg.POSITIVE },
//                               { name: 'Negative', value: agg.NEGATIVE },
//                             ];
//                             return (
//                               <PieChart width={300} height={200}>
//                                 <Pie data={pieData} cx={150} cy={100} outerRadius={80} label dataKey="value">
//                                   <Cell fill="#FFD700" />
//                                   <Cell fill="#FF4500" />
//                                 </Pie>
//                                 <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               </PieChart>
//                             );
//                           })()}
//                         </div>
//                       </div>
//                     )}
//                     {phoneData.sentiment_by_brand?.length > 0 && (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         ref={(el) => (chartRefs.current[`${phoneData.phone}-brand`] = el)}
//                         onClick={() =>
//                           setModalChart(
//                             <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_brand, 'Brand')}>
//                               <XAxis dataKey="Brand" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Bar dataKey="POSITIVE" fill="#FFD700" />
//                               <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                             </BarChart>
//                           )
//                         }
//                       >
//                         <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
//                           <span>🏷️</span> Sentiment by Brand for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto">
//                           <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_brand, 'Brand')}>
//                             <XAxis dataKey="Brand" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#FFD700" />
//                             <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                           </BarChart>
//                         </div>
//                       </div>
//                     )}
//                     {phoneData.sentiment_by_product?.length > 0 && (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         ref={(el) => (chartRefs.current[`${phoneData.phone}-product`] = el)}
//                         onClick={() =>
//                           setModalChart(
//                             <BarChart
//                               width={800}
//                               height={400}
//                               data={aggregateByKey(phoneData.sentiment_by_product, 'Product Name').map((item) => ({
//                                 ...item,
//                                 fullName: getFullPhoneName(item['Brand'], item['Product Name']),
//                               }))}
//                             >
//                               <XAxis dataKey="fullName" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Bar dataKey="POSITIVE" fill="#FFD700" />
//                               <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                             </BarChart>
//                           )
//                         }
//                       >
//                         <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
//                           <span>📱</span> Sentiment by Product for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto">
//                           <BarChart
//                             width={300}
//                             height={200}
//                             data={aggregateByKey(phoneData.sentiment_by_product, 'Product Name').map((item) => ({
//                               ...item,
//                               fullName: getFullPhoneName(item['Brand'], item['Product Name']),
//                             }))}
//                           >
//                             <XAxis dataKey="fullName" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#FFD700" />
//                             <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                           </BarChart>
//                         </div>
//                       </div>
//                     )}
//                     {phoneData.sentiment_by_rating?.length > 0 && (
//                       (() => {
//                         const hasValid = phoneData.sentiment_by_rating.some(
//                           (item) => item.Rating !== undefined && item.Rating !== null && item.Rating !== ''
//                         );
//                         if (!hasValid) return null;
//                         const chartData = aggregateByKey(phoneData.sentiment_by_rating, 'Rating')
//                           .map((item) => ({
//                             ...item,
//                             Rating: item.Rating?.toString() ?? '',
//                           }))
//                           .filter((item) => item.Rating !== '')
//                           .sort((a, b) => {
//                             const na = Number(a.Rating);
//                             const nb = Number(b.Rating);
//                             if (!isNaN(na) && !isNaN(nb)) return na - nb;
//                             return a.Rating.localeCompare(b.Rating);
//                           });
//                         return (
//                           <>
//                             <div
//                               className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                               ref={(el) => (chartRefs.current[`${phoneData.phone}-rating`] = el)}
//                               onClick={() =>
//                                 setModalChart(
//                                   <BarChart width={800} height={400} data={chartData}>
//                                     <XAxis dataKey="Rating" stroke="#fff" />
//                                     <YAxis stroke="#fff" />
//                                     <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                     <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                                     <Bar dataKey="POSITIVE" fill="#FFD700" />
//                                     <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                                   </BarChart>
//                                 )
//                               }
//                             >
//                               <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
//                                 <span>⭐</span> Sentiment by Rating for <span className="text-blue-300">{phoneData.phone}</span>
//                               </h4>
//                               <div className="overflow-x-auto">
//                                 <BarChart width={300} height={200} data={chartData}>
//                                   <XAxis dataKey="Rating" stroke="#fff" />
//                                   <YAxis stroke="#fff" />
//                                   <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                   <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                                   <Bar dataKey="POSITIVE" fill="#FFD700" />
//                                   <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                                 </BarChart>
//                               </div>
//                             </div>
//                           </>
//                         );
//                       })()
//                     )}
//                     {phoneData.sentiment_by_verified?.length > 0 && (
//                       (() => {
//                         const hasValid = phoneData.sentiment_by_verified.some(
//                           (item) => item['Verified Purchase'] !== undefined && item['Verified Purchase'] !== null && item['Verified Purchase'] !== ''
//                         );
//                         if (!hasValid) return null;
//                         const chartData = aggregateByKey(phoneData.sentiment_by_verified, 'Verified Purchase')
//                           .map((item) => ({
//                             ...item,
//                             ['Verified Purchase']: item['Verified Purchase']?.toString() ?? '',
//                           }))
//                           .filter((item) => item['Verified Purchase'] !== '')
//                           .sort((a, b) => {
//                             if (a['Verified Purchase'] === 'Yes' && b['Verified Purchase'] === 'No') return -1;
//                             if (a['Verified Purchase'] === 'No' && b['Verified Purchase'] === 'Yes') return 1;
//                             return a['Verified Purchase'].localeCompare(b['Verified Purchase']);
//                           });
//                         return (
//                           <>
//                             <div
//                               className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                               ref={(el) => (chartRefs.current[`${phoneData.phone}-verified`] = el)}
//                               onClick={() =>
//                                 setModalChart(
//                                   <BarChart width={800} height={400} data={chartData}>
//                                     <XAxis dataKey="Verified Purchase" stroke="#fff" />
//                                     <YAxis stroke="#fff" />
//                                     <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                     <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                                     <Bar dataKey="POSITIVE" fill="#FFD700" />
//                                     <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                                   </BarChart>
//                                 )
//                               }
//                             >
//                               <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
//                                 <span>✅</span> Sentiment by Verified Purchase for <span className="text-blue-300">{phoneData.phone}</span>
//                               </h4>
//                               <div className="overflow-x-auto">
//                                 <BarChart width={300} height={200} data={chartData}>
//                                   <XAxis dataKey="Verified Purchase" stroke="#fff" />
//                                   <YAxis stroke="#fff" />
//                                   <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                                   <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                                   <Bar dataKey="POSITIVE" fill="#FFD700" />
//                                   <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                                 </BarChart>
//                               </div>
//                             </div>
//                           </>
//                         );
//                       })()
//                     )}
//                     {phoneData.sentiment_by_age?.length > 0 && (
//                       <div
//                         className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
//                         ref={(el) => (chartRefs.current[`${phoneData.phone}-age`] = el)}
//                         onClick={() =>
//                           setModalChart(
//                             <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_age, 'Age')}>
//                               <XAxis dataKey="Age" stroke="#fff" />
//                               <YAxis stroke="#fff" />
//                               <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                               <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                               <Bar dataKey="POSITIVE" fill="#FFD700" />
//                               <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                             </BarChart>
//                           )
//                         }
//                       >
//                         <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
//                           <span>🎂</span> Sentiment by Age for <span className="text-blue-300">{phoneData.phone}</span>
//                         </h4>
//                         <div className="overflow-x-auto">
//                           <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_age, 'Age')}>
//                             <XAxis dataKey="Age" stroke="#fff" />
//                             <YAxis stroke="#fff" />
//                             <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
//                             <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
//                             <Bar dataKey="POSITIVE" fill="#FFD700" />
//                             <Bar dataKey="NEGATIVE" fill="#FF4500" />
//                           </BarChart>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <AnalyticsSection phoneData={phoneData} />
//                 </div>
//               ))}
//               <GlobalAnalyticsSection data={data!} selectedPhoneNames={filteredData.map((fd) => fd.phone)} />
//             </div>
//           </div>
//           {modalChart && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-[#0a0c23] rounded-2xl p-8 max-w-4xl w-full border border-[#23243a]">
//                 <button className="absolute top-4 right-4 text-white text-xl font-bold hover:text-blue-400" onClick={closeModal}>
//                   ×
//                 </button>
//                 <div className="flex justify-center">{modalChart}</div>
//               </div>
//             </div>
//           )}
//         </div>
//       </>
//     );
//   }

//   return (
    
//       <div
//         className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#181b23] via-[#23243a] to-[#0a0c23] px-4 py-12"
//       >
//         <div className="bg-[#0a0c23] rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center mb-8 border border-[#23243a]">
//           <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
//             <span role="img" aria-label="Chart">📈</span> Generate Custom Report
//           </h2>
//           <form ref={formRef} className="w-full flex flex-col gap-4" onSubmit={handleGenerateReport}>
//             <label className="font-semibold text-blue-200">Select Phone Models</label>
//             <Select
//               isMulti
//               options={getPhoneNames().map((p) => ({ value: p, label: p }))}
//               value={selectedPhones}
//               onChange={handlePhoneChange}
//               placeholder="Select phones..."
//               className="mb-2"
//               styles={{
//                 control: (base) => ({
//                   ...base,
//                   backgroundColor: '#181b23',
//                   borderColor: '#555',
//                   color: '#fff',
//                   '&:hover': { borderColor: '#4f46e5' },
//                   boxShadow: 'none',
//                 }),
//                 menu: (base) => ({
//                   ...base,
//                   backgroundColor: '#181b23',
//                   border: '1px solid #23243a',
//                   color: '#fff',
//                 }),
//                 option: (base, { isFocused, isSelected }) => ({
//                   ...base,
//                   backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
//                   color: '#fff',
//                   '&:active': { backgroundColor: '#333' },
//                 }),
//                 multiValue: (base) => ({
//                   ...base,
//                   backgroundColor: '#4f46e5',
//                 }),
//                 multiValueLabel: (base) => ({
//                   ...base,
//                   color: '#fff',
//                 }),
//                 multiValueRemove: (base) => ({
//                   ...base,
//                   color: '#fff',
//                   '&:hover': { backgroundColor: '#555' },
//                 }),
//                 placeholder: (base) => ({
//                   ...base,
//                   color: '#93c5fd',
//                 }),
//                 input: (base) => ({
//                   ...base,
//                   color: '#fff',
//                 }),
//               }}
//             />
//             <label className="font-semibold text-blue-200">Select Months</label>
//             <Select
//               isMulti
//               options={getMonths().map((m) => ({ value: m, label: m }))}
//               value={selectedMonths}
//               onChange={handleMonthChange}
//               placeholder="Select months..."
//               className="mb-4"
//               styles={{
//                 control: (base) => ({
//                   ...base,
//                   backgroundColor: '#181b23',
//                   borderColor: '#555',
//                   color: '#fff',
//                   '&:hover': { borderColor: '#4f46e5' },
//                   boxShadow: 'none',
//                 }),
//                 menu: (base) => ({
//                   ...base,
//                   backgroundColor: '#181b23',
//                   border: '1px solid #23243a',
//                   color: '#fff',
//                 }),
//                 option: (base, { isFocused, isSelected }) => ({
//                   ...base,
//                   backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
//                   color: '#fff',
//                   '&:active': { backgroundColor: '#333' },
//                 }),
//                 multiValue: (base) => ({
//                   ...base,
//                   backgroundColor: '#4f46e5',
//                 }),
//                 multiValueLabel: (base) => ({
//                   ...base,
//                   color: '#fff',
//                 }),
//                 multiValueRemove: (base) => ({
//                   ...base,
//                   color: '#fff',
//                   '&:hover': { backgroundColor: '#555' },
//                 }),
//                 placeholder: (base) => ({
//                   ...base,
//                   color: '#93c5fd',
//                 }),
//                 input: (base) => ({
//                   ...base,
//                   color: '#fff',
//                 }),
//               }}
//             />
//             <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-3 text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
//               Generate Report
//             </button>
//           </form>
//           <button className="mt-4 text-xs font-semibold text-blue-400 underline hover:text-blue-600" onClick={() => setShowDebug((v) => !v)}>
//             {showDebug ? 'Hide Debug' : 'Show Debug'} Data
//           </button>
//           {showDebug && <DebugTable data={data} />}
//         </div>
//       </div>
    
//   );
// }


// function DebugTable({ data }: { data: unknown }) {
//   return (
//     <div className="mt-4 p-2 bg-[#181b23] rounded text-xs max-h-96 overflow-auto w-full text-left text-white border border-[#23243a]">
//       <table className="min-w-full border border-gray-300">
//         <thead className="bg-gray-800 sticky top-0">
//           <tr>
//             <th className="px-2 py-1 border-b border-gray-300 text-left">Key</th>
//             <th className="px-2 py-1 border-b border-gray-300 text-left">Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data &&
//             typeof data === 'object' &&
//             data !== null &&
//             Object.entries(data as Record<string, unknown>).map(([key, value]) => (
//               <tr key={key} className="border-b border-gray-700 align-top">
//                 <td className="px-2 py-1 font-semibold text-blue-300 align-top">{key}</td>
//                 <td className="px-2 py-1 align-top whitespace-pre-wrap break-all text-white">
//                   {Array.isArray(value) ? (
//                     <div className="overflow-x-auto max-h-40">
//                       <table className="min-w-full border border-gray-700 text-xs">
//                         <thead className="bg-gray-900">
//                           <tr>
//                             {value.length > 0 && typeof value[0] === 'object' ? (
//                               Object.keys(value[0]).map((col) => (
//                                 <th key={col} className="px-1 py-0.5 border-b border-gray-700 text-left">
//                                   {col}
//                                 </th>
//                               ))
//                             ) : (
//                               <th className="px-1 py-0.5 border-b border-gray-700 text-left">Value</th>
//                             )}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {value.length > 0 && typeof value[0] === 'object'
//                             ? value.map((row, i) => (
//                                 <tr key={i} className="border-b border-gray-800">
//                                   {Object.values(row).map((cell, j) => (
//                                     <td key={j} className="px-1 py-0.5 align-top border-b border-gray-800 text-white">
//                                       {String(cell)}
//                                     </td>
//                                   ))}
//                                 </tr>
//                               ))
//                             : value.map((v, i) => (
//                                 <tr key={i} className="border-b border-gray-800">
//                                   <td className="px-1 py-0.5 align-top border-b border-gray-800 text-white">{String(v)}</td>
//                                 </tr>
//                               ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : typeof value === 'object' && value !== null ? (
//                     <div className="overflow-x-auto max-h-40">
//                       <table className="min-w-full border border-gray-700 text-xs">
//                         <tbody>
//                           {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
//                             <tr key={k} className="border-b border-gray-800">
//                               <td className="px-1 py-0.5 font-semibold text-blue-300 align-top">{k}</td>
//                               <td className="px-1 py-0.5 align-top text-white">{String(v)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : (
//                     String(value)
//                   )}
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

















'use client';
import { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Select from 'react-select';
import AnalyticsSection from './AnalyticsSection';
import GlobalAnalyticsSection from './GlobalAnalyticsSection';
import Loading from '../component/Loading';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface OptionType {
  value: string;
  label: string;
}
interface FeatureSummary {
  feature: string;
  POSITIVE: number;
  NEGATIVE: number;
  'Product Name': string;
  Month?: string;
  Brand?: string;
}
interface OverallSummary {
  sentiment: string;
  count: number;
  'Product Name': string;
  Month?: string;
  Brand?: string;
}
interface BrandSummary {
  Brand: string;
  POSITIVE: number;
  NEGATIVE: number;
  'Product Name': string;
  Month?: string;
}
interface ProductSummary {
  'Product Name': string;
  POSITIVE: number;
  NEGATIVE: number;
  Month?: string;
  Brand?: string;
}
interface RatingSummary {
  Rating: string;
  POSITIVE: number;
  NEGATIVE: number;
  'Product Name': string;
  Month?: string;
}
interface PlatformSummary {
  Platform: string;
  POSITIVE: number;
  NEGATIVE: number;
  'Product Name': string;
  Month?: string;
}
interface GenderSummary {
  Gender: string;
  POSITIVE: number;
  NEGATIVE: number;
  'Product Name': string;
  Month?: string;
}
interface VerifiedSummary {
  'Verified Purchase': string;
  POSITIVE: number;
  NEGATIVE: number;
  'Product Name': string;
  Month?: string;
}
interface AgeSummary {
  Age: string;
  POSITIVE: number;
  NEGATIVE: number;
  'Product Name': string;
  Month?: string;
}
interface SentimentData {
  feature_summary?: FeatureSummary[];
  overall_summary?: OverallSummary[];
  sentiment_by_brand?: BrandSummary[];
  sentiment_by_product?: ProductSummary[];
  sentiment_by_rating?: RatingSummary[];
  sentiment_by_platform?: PlatformSummary[];
  sentiment_by_gender?: GenderSummary[];
  sentiment_by_verified?: VerifiedSummary[];
  sentiment_by_age?: AgeSummary[];
}
interface FilteredPhoneData {
  phone: string;
  feature_summary: FeatureSummary[];
  overall_summary: OverallSummary[];
  sentiment_by_brand: BrandSummary[];
  sentiment_by_product: ProductSummary[];
  sentiment_by_rating: RatingSummary[];
  sentiment_by_platform: PlatformSummary[];
  sentiment_by_gender: GenderSummary[];
  sentiment_by_verified: VerifiedSummary[];
  sentiment_by_age: AgeSummary[];
}

export default function ResultsPage() {
  const [data, setData] = useState<SentimentData | null>(null);
  const [selectedPhones, setSelectedPhones] = useState<OptionType[]>([]);
  const [selectedMonths, setSelectedMonths] = useState<OptionType[]>([]);
  const [filteredData, setFilteredData] = useState<FilteredPhoneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const chartRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const reportRef = useRef<HTMLDivElement>(null);
  const [modalChart, setModalChart] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('analysis');
      if (stored) setData(JSON.parse(stored));
      setLoading(false);
    } catch {
      setError('Failed to load analysis data. Please upload a file again.');
      setLoading(false);
    }
  }, []);

  function getFullPhoneName(brand?: string, productName?: string) {
    if (!productName) return '';
    return `${brand ? brand + ' ' : ''}${productName}`.trim();
  }

  const getPhoneNames = (): string[] => {
    if (!data?.sentiment_by_product) return [];
    return Array.from(
      new Set(
        data.sentiment_by_product.map((d) => getFullPhoneName(d['Brand'], d['Product Name']))
      )
    ).filter((v) => v && v.trim() !== '');
  };

  const getMonths = (): string[] => {
    if (!data?.sentiment_by_product) return [];
    const monthSet = new Set(
      data.sentiment_by_product
        .map((d) => d['Month'])
        .filter((m): m is string => typeof m === 'string' && m.length === 7)
        .map((ym) => {
          const [year, month] = ym.split('-');
          const date = new Date(Number(year), Number(month) - 1);
          return date.toLocaleString('en', { month: 'long', year: 'numeric' });
        })
    );
    return Array.from(monthSet);
  };

  const handlePhoneChange = (newValue: readonly OptionType[]) => setSelectedPhones([...newValue]);
  const handleMonthChange = (newValue: readonly OptionType[]) => setSelectedMonths([...newValue]);

  const filterData = () => {
    if (!data) return [];
    const phones = selectedPhones.map((p) => p.value);
    const months = selectedMonths.map((m) => m.value);
    function matchPhone(d: { Brand?: string; 'Product Name'?: string }, phone: string) {
      const dBrand = d['Brand'] || '';
      const dModel = d['Product Name'] ?? '';
      return getFullPhoneName(dBrand, dModel) === phone;
    }
    function matchMonth(d: { Month?: string }) {
      if (!months.length) return true;
      const ym = d['Month'];
      if (!ym || typeof ym !== 'string') return false;
      const [year, month] = ym.split('-');
      const dateStr = new Date(Number(year), Number(month) - 1).toLocaleString('en', { month: 'long', year: 'numeric' });
      return months.includes(dateStr);
    }
    return phones.map((phone) => ({
      phone,
      feature_summary: data.feature_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
      overall_summary: data.overall_summary?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
      sentiment_by_brand: data.sentiment_by_brand?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
      sentiment_by_product: data.sentiment_by_product?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
      sentiment_by_rating: data.sentiment_by_rating?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
      sentiment_by_platform: data.sentiment_by_platform?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
      sentiment_by_gender: data.sentiment_by_gender?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
      sentiment_by_verified: data.sentiment_by_verified?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
      sentiment_by_age: data.sentiment_by_age?.filter((d) => matchPhone(d, phone) && matchMonth(d)) || [],
    }));
  };

  const handleGenerateReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filtered = filterData();
    localStorage.setItem('filtered_data', JSON.stringify(filtered));
    window.open('/results?filtered=1', '_blank');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('filtered')) {
          const stored = localStorage.getItem('filtered_data');
          if (stored) setFilteredData(JSON.parse(stored));
        }
      } catch {
        setError('Failed to load filtered report.');
      }
    }
  }, []);

  function aggregateByKey<T extends { POSITIVE: number; NEGATIVE: number }>(arr: T[], key: keyof T): T[] {
    const keyMap = new Map<string, T>();
    arr.forEach((item) => {
      const k = item[key];
      if (k === undefined || k === null || k === '') return;
      const kStr = k.toString();
      if (!keyMap.has(kStr)) {
        keyMap.set(kStr, { ...item });
      } else {
        const existing = keyMap.get(kStr)!;
        existing.POSITIVE = (existing.POSITIVE || 0) + (item.POSITIVE || 0);
        existing.NEGATIVE = (existing.NEGATIVE || 0) + (item.NEGATIVE || 0);
      }
    });
    return Array.from(keyMap.values());
  }

  const handleDownloadPDF = async () => {
    try {
      if (reportRef.current) {
        const element = reportRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0a0c23',
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        let remainingHeight = imgHeight - pageHeight;
        while (remainingHeight > 0) {
          position -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          remainingHeight -= pageHeight;
        }
        pdf.save('Sentiment-Analysis-Report.pdf');
      } else {
        console.error('reportRef is null');
      }
    } catch (error) {
      console.error('PDF download failed:', error);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  
  const handleDownloadCSV = () => {
    const csvRows: string[] = [];
    filteredData.forEach((phoneData) => {
      csvRows.push(`### Analysis for ${phoneData.phone} ###`);
      const sections: { name: string; data: any[] }[] = [
        { name: 'Feature Summary', data: phoneData.feature_summary },
        { name: 'Overall Summary', data: phoneData.overall_summary },
        { name: 'Sentiment by Brand', data: phoneData.sentiment_by_brand },
        { name: 'Sentiment by Product', data: phoneData.sentiment_by_product },
        { name: 'Sentiment by Rating', data: phoneData.sentiment_by_rating },
        { name: 'Sentiment by Platform', data: phoneData.sentiment_by_platform },
        { name: 'Sentiment by Gender', data: phoneData.sentiment_by_gender },
        { name: 'Sentiment by Verified Purchase', data: phoneData.sentiment_by_verified },
        { name: 'Sentiment by Age', data: phoneData.sentiment_by_age },
      ];
      sections.forEach((section) => {
        if (!section.data) return;
        csvRows.push(`## ${section.name} ##`);
        const headers = section.data.length > 0 ? Object.keys(section.data[0]) : [];
        if (headers.length === 0) return;
        csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));
        section.data.forEach((item) => {
          const row = headers.map((header) => {
            const value = item[header] ?? '';
            return `"${String(value).replace(/"/g, '""')}"`;
          });
          csvRows.push(row.join(','));
        });
        csvRows.push('');
      });
    });
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sentiment-Analysis-Data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const closeModal = () => setModalChart(null);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#181b23] via-[#23243a] to-[#0a0c23] px-4 py-12">
        <div className="bg-[#0a0c23] rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center border border-[#23243a]">
          <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
            <span role="img" aria-label="Error">❌</span> Error
          </h2>
          <p className="text-gray-300 text-center">{error}</p>
          <button
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => (window.location.href = '/upload')}
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  if (!data && !filteredData.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#181b23] via-[#23243a] to-[#0a0c23] px-4 py-12">
        <div className="bg-[#0a0c23] rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center border border-[#23243a]">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <span role="img" aria-label="Chart">📈</span> No analysis data found.
          </h2>
          <p className="text-gray-300 text-center">Please upload a file first.</p>
          <button
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => (window.location.href = '/upload')}
          >
            Go to Upload
          </button>
        </div>
      </div>
    );
  }

  if (filteredData.length) {
    return (
      <div
        className="flex flex-col items-center min-h-screen px-4 py-12 "
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #17213a 0%, #0a0c23 100%)' }}
      >
        <div className="bg-[#0a0c23] rounded-2xl shadow-2xl p-8 w-full max-w-4xl flex flex-col items-center border border-[#23243a]">
          <div className="flex justify-end w-full mb-4 space-x-4 bg-gradient-to-r from-blue-900 to-green-900 ">
            <div className='p-2 flex gap-2'>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Download PDF
              </button>
              <button
                onClick={handleDownloadCSV}
                className=" px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Download CSV
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-950 to-green-900  w-full   "  ref={reportRef}>
            <div className='p-5'>

            
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
              <span role="img" aria-label="Chart">📈</span> Filtered Analysis Results
            </h2>
            {filteredData.map((phoneData) => (
              <div key={phoneData.phone} className="w-full mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {phoneData.feature_summary?.length > 0 && (
                    <div
                      className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
                      ref={(el) => (chartRefs.current[`${phoneData.phone}-feature`] = el)}
                      onClick={() =>
                        setModalChart(
                          <BarChart width={800} height={400} data={aggregateByKey(phoneData.feature_summary, 'feature')}>
                            <XAxis dataKey="feature" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                            <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                            <Bar dataKey="POSITIVE" fill="#82ca9d" />
                            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                          </BarChart>
                        )
                      }
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>📊</span> Feature-wise Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
                      </h4>
                      <div className="overflow-x-auto">
                        <BarChart width={300} height={200} data={aggregateByKey(phoneData.feature_summary, 'feature')}>
                          <XAxis dataKey="feature" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                          <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                          <Bar dataKey="POSITIVE" fill="#82ca9d" />
                          <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                        </BarChart>
                      </div>
                    </div>
                  )}
                  {phoneData.overall_summary?.length > 0 && (
                    <div
                      className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
                      ref={(el) => (chartRefs.current[`${phoneData.phone}-monthly`] = el)}
                      onClick={() =>
                        setModalChart(
                          (() => {
                            const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
                            phoneData.overall_summary.forEach((d) => {
                              if (!d.Month) return;
                              if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
                              if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
                              if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
                            });
                            const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
                            const displayData = data.map((d) => {
                              const [year, month] = d.Month.split('-');
                              const date = new Date(Number(year), Number(month) - 1);
                              return {
                                ...d,
                                label: date.toLocaleString('en', { month: 'short', year: '2-digit' }),
                              };
                            });
                            return (
                              <LineChart width={800} height={400} data={displayData}>
                                <XAxis dataKey="label" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                                <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                                <Line type="monotone" dataKey="POSITIVE" stroke="#22c55e" name="Positive" strokeWidth={3} />
                                <Line type="monotone" dataKey="NEGATIVE" stroke="#ef4444" name="Negative" strokeWidth={3} />
                              </LineChart>
                            );
                          })()
                        )
                      }
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>📈</span> Monthly Sentiment Trend for <span className="text-blue-300">{phoneData.phone}</span>
                      </h4>
                      <div className="overflow-x-auto">
                        {(() => {
                          const monthMap: Record<string, { Month: string; POSITIVE: number; NEGATIVE: number }> = {};
                          phoneData.overall_summary.forEach((d) => {
                            if (!d.Month) return;
                            if (!monthMap[d.Month]) monthMap[d.Month] = { Month: d.Month, POSITIVE: 0, NEGATIVE: 0 };
                            if (d.sentiment === 'POSITIVE') monthMap[d.Month].POSITIVE += d.count;
                            if (d.sentiment === 'NEGATIVE') monthMap[d.Month].NEGATIVE += d.count;
                          });
                          const data = Object.values(monthMap).sort((a, b) => a.Month.localeCompare(b.Month));
                          const displayData = data.map((d) => {
                            const [year, month] = d.Month.split('-');
                            const date = new Date(Number(year), Number(month) - 1);
                            return {
                              ...d,
                              label: date.toLocaleString('en', { month: 'short', year: '2-digit' }),
                            };
                          });
                          return (
                            <LineChart width={300} height={200} data={displayData}>
                              <XAxis dataKey="label" stroke="#fff" />
                              <YAxis stroke="#fff" />
                              <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                              <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                              <Line type="monotone" dataKey="POSITIVE" stroke="#22c55e" name="Positive" strokeWidth={3} />
                              <Line type="monotone" dataKey="NEGATIVE" stroke="#ef4444" name="Negative" strokeWidth={3} />
                            </LineChart>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  {phoneData.overall_summary?.length > 0 && (
                    <div
                      className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
                      ref={(el) => (chartRefs.current[`${phoneData.phone}-overall`] = el)}
                      onClick={() =>
                        setModalChart(
                          (() => {
                            const agg = phoneData.overall_summary.reduce(
                              (acc, cur) => {
                                if (cur.sentiment === 'POSITIVE') acc.POSITIVE += cur.count;
                                if (cur.sentiment === 'NEGATIVE') acc.NEGATIVE += cur.count;
                                return acc;
                              },
                              { POSITIVE: 0, NEGATIVE: 0 }
                            );
                            const pieData = [
                              { name: 'Positive', value: agg.POSITIVE },
                              { name: 'Negative', value: agg.NEGATIVE },
                            ];
                            return (
                              <PieChart width={600} height={400}>
                                <Pie data={pieData} cx={300} cy={200} outerRadius={150} label dataKey="value">
                                  <Cell fill="#82ca9d" />
                                  <Cell fill="#ff7f7f" />
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                              </PieChart>
                            );
                          })()
                        )
                      }
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>🧠</span> Overall Sentiment for <span className="text-blue-300">{phoneData.phone}</span>
                      </h4>
                      <div className="overflow-x-auto flex justify-center">
                        {(() => {
                          const agg = phoneData.overall_summary.reduce(
                            (acc, cur) => {
                              if (cur.sentiment === 'POSITIVE') acc.POSITIVE += cur.count;
                              if (cur.sentiment === 'NEGATIVE') acc.NEGATIVE += cur.count;
                              return acc;
                            },
                            { POSITIVE: 0, NEGATIVE: 0 }
                          );
                          const pieData = [
                            { name: 'Positive', value: agg.POSITIVE },
                            { name: 'Negative', value: agg.NEGATIVE },
                          ];
                          return (
                            <PieChart width={300} height={200}>
                              <Pie data={pieData} cx={150} cy={100} outerRadius={80} label dataKey="value">
                                <Cell fill="#82ca9d" />
                                <Cell fill="#ff7f7f" />
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                            </PieChart>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                  {phoneData.sentiment_by_brand?.length > 0 && (
                    <div
                      className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
                      ref={(el) => (chartRefs.current[`${phoneData.phone}-brand`] = el)}
                      onClick={() =>
                        setModalChart(
                          <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_brand, 'Brand')}>
                            <XAxis dataKey="Brand" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                            <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                            <Bar dataKey="POSITIVE" fill="#82ca9d" />
                            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                          </BarChart>
                        )
                      }
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>🏷️</span> Sentiment by Brand for <span className="text-blue-300">{phoneData.phone}</span>
                      </h4>
                      <div className="overflow-x-auto">
                        <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_brand, 'Brand')}>
                          <XAxis dataKey="Brand" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                          <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                          <Bar dataKey="POSITIVE" fill="#82ca9d" />
                          <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                        </BarChart>
                      </div>
                    </div>
                  )}
                  {phoneData.sentiment_by_product?.length > 0 && (
                    <div
                      className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
                      ref={(el) => (chartRefs.current[`${phoneData.phone}-product`] = el)}
                      onClick={() =>
                        setModalChart(
                          <BarChart
                            width={800}
                            height={400}
                            data={aggregateByKey(phoneData.sentiment_by_product, 'Product Name').map((item) => ({
                              ...item,
                              fullName: getFullPhoneName(item['Brand'], item['Product Name']),
                            }))}
                          >
                            <XAxis dataKey="fullName" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                            <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                            <Bar dataKey="POSITIVE" fill="#82ca9d" />
                            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                          </BarChart>
                        )
                      }
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>📱</span> Sentiment by Product for <span className="text-blue-300">{phoneData.phone}</span>
                      </h4>
                      <div className="overflow-x-auto">
                        <BarChart
                          width={300}
                          height={200}
                          data={aggregateByKey(phoneData.sentiment_by_product, 'Product Name').map((item) => ({
                            ...item,
                            fullName: getFullPhoneName(item['Brand'], item['Product Name']),
                          }))}
                        >
                          <XAxis dataKey="fullName" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                          <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                          <Bar dataKey="POSITIVE" fill="#82ca9d" />
                          <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                        </BarChart>
                      </div>
                    </div>
                  )}
                  {phoneData.sentiment_by_rating?.length > 0 && (
                    (() => {
                      const hasValid = phoneData.sentiment_by_rating.some(
                        (item) => item.Rating !== undefined && item.Rating !== null && item.Rating !== ''
                      );
                      if (!hasValid) return null;
                      const chartData = aggregateByKey(phoneData.sentiment_by_rating, 'Rating')
                        .map((item) => ({
                          ...item,
                          Rating: item.Rating?.toString() ?? '',
                        }))
                        .filter((item) => item.Rating !== '')
                        .sort((a, b) => {
                          const na = Number(a.Rating);
                          const nb = Number(b.Rating);
                          if (!isNaN(na) && !isNaN(nb)) return na - nb;
                          return a.Rating.localeCompare(b.Rating);
                        });
                      return (
                        <div
                          className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
                          ref={(el) => (chartRefs.current[`${phoneData.phone}-rating`] = el)}
                          onClick={() =>
                            setModalChart(
                              <BarChart width={800} height={400} data={chartData}>
                                <XAxis dataKey="Rating" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                                <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                                <Bar dataKey="POSITIVE" fill="#82ca9d" />
                                <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                              </BarChart>
                            )
                          }
                        >
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>⭐</span> Sentiment by Rating for <span className="text-blue-300">{phoneData.phone}</span>
                          </h4>
                          <div className="overflow-x-auto">
                            <BarChart width={300} height={200} data={chartData}>
                              <XAxis dataKey="Rating" stroke="#fff" />
                              <YAxis stroke="#fff" />
                              <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                              <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                              <Bar dataKey="POSITIVE" fill="#82ca9d" />
                              <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                            </BarChart>
                          </div>
                        </div>
                      );
                    })()
                  )}
                  {phoneData.sentiment_by_verified?.length > 0 && (
                    (() => {
                      const hasValid = phoneData.sentiment_by_verified.some(
                        (item) => item['Verified Purchase'] !== undefined && item['Verified Purchase'] !== null && item['Verified Purchase'] !== ''
                      );
                      if (!hasValid) return null;
                      const chartData = aggregateByKey(phoneData.sentiment_by_verified, 'Verified Purchase')
                        .map((item) => ({
                          ...item,
                          ['Verified Purchase']: item['Verified Purchase']?.toString() ?? '',
                        }))
                        .filter((item) => item['Verified Purchase'] !== '')
                        .sort((a, b) => {
                          if (a['Verified Purchase'] === 'Yes' && b['Verified Purchase'] === 'No') return -1;
                          if (a['Verified Purchase'] === 'No' && b['Verified Purchase'] === 'Yes') return 1;
                          return a['Verified Purchase'].localeCompare(b['Verified Purchase']);
                        });
                      return (
                        <div
                          className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
                          ref={(el) => (chartRefs.current[`${phoneData.phone}-verified`] = el)}
                          onClick={() =>
                            setModalChart(
                              <BarChart width={800} height={400} data={chartData}>
                                <XAxis dataKey="Verified Purchase" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                                <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                                <Bar dataKey="POSITIVE" fill="#82ca9d" />
                                <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                              </BarChart>
                            )
                          }
                        >
                          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <span>✅</span> Sentiment by Verified Purchase for <span className="text-blue-300">{phoneData.phone}</span>
                          </h4>
                          <div className="overflow-x-auto">
                            <BarChart width={300} height={200} data={chartData}>
                              <XAxis dataKey="Verified Purchase" stroke="#fff" />
                              <YAxis stroke="#fff" />
                              <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                              <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                              <Bar dataKey="POSITIVE" fill="#82ca9d" />
                              <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                            </BarChart>
                          </div>
                        </div>
                      );
                    })()
                  )}
                  {phoneData.sentiment_by_age?.length > 0 && (
                    <div
                      className="cursor-pointer bg-[#181b23] p-4 rounded-lg border border-[#23243a] hover:border-blue-500 transition"
                      ref={(el) => (chartRefs.current[`${phoneData.phone}-age`] = el)}
                      onClick={() =>
                        setModalChart(
                          <BarChart width={800} height={400} data={aggregateByKey(phoneData.sentiment_by_age, 'Age')}>
                            <XAxis dataKey="Age" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                            <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                            <Bar dataKey="POSITIVE" fill="#82ca9d" />
                            <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                          </BarChart>
                        )
                      }
                    >
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span>🎂</span> Sentiment by Age for <span className="text-blue-300">{phoneData.phone}</span>
                      </h4>
                      <div className="overflow-x-auto">
                        <BarChart width={300} height={200} data={aggregateByKey(phoneData.sentiment_by_age, 'Age')}>
                          <XAxis dataKey="Age" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip contentStyle={{ backgroundColor: '#181b23', border: '1px solid #23243a', color: '#fff' }} />
                          <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
                          <Bar dataKey="POSITIVE" fill="#82ca9d" />
                          <Bar dataKey="NEGATIVE" fill="#ff7f7f" />
                        </BarChart>
                      </div>
                    </div>
                  )}
                </div>
                <AnalyticsSection phoneData={phoneData} />
              </div>
            ))}
            <GlobalAnalyticsSection data={data!} selectedPhoneNames={filteredData.map((fd) => fd.phone)} />
            </div>
          </div>
          {modalChart && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-[#0a0c23] rounded-2xl p-8 max-w-4xl w-full border border-[#23243a] relative">
                <button
                  className="absolute top-4 right-4 text-white text-xl font-bold hover:text-blue-300"
                  onClick={closeModal}
                >
                  ×
                </button>
                <div className="flex justify-center">{modalChart}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#181b23] via-[#23243a] to-[#0a0c23] px-4 py-12"
    >
      <div className="bg-[#0a0c23] rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center mb-8 border border-[#23243a]">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span role="img" aria-label="Chart">📈</span> Generate Custom Report
        </h2>
        <form ref={formRef} className="w-full flex flex-col gap-4" onSubmit={handleGenerateReport}>
          <label className="font-semibold text-blue-200">Select Phone Models</label>
          <Select
            isMulti
            options={getPhoneNames().map((p) => ({ value: p, label: p }))}
            value={selectedPhones}
            onChange={handlePhoneChange}
            placeholder="Select phones..."
            className="mb-2"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#181b23',
                borderColor: '#23243a',
                color: '#fff',
                '&:hover': { borderColor: '#4f46e5' },
                boxShadow: 'none',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#181b23',
                border: '1px solid #23243a',
                color: '#fff',
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
                color: '#fff',
                '&:active': { backgroundColor: '#333' },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#4f46e5',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#fff',
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: '#fff',
                '&:hover': { backgroundColor: '#555' },
              }),
              placeholder: (base) => ({
                ...base,
                color: '#93c5fd',
              }),
              input: (base) => ({
                ...base,
                color: '#fff',
              }),
            }}
          />
          <label className="font-semibold text-blue-200">Select Months</label>
          <Select
            isMulti
            options={getMonths().map((m) => ({ value: m, label: m }))}
            value={selectedMonths}
            onChange={handleMonthChange}
            placeholder="Select months..."
            className="mb-4"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#181b23',
                borderColor: '#23243a',
                color: '#fff',
                '&:hover': { borderColor: '#4f46e5' },
                boxShadow: 'none',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#181b23',
                border: '1px solid #23243a',
                color: '#fff',
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected ? '#4f46e5' : isFocused ? '#23243a' : '#181b23',
                color: '#fff',
                '&:active': { backgroundColor: '#333' },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: '#4f46e5',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: '#fff',
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: '#fff',
                '&:hover': { backgroundColor: '#555' },
              }),
              placeholder: (base) => ({
                ...base,
                color: '#93c5fd',
              }),
              input: (base) => ({
                ...base,
                color: '#fff',
              }),
            }}
          />
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-3 text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Generate Report
          </button>
        </form>
        <button
          className="mt-4 text-xs font-semibold text-blue-400 underline hover:text-blue-600"
          onClick={() => setShowDebug((v) => !v)}
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'} Data
        </button>
        {showDebug && <DebugTable data={data} />}
      </div>
    </div>
  );
}

function DebugTable({ data }: { data: unknown }) {
  return (
    <div className="mt-4 p-2 bg-[#181b23] rounded text-xs max-h-96 overflow-auto w-full text-left text-white border border-[#23243a]">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-800 sticky top-0">
          <tr>
            <th className="px-2 py-1 border-b border-gray-300 text-left">Key</th>
            <th className="px-2 py-1 border-b border-gray-300 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            typeof data === 'object' &&
            data !== null &&
            Object.entries(data as Record<string, unknown>).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-700 align-top">
                <td className="px-2 py-1 font-semibold text-blue-300 align-top">{key}</td>
                <td className="px-2 py-1 align-top whitespace-pre-wrap break-all text-white">
                  {Array.isArray(value) ? (
                    <div className="overflow-x-auto max-h-40">
                      <table className="min-w-full border border-gray-700 text-xs">
                        <thead className="bg-gray-900">
                          <tr>
                            {value.length > 0 && typeof value[0] === 'object' ? (
                              Object.keys(value[0]).map((col) => (
                                <th key={col} className="px-1 py-0.5 border-b border-gray-700 text-left">
                                  {col}
                                </th>
                              ))
                            ) : (
                              <th className="px-1 py-0.5 border-b border-gray-700 text-left">Value</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {value.length > 0 && typeof value[0] === 'object'
                            ? value.map((row, i) => (
                                <tr key={i} className="border-b border-gray-800">
                                  {Object.values(row).map((cell, j) => (
                                    <td key={j} className="px-1 py-0.5 align-top border-b border-gray-800 text-white">
                                      {String(cell)}
                                    </td>
                                  ))}
                                </tr>
                              ))
                            : value.map((v, i) => (
                                <tr key={i} className="border-b border-gray-800">
                                  <td className="px-1 py-0.5 align-top border-b border-gray-800 text-white">{String(v)}</td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  ) : typeof value === 'object' && value !== null ? (
                    <div className="overflow-x-auto max-h-40">
                      <table className="min-w-full border border-gray-700 text-xs">
                        <tbody>
                          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                            <tr key={k} className="border-b border-gray-800">
                              <td className="px-1 py-0.5 font-semibold text-blue-300 align-top">{k}</td>
                              <td className="px-1 py-0.5 align-top text-white">{String(v)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    String(value)
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}