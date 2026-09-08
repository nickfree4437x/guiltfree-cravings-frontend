import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getMyProfile,
  updateMyProfile,
  type UserProfile,
} from "../../api/userApi";

import { useAuthStore } from "../../store/authStore";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileLoading from "../../components/profile/ProfileLoading";
import ProfileLoadError from "../../components/profile/ProfileLoadError";
import ProfileForm from "../../components/profile/ProfileForm";
import ProfileVerificationCard from "../../components/profile/ProfileVerificationCard";
import ProfileQuickLinks from "../../components/profile/ProfileQuickLinks";

/*
 * =========================================================
 * FORM DATA
 * =========================================================
 */

export interface ProfileFormData {
  name: string;
  email: string;
}

/*
 * =========================================================
 * FORM ERRORS
 * =========================================================
 */

export interface ProfileFormErrors {
  name: string;
  email: string;
}

/*
 * =========================================================
 * PROFILE PAGE
 * =========================================================
 */

function ProfilePage() {
  const navigate = useNavigate();

  /*
   * =======================================================
   * AUTH STORE
   * =======================================================
   */

  const user = useAuthStore(
    (state) => state.user
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const login = useAuthStore(
    (state) => state.login
  );

  /*
   * =======================================================
   * PROFILE STATE
   * =======================================================
   */

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [formData, setFormData] =
    useState<ProfileFormData>({
      name: "",
      email: "",
    });

  const [errors, setErrors] =
    useState<ProfileFormErrors>({
      name: "",
      email: "",
    });

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [pageError, setPageError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /*
   * =======================================================
   * AUTH GUARD
   * =======================================================
   */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  /*
   * =======================================================
   * LOAD PROFILE
   * =======================================================
   */

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setPageError("");

        const data =
          await getMyProfile();

        if (!isMounted) {
          return;
        }

        setProfile(data);

        setFormData({
          name: data.name ?? "",
          email: data.email ?? "",
        });

        /*
         * Keep Zustand user synchronized
         * with the latest database profile.
         */

        const token =
          useAuthStore.getState().token;

        if (token) {
          login(token, {
            id: data.id,
            name: data.name,
            email: data.email ?? "",
            phone: data.phone,
            isVerified: data.isVerified,
          });
        }
      } catch (error) {
        console.error(
          "Failed to load profile:",
          error
        );

        if (!isMounted) {
          return;
        }

        setPageError(
          "Unable to load your profile right now. Please try again."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [
    isAuthenticated,
    login,
  ]);

  /*
   * =======================================================
   * INPUT CHANGE
   * =======================================================
   */

  const handleChange = (
    field: keyof ProfileFormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));

    setSuccessMessage("");
    setPageError("");
  };

  /*
   * =======================================================
   * VALIDATE FORM
   * =======================================================
   */

  const validateForm = () => {
    const newErrors: ProfileFormErrors = {
      name: "",
      email: "",
    };

    /*
     * NAME
     */

    const trimmedName =
      formData.name.trim();

    if (!trimmedName) {
      newErrors.name =
        "Please enter your full name.";
    } else if (
      trimmedName.length < 2
    ) {
      newErrors.name =
        "Name must be at least 2 characters long.";
    } else if (
      trimmedName.length > 100
    ) {
      newErrors.name =
        "Name cannot exceed 100 characters.";
    }

    /*
     * EMAIL
     */

    const trimmedEmail =
      formData.email
        .trim()
        .toLowerCase();

    if (!trimmedEmail) {
      newErrors.email =
        "Please enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedEmail
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    setErrors(newErrors);

    return !Object.values(
      newErrors
    ).some(
      (error) => error !== ""
    );
  };

  /*
   * =======================================================
   * SAVE PROFILE
   * =======================================================
   */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setPageError("");

    const isValid =
      validateForm();

    if (!isValid) {
      return;
    }

    try {
      setIsSaving(true);

      const updatedUser =
        await updateMyProfile({
          name: formData.name.trim(),
          email: formData.email
            .trim()
            .toLowerCase(),
        });

      /*
       * Update local profile.
       */

      setProfile(updatedUser);

      setFormData({
        name:
          updatedUser.name ?? "",
        email:
          updatedUser.email ?? "",
      });

      /*
       * Keep Zustand authentication
       * user synchronized.
       */

      const token =
        useAuthStore.getState().token;

      if (token) {
        login(token, {
          id: updatedUser.id,
          name: updatedUser.name,
          email:
            updatedUser.email ?? "",
          phone: updatedUser.phone,
          isVerified:
            updatedUser.isVerified,
        });
      }

      setSuccessMessage(
        "Profile updated successfully."
      );
    } catch (error: any) {
      console.error(
        "Failed to update profile:",
        error
      );

      const message =
        error?.response?.data?.message;

      if (message) {
        setPageError(message);
      } else {
        setPageError(
          "Unable to update your profile. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * =======================================================
   * PREVENT CONTENT FLASH
   * =======================================================
   */

  if (!isAuthenticated) {
    return null;
  }

  /*
   * =======================================================
   * LOADING STATE
   * =======================================================
   */

  if (isLoading) {
    return <ProfileLoading />;
  }

  /*
   * =======================================================
   * INITIAL LOAD ERROR
   * =======================================================
   */

  if (pageError && !profile) {
    return (
      <ProfileLoadError
        message={pageError}
      />
    );
  }

  /*
   * =======================================================
   * PROFILE PAGE
   * =======================================================
   */

  return (
    <main className="min-h-screen bg-[#fffaf5]">

      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pt-12">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 text-center sm:mb-10 lg:mb-12">
          <ProfileHeader />
        </div>

        {/* =================================================
            PROFILE CONTENT
        ================================================= */}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">

          {/* =================================================
              PROFILE FORM
          ================================================= */}

          <section
            className="min-w-0"
            aria-label="Profile information"
          >
            <ProfileForm
              formData={formData}
              errors={errors}
              successMessage={successMessage}
              pageError={pageError}
              isSaving={isSaving}
              phone={
                profile?.phone ||
                user?.phone ||
                ""
              }
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </section>

          {/* =================================================
              ACCOUNT SIDEBAR
          ================================================= */}

          <aside
            className="min-w-0 space-y-4 lg:sticky lg:top-24"
            aria-label="Profile account information"
          >
            <ProfileVerificationCard
              phone={
                profile?.phone ||
                user?.phone ||
                ""
              }
            />

            <ProfileQuickLinks />
          </aside>

        </div>

      </div>

    </main>
  );
}

export default ProfilePage;