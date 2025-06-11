// "use client";
// import React from "react";

// interface FeatureSummary {
//   feature: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   "Product Name": string;
//   Month?: string;
//   Age?: string;
//   Brand?: string;
// }

// interface ProductSummary {
//   "Product Name": string;
//   Brand?: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   Month?: string;
// }

// interface AgeSummary {
//   Age: string;
//   POSITIVE: number;
//   NEGATIVE: number;
//   "Product Name": string;
//   Brand?: string;
//   Month?: string;
// }

// interface SentimentData {
//   feature_summary?: FeatureSummary[];
//   sentiment_by_brand?: ProductSummary[];
//   sentiment_by_product?: ProductSummary[];
//   sentiment_by_age?: AgeSummary[];
// }

// interface GlobalAnalyticsSectionProps {
//   data: SentimentData;
//   selectedPhoneNames: string[];
// }

// export default function GlobalAnalyticsSection({ data, selectedPhoneNames }: GlobalAnalyticsSectionProps) {
//   const ageFeatureMap = (() => {
//     if (!data?.feature_summary?.length) return [];

//     // Filter features for selected phones only
//     const relevantFeatures = data.feature_summary.filter(f => {
//       return selectedPhoneNames.includes(f["Product Name"]);
//     });

//     if (!relevantFeatures.length) {
//       // Debug output
//       console.warn('No relevant features found for selected phones.');
//       console.warn('Available product names in data:', Array.from(new Set(data.feature_summary.map(f => f["Product Name"]))))

//       console.warn('Selected product names:', selectedPhoneNames);
//       return [];
//     }

//     // Group by Age and feature, sum POSITIVE and NEGATIVE
//     const map: Record<string, { feature: string; POSITIVE: number; NEGATIVE: number; totalReviews: number }[]> = {};
    
//     // First, process feature_summary data
//     relevantFeatures.forEach(f => {
//       if (!f.Age || !f.feature) return;
//       if (!map[f.Age]) map[f.Age] = [];
//       const existing = map[f.Age].find(x => x.feature === f.feature);
//       if (existing) {
//         existing.POSITIVE += f.POSITIVE;
//         existing.NEGATIVE += f.NEGATIVE;
//         existing.totalReviews += (f.POSITIVE + f.NEGATIVE);
//       } else {
//         map[f.Age].push({ 
//           feature: f.feature, 
//           POSITIVE: f.POSITIVE,
//           NEGATIVE: f.NEGATIVE,
//           totalReviews: f.POSITIVE + f.NEGATIVE 
//         });
//       }
//     });
//     // Then, if we have sentiment_by_age data, incorporate it
//     if (data.sentiment_by_age?.length) {
//       data.sentiment_by_age.forEach(a => {
//         if (!selectedPhoneNames.includes(a["Product Name"])) return;
//         if (!map[a.Age]) map[a.Age] = [];
//         // Add this age group's sentiment to all features for this product
//         const relevantFeaturesForProduct = relevantFeatures.filter(f => f["Product Name"] === a["Product Name"]);
//         relevantFeaturesForProduct.forEach(f => {
//           if (!f.feature) return;
//           const existing = map[a.Age].find(x => x.feature === f.feature);
//           if (existing) {
//             existing.POSITIVE += a.POSITIVE;
//             existing.NEGATIVE += a.NEGATIVE;
//             existing.totalReviews += (a.POSITIVE + a.NEGATIVE);
//           } else {
//             // If this feature doesn't exist for this age group yet, add it
//             map[a.Age].push({
//               feature: f.feature,
//               POSITIVE: a.POSITIVE,
//               NEGATIVE: a.NEGATIVE,
//               totalReviews: a.POSITIVE + a.NEGATIVE
//             });
//           }
//         });
//       });
//     }
//     // For each age group, find features with highest sentiment ratio (min 5 reviews)
//     return Object.entries(map).map(([age, arr]) => {
//       const featuresWithEnoughReviews = arr.filter(x => x.totalReviews >= 5);
//       if (!featuresWithEnoughReviews.length) return null;
//       // Calculate sentiment score (ratio of positive to total reviews)
//       const withScores = featuresWithEnoughReviews.map(x => ({
//         ...x,
//         score: x.POSITIVE / x.totalReviews
//       }));
//       // Sort by score and take top 3
//       const best = withScores
//         .sort((a, b) => b.score - a.score)
//         .slice(0, 3)
//         .map(x => ({
//           ...x,
//           positivePercentage: Math.round(x.score * 100)
//         }));
//       return { age, best };
//     }).filter((x): x is NonNullable<typeof x> => x !== null && x.best.length > 0);
//   })();

