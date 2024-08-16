import React from 'react';
import SavedScreenTemplate from './ScreenTemplates/SavedScreenTemplate';

export default function SavedScreenTry() {
    const filterFunction = manhwa => manhwa.reading === 0 && manhwa.chapter === 1 && (manhwa.category === undefined || manhwa.category == 'try')
    return <SavedScreenTemplate filterFunction={filterFunction} categoryName="try" />;
}

