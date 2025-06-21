"use client";
import React from "react";

interface FeatureSummary {
  feature: string;
  POSITIVE: number;
  NEGATIVE: number;
  "Product Name": string;
  Month?: string;
  Age?: string;
  Brand?: string;
}

interface ProductSummary {
  "Product Name": string;
  Brand?: string;
  POSITIVE: number;
  NEGATIVE: number;
  Month?: string;
}

interface AgeSummary {
  Age: string;
  POSITIVE: number;
  NEGATIVE: number;
  "Product Name": string;
  Brand?: string;
  Month?: string;
}

interface SentimentData {
  feature_summary?: FeatureSummary[];
  sentiment_by_brand?: ProductSummary[];
  sentiment_by_product?: ProductSummary[];
  sentiment_by_age?: AgeSummary[];
}

interface GlobalAnalyticsSectionProps {
  data: SentimentData;
  selectedPhoneNames: string[];
}

export default function GlobalAnalyticsSection({ data, selectedPhoneNames }: GlobalAnalyticsSectionProps) {
  // Helper function to get full phone name (same as in results page)
  function getFullPhoneName(brand?: string, productName?: string) {
    if (!productName) return '';
    return `${brand ? brand + ' ' : ''}${productName}`.trim();
  }

  const ageFeatureMap = (() => {
    if (!data?.feature_summary?.length || !data?.sentiment_by_age?.length) return [];

    // Filter features for selected phones using proper name matching
    const relevantFeatures = data.feature_summary.filter(f => {
      const fullName = getFullPhoneName(f.Brand, f["Product Name"]);
      return selectedPhoneNames.includes(fullName);
    });

    if (!relevantFeatures.length) {
      console.warn('No relevant features found for selected phones.');
      console.warn('Available product names in data:', Array.from(new Set(data.feature_summary.map(f => getFullPhoneName(f.Brand, f["Product Name"])))));
      console.warn('Selected product names:', selectedPhoneNames);
      return [];
    }

    // Filter age data for selected phones
    const relevantAgeData = data.sentiment_by_age.filter(a => {
      const fullName = getFullPhoneName(a.Brand, a["Product Name"]);
      return selectedPhoneNames.includes(fullName);
    });

    if (!relevantAgeData.length) {
      console.warn('No relevant age data found for selected phones.');
      return [];
    }

    // Calculate total sentiment per age group
    const ageTotals: Record<string, { POSITIVE: number; NEGATIVE: number }> = {};
    relevantAgeData.forEach(ageData => {
      if (!ageData.Age) return;
      if (!ageTotals[ageData.Age]) {
        ageTotals[ageData.Age] = { POSITIVE: 0, NEGATIVE: 0 };
      }
      ageTotals[ageData.Age].POSITIVE += ageData.POSITIVE || 0;
      ageTotals[ageData.Age].NEGATIVE += ageData.NEGATIVE || 0;
    });

    // Calculate total sentiment per feature
    const featureTotals: Record<string, { POSITIVE: number; NEGATIVE: number }> = {};
    relevantFeatures.forEach(f => {
      if (!f.feature) return;
      if (!featureTotals[f.feature]) {
        featureTotals[f.feature] = { POSITIVE: 0, NEGATIVE: 0 };
      }
      featureTotals[f.feature].POSITIVE += f.POSITIVE || 0;
      featureTotals[f.feature].NEGATIVE += f.NEGATIVE || 0;
    });

    // Calculate overall sentiment distribution
    const totalPositive = Object.values(featureTotals).reduce((sum, f) => sum + f.POSITIVE, 0);
    const totalNegative = Object.values(featureTotals).reduce((sum, f) => sum + f.NEGATIVE, 0);

    const map: Record<string, { feature: string; POSITIVE: number; NEGATIVE: number; totalReviews: number }[]> = {};
    
    // For each age group, distribute sentiment based on feature popularity
    Object.entries(ageTotals).forEach(([age, ageSentiment]) => {
      if (!map[age]) map[age] = [];
      
      Object.entries(featureTotals).forEach(([feature, featureSentiment]) => {
        // Calculate feature's proportion of total sentiment
        const featureProportion = totalPositive + totalNegative > 0 
          ? (featureSentiment.POSITIVE + featureSentiment.NEGATIVE) / (totalPositive + totalNegative)
          : 0;
        
        // Distribute age sentiment based on feature proportion
        const distributedPositive = Math.round(ageSentiment.POSITIVE * featureProportion);
        const distributedNegative = Math.round(ageSentiment.NEGATIVE * featureProportion);
        
        if (distributedPositive + distributedNegative > 0) {
          map[age].push({
            feature,
            POSITIVE: distributedPositive,
            NEGATIVE: distributedNegative,
            totalReviews: distributedPositive + distributedNegative
          });
        }
      });
    });

    return Object.entries(map).map(([age, arr]) => {
      const featuresWithEnoughReviews = arr.filter(x => x.totalReviews >= 5);
      if (!featuresWithEnoughReviews.length) return null;
      const withScores = featuresWithEnoughReviews.map(x => ({
        ...x,
        score: x.POSITIVE / x.totalReviews
      }));
      const best = withScores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(x => ({
          ...x,
          positivePercentage: Math.round(x.score * 100)
        }));
      return { age, best };
    }).filter((x): x is NonNullable<typeof x> => x !== null && x.best.length > 0);
  })();

  const brandPerf = (() => {
    if (!data?.sentiment_by_brand?.length) return [];
    const brandMap = new Map<string, { brand: string; positive: number; products: Set<string> }>();
    
    data.sentiment_by_brand.forEach((b: ProductSummary) => {
      if (!b.Brand) return;
      const fullName = getFullPhoneName(b.Brand, b["Product Name"]);
      if (!selectedPhoneNames.includes(fullName)) return;
      
      if (!brandMap.has(b.Brand)) {
        brandMap.set(b.Brand, { brand: b.Brand, positive: 0, products: new Set() });
      }
      const brandData = brandMap.get(b.Brand)!;
      brandData.positive += (b.POSITIVE || 0);
      if (b["Product Name"]) {
        brandData.products.add(b["Product Name"]);
      }
    });
    
    return Array.from(brandMap.values())
      .map(data => ({
        ...data,
        products: Array.from(data.products)
      }))
      .sort((a, b) => b.positive - a.positive);
  })();

  const modelPerf = (() => {
    if (!data?.sentiment_by_product?.length) return [];
    const modelMap = new Map<string, { name: string; positive: number }>();
    
    data.sentiment_by_product.forEach((m: ProductSummary) => {
      if (!m["Product Name"]) return;
      const fullName = getFullPhoneName(m.Brand, m["Product Name"]);
      if (!selectedPhoneNames.includes(fullName)) return;
      
      if (!modelMap.has(m["Product Name"])) {
        modelMap.set(m["Product Name"], { name: m["Product Name"], positive: 0 });
      }
      const model = modelMap.get(m["Product Name"])!;
      model.positive += (m.POSITIVE || 0);
    });
    
    return Array.from(modelMap.values())
      .sort((a, b) => b.positive - a.positive)
  })();

  return (
    <div className="w-full mb-8 mt-12">
      <h3 className="text-2xl font-bold text-blue-400 mb-4">📈 Overall Analytics</h3>

      <div className="mb-4">
        <span className="font-semibold text-cyan-400">Which age group likes which feature the most:</span>
        <ul className="list-disc ml-6 mt-1">
          {ageFeatureMap.length ? ageFeatureMap.map(({ age, best }) => (
            <li key={age} className="mb-2 text-gray-200">
              <span className="text-indigo-400 font-semibold">{age}</span>: {' '}
              {best.map((x, i) => (
                <React.Fragment key={x.feature}>
                  {i > 0 && ', '}
                  <span className="text-green-600">{x.feature}</span>
                  <span className="text-gray-200"> ({x.positivePercentage}% positive from {x.totalReviews} reviews)</span>
                </React.Fragment>
              ))}
            </li>
          )) : <li className="text-gray-200">No age-feature data available for the selected phones.</li>}
        </ul>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-cyan-400">Brands performance (decreasing order):</span>
        <ul className="list-disc ml-6 mt-1">
          {brandPerf.length ? brandPerf.map(({ brand, positive, products }) => (
            <li key={brand} className="mb-2 text-gray-200">
              <div>
                <span className="text-indigo-400 font-semibold">{brand}</span>: {positive} positive reviews
              </div>
              <div className="ml-4 text-sm text-green-600">
                Models: {products.join(", ")}
              </div>
            </li>
          )) : <li className="text-gray-200">No brand data available.</li>}
        </ul>
      </div>
      <div className="mb-4">
        <span className="font-semibold text-cyan-400">Models performance (decreasing order):</span>
        <ul className="list-disc ml-6 mt-1 text-gray-200">
          {modelPerf.length ? modelPerf.map(({ name, positive }) => (
            <li key={name} className="mb-1">
              <span className="text-indigo-400 font-semibold">{name}</span>: {positive} positive reviews
            </li>
          )) : <li className="text-gray-200">No model data available.</li>}
        </ul>
      </div>
      <style jsx global>{`
        .pdf-export, .pdf-export * {
          color: #222 !important;
          background-color: #fff !important;
        }
        .pdf-export .text-blue-600 { color: #2563eb !important; }
        .pdf-export .text-cyan-400 { color: #0891b2 !important; }
        .pdf-export .text-green-600 { color: #16a34a !important; }
        .pdf-export .text-gray-200 { color: #4b5563 !important; }
      `}</style>
    </div>
  );
}