//   const brandPerf = (() => {
//     if (!data?.sentiment_by_brand?.length) return [];
//     // Sum POSITIVE for each brand and collect their products
//     const brandMap = new Map<string, { brand: string; positive: number; products: Set<string> }>();
//     data.sentiment_by_brand.forEach((b: ProductSummary) => {
//       if (!b.Brand) return;
//       if (!brandMap.has(b.Brand)) {
//         brandMap.set(b.Brand, { brand: b.Brand, positive: 0, products: new Set() });
//       }
//       const brandData = brandMap.get(b.Brand)!;
//       brandData.positive += (b.POSITIVE || 0);
//       if (b["Product Name"]) {
//         brandData.products.add(b["Product Name"]);
//       }
//     });
//     return Array.from(brandMap.values())
//       .map(data => ({
//         ...data,
//         products: Array.from(data.products)
//       }))
//       .sort((a, b) => b.positive - a.positive);
//   })();

//   const modelPerf = (() => {
//     if (!data?.sentiment_by_product?.length) return [];
//     // Sum POSITIVE for each model with product name only
//     const modelMap = new Map<string, { name: string; positive: number }>();
//     data.sentiment_by_product.forEach((m: ProductSummary) => {
//       if (!m["Product Name"]) return;
//       if (!modelMap.has(m["Product Name"])) {
//         modelMap.set(m["Product Name"], { name: m["Product Name"], positive: 0 });
//       }
//       const model = modelMap.get(m["Product Name"])!;
//       model.positive += (m.POSITIVE || 0);
//     });
//     return Array.from(modelMap.values())
//       .sort((a, b) => b.positive - a.positive)
//   })();

