"use client";
import React from "react";

interface FeatureSummary {
  feature: string;
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
interface AgeSummary {
  Age: string;
  POSITIVE: number;
  NEGATIVE: number;
  'Product Name': string;
  Month?: string;
}
interface OverallSummary {
  sentiment: string;
  count: number;
  'Product Name': string;
  Month?: string;
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
}
interface RatingSummary {
  Rating: string;
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

interface AnalyticsSectionProps {
  phoneData: FilteredPhoneData;
}

function getFullPhoneName(brand?: string, productName?: string) {
  if (!productName) return '';
  return `${brand ? brand + ' ' : ''}${productName}`.trim();
}

function getBestFeatures(featureSummary: FeatureSummary[]): FeatureSummary[] {
  const featureMap: Record<string, { POSITIVE: number; NEGATIVE: number }> = {};
  featureSummary.forEach((f: FeatureSummary) => {
    if (!featureMap[f.feature]) featureMap[f.feature] = { POSITIVE: 0, NEGATIVE: 0 };
    featureMap[f.feature].POSITIVE += f.POSITIVE;
    featureMap[f.feature].NEGATIVE += f.NEGATIVE;
  });

  const arr = Object.entries(featureMap).map(([feature, stats]) => {
    const total = stats.POSITIVE + stats.NEGATIVE;
    return {
      feature,
      POSITIVE: stats.POSITIVE,
      NEGATIVE: stats.NEGATIVE,
      total,
      posRatio: total > 0 ? (stats.POSITIVE / total) * 100 : 0
    };
  }).filter(f => f.total >= 5 && f.POSITIVE > 0).sort((a, b) => b.posRatio - a.posRatio);

  if (arr.length === 0) return [];
  const maxRatio = arr[0].posRatio;
  return arr.filter(f => f.posRatio === maxRatio).map(f => ({
    feature: f.feature,
    POSITIVE: f.POSITIVE,
    NEGATIVE: f.NEGATIVE,
    'Product Name': '',
    Month: undefined
  }));
}

function getFeaturesToImprove(featureSummary: FeatureSummary[]): FeatureSummary[] {
  const featureMap: Record<string, { POSITIVE: number; NEGATIVE: number }> = {};
  featureSummary.forEach((f: FeatureSummary) => {
    if (!featureMap[f.feature]) featureMap[f.feature] = { POSITIVE: 0, NEGATIVE: 0 };
    featureMap[f.feature].POSITIVE += f.POSITIVE;
    featureMap[f.feature].NEGATIVE += f.NEGATIVE;
  });

  const arr = Object.entries(featureMap).map(([feature, stats]) => {
    const total = stats.POSITIVE + stats.NEGATIVE;
    return {
      feature,
      POSITIVE: stats.POSITIVE,
      NEGATIVE: stats.NEGATIVE,
      total,
      negRatio: total > 0 ? (stats.NEGATIVE / total) * 100 : 0
    };
  }).filter(f => f.total >= 5 && f.NEGATIVE > 0).sort((a, b) => b.negRatio - a.negRatio);

  return arr.slice(0, 3).map(f => ({
    feature: f.feature,
    POSITIVE: f.POSITIVE,
    NEGATIVE: f.NEGATIVE,
    'Product Name': '',
    Month: undefined
  }));
}

function getBestSeasons(featureSummary: FeatureSummary[]): string[] {
  const monthMap: Record<string, { pos: number; total: number }> = {};
  featureSummary.forEach((f: FeatureSummary) => {
    if (!f.Month) return;
    if (!monthMap[f.Month]) monthMap[f.Month] = { pos: 0, total: 0 };
    monthMap[f.Month].pos += f.POSITIVE;
    monthMap[f.Month].total += f.POSITIVE + f.NEGATIVE;
  });

  return Object.entries(monthMap)
    .filter(([, v]) => v.total > 0 && v.pos / v.total >= 0.65)
    .map(([month]) => {
      const [year, monthNum] = month.split('-');
      const date = new Date(Number(year), Number(monthNum) - 1);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    });
}

function getTopPlatform(platformSummary: PlatformSummary[]): string[] | null {
  if (!platformSummary?.length) return null;
  const max = Math.max(...platformSummary.map(p => p.POSITIVE));
  const best = platformSummary.filter(p => p.POSITIVE === max);
  return best.map(p => p.Platform);
}

function getTopAges(ageSummary: AgeSummary[]): string[] {
  if (!ageSummary?.length) return [];
  const sorted = [...ageSummary].sort((a, b) => b.POSITIVE - a.POSITIVE);
  return sorted.slice(0, 2).map(a => a.Age);
}

export default function AnalyticsSection({ phoneData }: AnalyticsSectionProps) {
  const bestFeatures = getBestFeatures(phoneData.feature_summary || []);
  const featuresToImprove = getFeaturesToImprove(phoneData.feature_summary || []);
  const bestSeasons = getBestSeasons(phoneData.feature_summary || []);
  const topPlatforms = getTopPlatform(phoneData.sentiment_by_platform || []);
  const topAges = getTopAges(phoneData.sentiment_by_age || []);

  return (
    <div className="w-full mb-8">
      <div className="mb-2">
        <h3 className="text-2xl font-semibold text-blue-400 mb-2 mt-8">📊 Analytics</h3>

        <div className="mb-2">
          <span className="font-semibold text-cyan-300">Best features in <span className="text-green-400">{getFullPhoneName(phoneData.sentiment_by_brand[0]?.Brand, phoneData.phone)}</span>:</span>
          <ul className="list-disc ml-6 mt-1">
            {bestFeatures.length ? bestFeatures.map(f => {
              const total = f.POSITIVE + f.NEGATIVE;
              const posRatio = total > 0 ? ((f.POSITIVE / total) * 100).toFixed(1) : '0';
              return (
                <li className="text-gray-300" key={f.feature}>
                  <span className="text-green-400 font-semibold">{f.feature}</span> (Positive: {f.POSITIVE}, Negative: {f.NEGATIVE}, <span className="text-green-400">{posRatio}% positive</span>)
                </li>
              );
            }) : <li className="text-gray-300">No feature data available.</li>}
          </ul>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-rose-400">Features to improve in <span className="text-rose-400">{getFullPhoneName(phoneData.sentiment_by_brand[0]?.Brand, phoneData.phone)}</span>:</span>
          <ul className="list-disc ml-6 mt-1">
            {featuresToImprove.length ? featuresToImprove.map(f => {
              const total = f.POSITIVE + f.NEGATIVE;
              const negRatio = total > 0 ? ((f.NEGATIVE / total) * 100).toFixed(1) : '0';
              return (
                <li className="text-gray-300" key={f.feature}>
                  <span className="text-rose-400 font-semibold">{f.feature}</span> (Negative: {f.NEGATIVE}, Positive: {f.POSITIVE}, <span className="text-rose-400">{negRatio}% negative</span>)
                </li>
              );
            }) : <li className="text-gray-300">All features have more positive than negative reviews.</li>}
          </ul>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-cyan-300">Best sales seasons (months with ≥65% positive reviews):</span>
          <ul className="list-disc ml-6 mt-1">
            {bestSeasons.length ? bestSeasons.map(m => (
              <li key={m} className="text-gray-300">{m}</li>
            )) : <li className="text-gray-300">No month with ≥65% positive reviews.</li>}
          </ul>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-cyan-300">Highest selling platform:</span>
          <ul className="list-disc ml-6 mt-1">
            {topPlatforms?.length ? topPlatforms.map(p => (
              <li key={p} className="text-gray-300">{p}</li>
            )) : <li className="text-gray-300">No platform data available.</li>}
          </ul>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-cyan-300">Most popular among age groups:</span>
          <ul className="list-disc ml-6 mt-1">
            {topAges.length ? topAges.map(a => (
              <li key={a} className="text-gray-300">{a}</li>
            )) : <li className="text-gray-300">No age group data available.</li>}
          </ul>
        </div>
      </div>

      <style jsx global>{`
        .pdf-export, .pdf-export * {
          color: #ffffff !important;
          background-color: #0a0c23 !important;
        }
        .pdf-export .text-blue-400 { color: #60a5fa !important; }
        .pdf-export .text-cyan-300 { color: #67e8f9 !important; }
        .pdf-export .text-green-400 { color: #4ade80 !important; }
        .pdf-export .text-rose-400 { color: #fb7185 !important; }
        .pdf-export .text-gray-300 { color: #d1d5db !important; }
      `}</style>
    </div>
  );
}
