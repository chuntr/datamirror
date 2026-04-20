/**
 * pages.config.js - Page routing configuration
 *
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 *
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 *
 * Example file structure:
 *
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 *
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Home from './pages/Home';
import PreQuiz from './pages/PreQuiz';
import BrowseRound1 from './pages/BrowseRound1';
import ReportRound1 from './pages/ReportRound1';
import BrowseRound2 from './pages/BrowseRound2';
import ReportRound2 from './pages/ReportRound2';
import PostQuiz from './pages/PostQuiz';
import Resources from './pages/Resources';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "PreQuiz": PreQuiz,
    "BrowseRound1": BrowseRound1,
    "ReportRound1": ReportRound1,
    "BrowseRound2": BrowseRound2,
    "ReportRound2": ReportRound2,
    "PostQuiz": PostQuiz,
    "Resources": Resources,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};

