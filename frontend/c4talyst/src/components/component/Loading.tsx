import React from 'react';
import './loading.css';

export function Loading () {
    return (
        <div className="loading-message">
            <div className="loader">
            <div className="spinner"></div>
            </div>
        </div>
    );
}

export default Loading;