//   return (
//     <div className="w-full mb-8 mt-12">
//       <h3 className="text-2xl font-bold text-blue-400 mb-4">📈 Overall Analytics</h3>
//       {/* 1. Age group and feature preference */}
//       {false && (
//       <div className="mb-4">
//         <span className="font-semibold text-cyan-300">Which age group likes which feature the most:</span>
//         <ul className="list-disc ml-6 mt-1">
//           {ageFeatureMap.length ? ageFeatureMap.map(({ age, best }) => (
//             <li key={age} className="mb-2">
//               <span className="text-blue-700 font-semibold">{age}</span>: {' '}
//               {best.map((x, i) => (
//                 <React.Fragment key={x.feature}>
//                   {i > 0 && ', '}
//                   <span className="text-green-700">{x.feature}</span>
//                   <span className="text-gray-600"> ({x.positivePercentage}% positive from {x.totalReviews} reviews)</span>
//                 </React.Fragment>
//               ))}
//             </li>
//           )) : <li className="text-gray-300">No age-feature data available for the selected phones.</li>}
//         </ul>
//       </div>
//       )}
//       {/* 2. Brand performance */}
//       <div className="mb-4">
//         <span className="font-semibold text-cyan-300">Brands performance (decreasing order):</span>
//         <ul className="list-disc ml-6 mt-1">
//           {brandPerf.length ? brandPerf.map(({ brand, positive, products }) => (
//             <li key={brand} className="mb-2 text-gray-300">
//               <div>
//                 <span className="text-blue-400 font-semibold">{brand}</span>: {positive} positive reviews
//               </div>
//               <div className="ml-4 text-sm text-green-300">
//                 Models: {products.join(", ")}
//               </div>
//             </li>
//           )) : <li className="text-gray-300">No brand data available.</li>}
//         </ul>
//       </div>
//       {/* 3. Model performance */}
//       <div className="mb-4">
//         <span className="font-semibold text-cyan-300">Models performance (decreasing order):</span>
//         <ul className="list-disc ml-6 mt-1 text-gray-300">
//           {modelPerf.length ? modelPerf.map(({ name, positive }) => (
//             <li key={name} className="mb-1">
//               <span className="text-blue-400 font-semibold">{name}</span>: {positive} positive reviews
//             </li>
//           )) : <li className="text-gray-300">No model data available.</li>}
//         </ul>
//       </div>
//     </div>
//   );
// }





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
  const ageFeatureMap = (() => {
    if (!data?.feature_summary?.length) return [];

    // Filter features for selected phones only
    const relevantFeatures = data.feature_summary.filter(f => {
      return selectedPhoneNames.includes(f["Product Name"]);
    });

    if (!relevantFeatures.length) {
      // Debug output
      console.warn('No relevant features found for selected phones.');
      console.warn('Available product names in data:', Array.from(new Set(data.feature_summary.map(f => f["Product Name"]))));
      console.warn('Selected product names:', selectedPhoneNames);
      return [];
    }

    // Group by Age and feature, sum POSITIVE and NEGATIVE
    const map: Record<string, { feature: string; POSITIVE: number; NEGATIVE: number; totalReviews: number }[]> = {};
    
    // First, process feature_summary data
    relevantFeatures.forEach(f => {
      if (!f.Age || !f.feature) return;
      if (!map[f.Age]) map[f.Age] = [];
      const existing = map[f.Age].find(x => x.feature === f.feature);
      if (existing) {
        existing.POSITIVE += f.POSITIVE;
        existing.NEGATIVE += f.NEGATIVE;
        existing.totalReviews += (f.POSITIVE + f.NEGATIVE);
      } else {
        map[f.Age].push({ 
          feature: f.feature, 
          POSITIVE: f.POSITIVE,
          NEGATIVE: f.NEGATIVE,
          totalReviews: f.POSITIVE + f.NEGATIVE 
        });
      }
    });
    // Then, if we have sentiment_by_age data, incorporate it
    if (data.sentiment_by_age?.length) {
      data.sentiment_by_age.forEach(a => {
        if (!selectedPhoneNames.includes(a["Product Name"])) return;
        if (!map[a.Age]) map[a.Age] = [];
        // Add this age group's sentiment to all features for this product
        const relevantFeaturesForProduct = relevantFeatures.filter(f => f["Product Name"] === a["Product Name"]);
        relevantFeaturesForProduct.forEach(f => {
          if (!f.feature) return;
          const existing = map[a.Age].find(x => x.feature === f.feature);
          if (existing) {
            existing.POSITIVE += a.POSITIVE;
            existing.NEGATIVE += a.NEGATIVE;
            existing.totalReviews += (a.POSITIVE + a.NEGATIVE);
          } else {
            // If this feature doesn't exist for this age group yet, add it
            map[a.Age].push({
              feature: f.feature,
              POSITIVE: a.POSITIVE,
              NEGATIVE: a.NEGATIVE,
              totalReviews: a.POSITIVE + a.NEGATIVE
            });
          }
        });
      });
    }
    // For each age group, find features with highest sentiment ratio (min 5 reviews)
    return Object.entries(map).map(([age, arr]) => {
      const featuresWithEnoughReviews = arr.filter(x => x.totalReviews >= 5);
      if (!featuresWithEnoughReviews.length) return null;
      // Calculate sentiment score (ratio of positive to total reviews)
      const withScores = featuresWithEnoughReviews.map(x => ({
        ...x,
        score: x.POSITIVE / x.totalReviews
      }));
      // Sort by score and take top 3
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
    // Sum POSITIVE for each brand and collect their products
    const brandMap = new Map<string, { brand: string; positive: number; products: Set<string> }>();
    data.sentiment_by_brand.forEach((b: ProductSummary) => {
      if (!b.Brand) return;
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
    // Sum POSITIVE for each model with product name only
    const modelMap = new Map<string, { name: string; positive: number }>();
    data.sentiment_by_product.forEach((m: ProductSummary) => {
      if (!m["Product Name"]) return;
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
      {/* 1. Age group and feature preference */}
      <div className="mb-4">
        <span className="font-semibold text-cyan-400">Which age group likes which feature the most:</span>
        <ul className="list-disc ml-6 mt-1">
          {ageFeatureMap.length ? ageFeatureMap.map(({ age, best }) => (
            <li key={age} className="mb-2">
              <span className="text-blue-500 font-semibold">{age}</span>: {' '}
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
      {/* 2. Brand performance */}
      <div className="mb-4">
        <span className="font-semibold text-cyan-400">Brands performance (decreasing order):</span>
        <ul className="list-disc ml-6 mt-1">
          {brandPerf.length ? brandPerf.map(({ brand, positive, products }) => (
            <li key={brand} className="mb-2 text-gray-200">
              <div>
                <span className="text-blue-500 font-semibold">{brand}</span>: {positive} positive reviews
              </div>
              <div className="ml-4 text-sm text-green-600">
                Models: {products.join(", ")}
              </div>
            </li>
          )) : <li className="text-gray-200">No brand data available.</li>}
        </ul>
      </div>
      {/* 3. Model performance */}
      <div className="mb-4">
        <span className="font-semibold text-cyan-400">Models performance (decreasing order):</span>
        <ul className="list-disc ml-6 mt-1 text-gray-200">
          {modelPerf.length ? modelPerf.map(({ name, positive }) => (
            <li key={name} className="mb-1">
              <span className="text-blue-500 font-semibold">{name}</span>: {positive} positive reviews
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