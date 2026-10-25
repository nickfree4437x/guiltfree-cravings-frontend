import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

// ─── Types ────────────────────────────────────────────────
export interface ProfileFormData {
  name: string;
  email: string;
}

export interface ProfileFormErrors {
  name: string;
  email: string;
}

// ─── Config ───────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL_FORM: ProfileFormData = { name: "", email: "" };
const INITIAL_ERRORS: ProfileFormErrors = { name: "", email: "" };

// ─── Validation (pure) ────────────────────────────────────
function validate(formData: ProfileFormData): ProfileFormErrors {
  const errors: ProfileFormErrors = { name: "", email: "" };

  const name = formData.name.trim();
  if (!name) errors.name = "Please enter your full name.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters long.";
  else if (name.length > 100) errors.name = "Name cannot exceed 100 characters.";

  const email = formData.email.trim().toLowerCase();
  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_REGEX.test(email)) errors.email = "Please enter a valid email address.";

  return errors;
}

// ─── Component ────────────────────────────────────────────
function ProfilePage() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<ProfileFormErrors>(INITIAL_ERRORS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageError, setPageError] = useState("");

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) navigate("/cart", { replace: true });
  }, [isAuthenticated, navigate]);

  // Load profile
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setPageError("");

        const data = await getMyProfile();
        if (!isMounted) return;

        setProfile(data);
        setFormData({ name: data.name ?? "", email: data.email ?? "" });

        // Sync Zustand with latest DB profile
        const token = useAuthStore.getState().token;
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
        console.error("Failed to load profile:", error);
        if (!isMounted) return;
        setPageError("Unable to load your profile right now. Please try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadProfile();
    return () => { isMounted = false; };
  }, [isAuthenticated, login]);

  // ─── Handlers ───────────────────────────────────────────
  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setPageError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPageError("");

    const newErrors = validate(formData);
    setErrors(newErrors);

    const isValid = !Object.values(newErrors).some((e) => e !== "");
    if (!isValid) return;

    try {
      setIsSaving(true);

      const updatedUser = await updateMyProfile({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      });

      setProfile(updatedUser);
      setFormData({ name: updatedUser.name ?? "", email: updatedUser.email ?? "" });

      // Sync Zustand
      const token = useAuthStore.getState().token;
      if (token) {
        login(token, {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email ?? "",
          phone: updatedUser.phone,
          isVerified: updatedUser.isVerified,
        });
      }

      toast.success("Profile updated successfully.", { duration: 3000 });
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setPageError(
        error?.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Early returns ──────────────────────────────────────
  if (!isAuthenticated) return null;
  if (isLoading) return <ProfileLoading />;
  if (pageError && !profile) return <ProfileLoadError message={pageError} />;

  const phone = profile?.phone || user?.phone || "";

  // ─── Render ─────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pt-24">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <ProfileHeader />
        </div>

        {/* Main layout */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_290px] lg:gap-7">
          <section aria-label="Profile information" className="min-w-0">
            <ProfileForm
              formData={formData}
              errors={errors}
              pageError={pageError}
              isSaving={isSaving}
              phone={phone}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </section>

          <aside
            aria-label="Profile account information"
            className="min-w-0 space-y-4 lg:sticky lg:top-24"
          >
            <ProfileVerificationCard phone={phone} />
            <ProfileQuickLinks />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;