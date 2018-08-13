import React from 'react';
import App from './app';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import ResetPasswordPage from './pages/resetPasswordPage';
import Meal from './pages/mealPage';
import AddMeal from './pages/addMealPage';
import Meals from './pages/mealsPage';
import Users from './pages/usersPage';
import UserProfile from './pages/userProfile';
import OtherUserProfile from './pages/otherUserProfile';
import TermsAndConditions from './pages/policies/termsAndConditions';
import Privacy from './pages/policies/privacy';
import CookiesPolicy from './pages/policies/cookiesPolicy';
import NotFoundPage from './pages/notFound404Page';

export default [
    {
        path: '/meal',
        ...App,
        routes: [
            {
                path: '/meal/add',
                ...AddMeal
            },
            {
                path: '/meal/edit/:id',
                ...AddMeal
            },
            {
                path: '/meal/:id',
                ...Meal
            }
        ]
    },
    {
        path: '/meals',
        ...App,
        routes: [
            {
            path: '/meals/:id',
            ...Meals
            },
            {
                path: '/meals',
                ...Meals
            }
        ]
    },
    {
        path: '/register',
        ...App,
        routes: [
            {
                ...RegisterPage
            }
        ]
    },
    {
        path: '/user',
        ...App,
        routes: [
            {
                path: '/user/profile',
                ...UserProfile
            },
            {
                path: '/user/:id',
                ...OtherUserProfile
            }
        ]
    },
    {
        path: '/users',
        ...App,
        routes: [
            {
                path: '/users',
                ...Users
            }
        ]
    },
    {
        path: '/login',
        ...App,
        routes: [
            {
                ...LoginPage
            }
        ]
    },
    {
        path: '/reset-password',
        ...App,
        routes: [
            {
                ...ResetPasswordPage
            }
        ]
    },
    {
        path: '/policies/terms',
        ...App,
        routes: [
            {
                ...TermsAndConditions
            }
        ]
    },
    {
        path: '/policies/privacy',
        ...App,
        routes: [
            {
                ...Privacy
            }
        ]
    },
    {
        path: '/policies/cookies',
        ...App,
        routes: [
            {
                ...CookiesPolicy
            }
        ]
    },
    {
        path: '/',
        exact: true,
        ...App,
        routes: [
            {
                ...Meals
            }
        ]
    },
    {
        path: '/',
        ...App,
        routes: [
            {
                ...NotFoundPage
            }
        ]
    }
];

