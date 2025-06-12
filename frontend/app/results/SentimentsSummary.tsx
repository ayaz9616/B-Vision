'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface DebugTableModalProps {
  data: unknown;
  buttonLabel?: string;
}

export default function DebugTableModal({ data, buttonLabel = "Show Sentiment Analysis Table" }: DebugTableModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const downloadAsCSV = () => {
    if (!data || typeof data !== 'object') {
      alert("Invalid data");
      return;
    }

    const entries = Object.entries(data as Record<string, unknown>);
    let csvContent = "";

    for (const [sectionName, sectionData] of entries) {
      if (!Array.isArray(sectionData)) continue;

      csvContent += `${sectionName}\n`;

      if (sectionData.length === 0) {
        csvContent += "No data available\n\n";
        continue;
      }

      const keys = Object.keys(sectionData[0] as Record<string, unknown>);
      csvContent += keys.join(",") + "\n";

      for (const row of sectionData) {
        const rowData = keys.map((key) => {
          const cell = (row as Record<string, unknown>)[key];
          return `"${String(cell).replace(/"/g, '""')}"`;
        }).join(",");
        csvContent += rowData + "\n";
      }
      csvContent += "\n";
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Sentiment-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        className="bg-gradient-to-r from-indigo-700 to-green-900 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300"
        onClick={() => setIsOpen(true)}
        >
        {buttonLabel}
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-[#181b23] text-white p-6 shadow-xl transition-all border border-[#23243a]">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-semibold">Processed Sentiment Analysis</Dialog.Title>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        onClick={downloadAsCSV}
                      >
                        Download CSV
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        onClick={() => setIsOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <div className="overflow-auto max-h-[75vh] text-xs">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-800 sticky top-0">
                        <tr>
                          <th className="px-2 py-1 border-b border-gray-300 text-left">Key</th>
                          <th className="px-2 py-1 border-b border-gray-300 text-left">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                            if (data && typeof data === 'object' && data !== null) {
                            return Object.entries(data as Record<string, unknown>).map(([key, value]) => (
                                <tr key={key} className="border-b border-gray-700 align-top">
                                <td className="px-2 py-1 font-semibold text-blue-300 align-top">{key}</td>
                                <td className="px-2 py-1 align-top whitespace-pre-wrap break-all text-white">
                                    {Array.isArray(value) ? (
                                    <div className="overflow-x-auto max-h-40">
                                        <table className="min-w-full border border-gray-700 text-xs">
                                        <thead className="bg-gray-900">
                                            <tr>
                                            {value.length > 0 && typeof value[0] === 'object' ? (
                                                Object.keys(value[0] as Record<string, unknown>).map((col) => (
                                                <th key={col} className="px-1 py-0.5 border-b border-gray-700 text-left">{col}</th>
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
                                                {Object.values(row as Record<string, unknown>).map((cell, j) => (
                                                    <td key={j} className="px-1 py-0.5 align-top border-b border-gray-800 text-white">{String(cell)}</td>
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
                            ));
                            } else {
                            return null;
                            }
                        })()}
                        </tbody>
                        <tbody>
                        {(() => {
                            if (data && typeof data === 'object' && data !== null) {
                            return Object.entries(data as Record<string, unknown>).map(([key, value]) => (
                                <tr key={key} className="border-b border-gray-700 align-top">
                                <td className="px-2 py-1 font-semibold text-blue-300 align-top">{key}</td>
                                <td className="px-2 py-1 align-top whitespace-pre-wrap break-all text-white">
                                    {Array.isArray(value) ? (
                                    <div className="overflow-x-auto max-h-40">
                                        <table className="min-w-full border border-gray-700 text-xs">
                                        <thead className="bg-gray-900">
                                            <tr>
                                            {value.length > 0 && typeof value[0] === 'object' ? (
                                                Object.keys(value[0] as Record<string, unknown>).map((col) => (
                                                <th key={col} className="px-1 py-0.5 border-b border-gray-700 text-left">{col}</th>
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
                                                {Object.values(row as Record<string, unknown>).map((cell, j) => (
                                                    <td key={j} className="px-1 py-0.5 align-top border-b border-gray-800 text-white">{String(cell)}</td>
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
                            ));
                            } else {
                            return null;
                            }
                        })()}
                        </tbody>

                    </table>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
