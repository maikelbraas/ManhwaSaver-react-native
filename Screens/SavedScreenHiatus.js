import React from 'react';
import SavedScreenTemplate from './ScreenTemplates/SavedScreenTemplate';

export default function SavedScreenHiatus() {
    const filterFunction = manhwa => manhwa.status.trim().toLowerCase() === 'hiatus' && manhwa.reading === 0 && (manhwa.category === undefined || manhwa.category == 'hiatus')
    return <SavedScreenTemplate filterFunction={filterFunction} categoryName="hiatus" />;
}

