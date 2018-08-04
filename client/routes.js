import React from 'react';
import App from './app';
import RegisterPage from './pages/registerPage';
import LoginPage from './pages/loginPage';
import ResetPasswordPage from './pages/resetPasswordPage';
import Property from './pages/propertyPage';
import AddProperty from './pages/addPropertyPage';
import Properties from './pages/propertiesPage';
import Users from './pages/usersPage';
import UserProfile from './pages/userProfile';
import OtherUserProfile from './pages/otherUserProfile';
import TermsAndConditions from './pages/policies/termsAndConditions';
import Privacy from './pages/policies/privacy';
import CookiesPolicy from './pages/policies/cookiesPolicy';
import NotFoundPage from './pages/notFound404Page';

export default [
    {
        path: '/property',
        ...App,
        routes: [
            {
                path: '/property/add',
                ...AddProperty
            },
            {
                path: '/property/edit/:id',
                ...AddProperty
            },
            {
                path: '/property/:id',
                ...Property
            }
        ]
    },
    {
        path: '/properties',
        ...App,
        routes: [
            {
                path: '/properties/map',
                ...Properties
            },
            {
                path: '/properties',
                ...Properties
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
                ...Properties
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

