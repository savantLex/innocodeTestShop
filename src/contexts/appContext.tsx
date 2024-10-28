import {createContext, useState, ReactNode, useContext, useEffect} from 'react';
import {availableThemes} from "../themeController";
import {IProduct} from "../api";


type AppProviderProps = {
    children: ReactNode;
};

export type AppContextType = {
    getState: () => AppState;
    updateState: (newState: Partial<AppState>) => void;
};

 const AppContext = createContext<AppContextType | undefined>(undefined);


type AppState = {
    isDrawerOpen?: boolean;
    theme: string;
    selectedCategories: Array<number>;
    selectedItems: Array<IProduct>;

};


const defaultState: AppState = {
    isDrawerOpen: false,
    theme: availableThemes.lightTheme,
    selectedCategories: [],
    selectedItems: [],
};

export const AppProvider = ({ children }: AppProviderProps) => {
    const [state, setState] = useState<AppState>(() => {
        // Load the theme from localStorage if it exists
        const storedTheme = localStorage.getItem('theme');
        return {
            ...defaultState,
            theme: storedTheme ? storedTheme : availableThemes.lightTheme,
        };
    });

    // Update localStorage whenever the theme changes
    useEffect(() => {
        localStorage.setItem('theme', state.theme);
    }, [state.theme]);

    const getState = (): AppState => {
        return { ...state }; // Returning a copy of the state
    };

    const updateState = (newState: Partial<AppState>): void => {
        setState((prevState) => {
            const updatedState = { ...prevState, ...newState };

            // If the theme was updated, store the new theme in localStorage
            if (newState.theme) {
                localStorage.setItem('theme', newState.theme);
            }

            return updatedState;
        });
    };

    return (
        <AppContext.Provider value={{ getState, updateState }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};


