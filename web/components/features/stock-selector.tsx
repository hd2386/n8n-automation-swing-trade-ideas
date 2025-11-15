"use client";

import { useState } from "react";
import { AVAILABLE_STOCKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import Image from "next/image";

interface StockSelectorProps {
  selectedStocks: string[];
  onSelectionChange: (stocks: string[]) => void;
  maxSelections?: number;
}

export function StockSelector({
  selectedStocks,
  onSelectionChange,
  maxSelections = 5,
}: StockSelectorProps) {
  const [open, setOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const availableStocks = AVAILABLE_STOCKS.filter(
    (stock) => !selectedStocks.includes(stock.ticker)
  );

  const handleAddStock = (ticker: string) => {
    if (
      selectedStocks.length < maxSelections &&
      !selectedStocks.includes(ticker)
    ) {
      onSelectionChange([...selectedStocks, ticker]);
    }
  };

  const handleRemoveStock = (ticker: string) => {
    onSelectionChange(selectedStocks.filter((s) => s !== ticker));
  };

  const getStockName = (ticker: string) => {
    return AVAILABLE_STOCKS.find((s) => s.ticker === ticker)?.name || ticker;
  };

  const getStockIcon = (ticker: string) => {
    // Using TradingView logo service (more reliable and up-to-date)
    // Format: https://s3-symbol-logo.tradingview.com/{ticker}.svg
    return `https://s3-symbol-logo.tradingview.com/${ticker.toLowerCase()}.svg`;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium leading-none">
          Select Stocks ({selectedStocks.length}/{maxSelections})
        </label>
        <p className="text-sm text-muted-foreground mt-1">
          Choose 1-{maxSelections} stocks to receive daily signals for
        </p>
      </div>

      {selectedStocks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedStocks.map((ticker) => (
            <Badge
              key={ticker}
              variant="secondary"
              className="flex items-center gap-2 px-3 py-1.5"
            >
              <div className="relative h-4 w-4 overflow-hidden rounded bg-muted flex items-center justify-center">
                {failedImages.has(ticker) ? (
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {ticker[0]}
                  </span>
                ) : (
                  <Image
                    src={getStockIcon(ticker)}
                    alt={ticker}
                    width={16}
                    height={16}
                    className="object-contain"
                    unoptimized
                    onError={() => {
                      setFailedImages((prev) => new Set(prev).add(ticker));
                    }}
                  />
                )}
              </div>
              <span className="font-medium">{ticker}</span>
              <button
                type="button"
                onClick={() => handleRemoveStock(ticker)}
                className="ml-1 rounded-full hover:bg-muted"
                aria-label={`Remove ${ticker}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {selectedStocks.length < maxSelections && (
        <Select
          open={open}
          onOpenChange={setOpen}
          onValueChange={(value) => {
            handleAddStock(value);
            setOpen(false);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Add a stock..." />
          </SelectTrigger>
          <SelectContent>
            {availableStocks.map((stock) => (
              <SelectItem key={stock.ticker} value={stock.ticker}>
                <div className="flex items-center gap-2">
                  <div className="relative h-5 w-5 overflow-hidden rounded bg-muted flex items-center justify-center">
                    {failedImages.has(stock.ticker) ? (
                      <span className="text-xs font-bold text-muted-foreground">
                        {stock.ticker[0]}
                      </span>
                    ) : (
                      <Image
                        src={getStockIcon(stock.ticker)}
                        alt={stock.ticker}
                        width={20}
                        height={20}
                        className="object-contain"
                        unoptimized
                        onError={() => {
                          setFailedImages((prev) =>
                            new Set(prev).add(stock.ticker)
                          );
                        }}
                      />
                    )}
                  </div>
                  <span className="font-medium">{stock.ticker}</span>
                  <span className="text-muted-foreground text-sm">
                    - {stock.name}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedStocks.length >= maxSelections && (
        <p className="text-sm text-muted-foreground">
          Maximum {maxSelections} stocks selected. Remove one to add another.
        </p>
      )}
    </div>
  );
}
