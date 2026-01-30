"use client";

import { useRef, useEffect, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("/api/scan", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Scan failed");
      }

      if (data?.warning) {
        toast.warning(data.warning);
      } else if (!data?.fromFallback) {
        toast.success("Receipt extracted successfully");
      }

      setScannedData(data);
    } catch (err) {
      toast.error(err.message || "Failed to scan receipt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scannedData && !loading) {
      onScanComplete(scannedData);
      toast.success("Receipt scanned successfully");
    }
  }, [loading, scannedData]);

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
}
