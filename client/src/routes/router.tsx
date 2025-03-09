import { Routes, Route } from "react-router-dom";
import {
    AdminLayout,
    AdminOverviewPage,
    AdminSettingsPage,
    AdminProductsListPage,
    AdminCreateProductPage,
    AdminEditProductPage,
    AdminCustomersListPage,
    AdminSingleCustomerPage,
    AdminOrdersListPage,
    AdminSingleOrderPage,
    AdminReviewsListPage,
} from "./admin";

import {
    AuthLayout,
    AuthSignInPage,
    AuthSignUpPage,
    AuthForgotPasswordPage,
    AuthResetPasswordPage,
    AuthVerificationPage,

} from "./auth";


import {
    RootLayout, RootHomePage, RootSingleProductPage, RootProductsListPage, RootCartPage, RootCheckoutPage,
    RootSuccessCheckoutPage
} from "./root";

import { AccountLayout, AccountOrdersPage, AccountWishlistPage, AccountSettingsPage } from "./root/account";

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<RootLayout />}>
                <Route path="/" element={<RootHomePage />} />
                <Route path="/products/:id" element={<RootSingleProductPage />} />
                <Route path="/products" element={<RootProductsListPage />} />
                <Route path="/cart" element={<RootCartPage />} />
                <Route path="/checkout" element={<RootCheckoutPage />} />
                <Route path="/checkout/success" element={<RootSuccessCheckoutPage />} />
                <Route path="/account" element={<AccountLayout />}>
                    <Route path="orders" element={<AccountOrdersPage />} />
                    <Route path="wishlist" element={<AccountWishlistPage />} />
                    <Route path="settings" element={<AccountSettingsPage />} />
                </Route>

                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="sign-in" element={<AuthSignInPage />} />
                    <Route path="sign-up" element={<AuthSignUpPage />} />
                    <Route path="forgot-password" element={<AuthForgotPasswordPage />} />
                    <Route path="reset-password" element={<AuthResetPasswordPage />} />
                    <Route path="verify" element={<AuthVerificationPage />} />
                </Route>
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
                <Route path="overview" element={<AdminOverviewPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="products" element={<AdminProductsListPage />} />
                <Route path="products/create" element={<AdminCreateProductPage />} />
                <Route path="products/edit/:id" element={<AdminEditProductPage />} />
                <Route path="customers" element={<AdminCustomersListPage />} />
                <Route path="customers/:id" element={<AdminSingleCustomerPage />} />
                <Route path="orders" element={<AdminOrdersListPage />} />
                <Route path="orders/:id" element={<AdminSingleOrderPage />} />
                <Route path="reviews" element={<AdminReviewsListPage />} />
            </Route>

        </Routes>
    )
}