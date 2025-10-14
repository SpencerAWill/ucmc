'use client';
import { IDetectedBarcode, IScannerProps, Scanner } from '@yudiel/react-qr-scanner';
import { useCallback } from 'react';

export type ItemScannerProps = Omit<IScannerProps, 'onScan'> & {
    onItemsScanned?: (itemIds: string[]) => void
};

export default function ItemScanner({ onItemsScanned, ...props }: ItemScannerProps) {

    const handleOnScan = useCallback((barcodes: IDetectedBarcode[]) => {
        const itemIds = barcodes.map(barcode => barcode.rawValue);
        onItemsScanned?.(itemIds);
    }, [onItemsScanned]);

    return <Scanner
        {...props}
        onScan={handleOnScan}
    />;
}