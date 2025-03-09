import { Router } from "express";
import { tryCatch } from "../middlewares/trycatch.middleware";
import { withAuth, authorizedFor } from "../middlewares/auth.middleware";

import {
  signUp,
  signIn,
  signOut,
  getMyAccount,
  updateAccountById,
  toggleBlockById,
  toggleDeleteById,
  verifyAccount,
  forgotPassword,
  updatePassword,
  resetPassword,
  sendVerificationEmail,
  getAccounts,
  getAccountById,
  authAsGuest,
} from "../controllers/account.controller";

const router = Router();

router.post("/sign-up", tryCatch(signUp));
router.post("/sign-in", tryCatch(signIn));
router.post("/auth-as-guest", tryCatch(authAsGuest));
router.post("/sign-out", withAuth, tryCatch(signOut));
router.get("/get-my-account", withAuth, tryCatch(getMyAccount));
router.put("/update-account-by-id/:id", withAuth, tryCatch(updateAccountById));
router.put(
  "/toggle-account-block-by-id/:id",
  withAuth,
  authorizedFor("admin","guest"),
  tryCatch(toggleBlockById)
);
router.put(
  "/toggle-account-delete-by-id/:id",
  withAuth,
  tryCatch(toggleDeleteById)
);
router.post("/verify-account", tryCatch(verifyAccount));
router.post("/forgot-password", tryCatch(forgotPassword));
router.post("/update-password", withAuth, tryCatch(updatePassword));
router.post("/reset-password/:passwordResetToken", tryCatch(resetPassword));
router.post(
  "/send-verification-email",
  withAuth,
  tryCatch(sendVerificationEmail)
);
router.get(
  "/get-accounts",
  withAuth,
  authorizedFor("admin","guest"),
  tryCatch(getAccounts)
);

router.get(
  "/get-account/:id",
  withAuth,
  authorizedFor("admin","guest"),
  tryCatch(getAccountById)
);

export { router as accountRouter };
