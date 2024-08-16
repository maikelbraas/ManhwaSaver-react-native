import React from 'react';
import SavedScreenTemplate from './ScreenTemplates/SavedScreenTemplate';

export default function SavedScreenCompleted() {
    const filterFunction = manhwa => manhwa.reading === 0 && manhwa.chapter.toFixed(1) === manhwa.chapters.toFixed(1) && manhwa.status.trim().toLowerCase() === 'completed' && (manhwa.category === undefined || manhwa.category == 'completed')
    return <SavedScreenTemplate filterFunction={filterFunction} categoryName="completed" />;
}