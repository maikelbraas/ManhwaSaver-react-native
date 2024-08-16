import React from 'react';
import SavedScreenTemplate from './ScreenTemplates/SavedScreenTemplate';

export default function SavedScreenUpToDate() {
    const filterFunction = manhwa => manhwa.reading === 0 && manhwa.chapter.toFixed(1) == manhwa.chapters.toFixed(1) && manhwa.status.trim().toLowerCase() != 'hiatus' && (manhwa.category === undefined || manhwa.category == 'uptodate')
    return <SavedScreenTemplate filterFunction={filterFunction} categoryName="uptodate" />;
}
