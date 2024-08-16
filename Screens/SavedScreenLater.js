import React from 'react';
import SavedScreenTemplate from './ScreenTemplates/SavedScreenTemplate';

export default function SavedScreenLater() {
    const filterFunction = manhwa => manhwa.reading === 1
    return <SavedScreenTemplate filterFunction={filterFunction} categoryName="later" />;
}
