import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Dark-only theme — no toggle needed
    return (
        <ThemeContext.Provider value={{ isDark: true, toggleTheme: () => { } }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
