import React from 'react';
import SavedScreenTemplate from './ScreenTemplates/SavedScreenTemplate';

export default function SavedScreenOngoing() {
    const filterFunction = manhwa => manhwa.chapter > 1 && manhwa.reading === 0 && manhwa.chapter.toFixed(1) !== manhwa.chapters.toFixed(1) && manhwa.category == undefined
    return <SavedScreenTemplate filterFunction={filterFunction} categoryName="ongoing" />;
}
