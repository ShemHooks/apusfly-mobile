import GoogleIcon from "@/components/icons/GoogleIcon";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import { authService } from "@/services/auth.service";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import {
  Apple,
  ArrowLeft,
  Building2,
  Check,
  Plane,
  UserRound,
} from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

// ----------------------------------------
// VALIDATION
// ----------------------------------------

const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters."),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters."),
    email: z.email("Enter a valid email address."),
    phone: z
      .string()
      .regex(/^09\d{9}$/, "Enter a valid PH mobile number (09XXXXXXXXX)."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const accountTypes = {
  customer: {
    title: "Customer Account",
    description: "Discover and book professional drone services.",
    Icon: UserRound,
  },
  provider: {
    title: "Service Provider Account",
    description: "Offer drone services and manage your operations.",
    Icon: Building2,
  },
  pilot: {
    title: "Drone Pilot Account",
    description: "Build your portfolio and explore flying opportunities.",
    Icon: Plane,
  },
} as const;

type AccountRole = keyof typeof accountTypes;
type SocialProvider = "google" | "apple";

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

function getRegistrationError(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return (
        "Unable to connect to the ApusFly server. " +
        "Check your internet connection and API address."
      );
    }

    const response = error.response.data;

    const validationError = response?.errors
      ? Object.values(response.errors).flat()[0]
      : undefined;

    if (error.response.status >= 500) {
      return "The server encountered an error. Please try again later.";
    }

    return (
      validationError ||
      response?.message ||
      "Unable to create your account. Please try again."
    );
  }

  return "An unexpected error occurred. Please try again.";
}

// ----------------------------------------
// REGISTRATION SCREEN
// ----------------------------------------

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{
    role?: string;
  }>();

  const selectedRole: AccountRole | null =
    typeof role === "string" && role in accountTypes
      ? (role as AccountRole)
      : null;

  const account = selectedRole ? accountTypes[selectedRole] : null;

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(
    null,
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isBusy = isSubmitting || socialLoading !== null;

  // ----------------------------------------
  // TERMS VALIDATION
  // ----------------------------------------

  const validateAgreement = (): boolean => {
    if (!acceptedTerms) {
      Alert.alert(
        "Agreement Required",
        "Please accept the Terms of Service and Privacy Policy.",
      );
      return false;
    }

    return true;
  };

  // ----------------------------------------
  // EMAIL REGISTRATION
  // ----------------------------------------

  const onSubmit = async (data: RegisterForm) => {
    if (!selectedRole) {
      Alert.alert(
        "Account Type Required",
        "Please select an account type first.",
      );
      return;
    }

    if (!validateAgreement()) return;

    if (selectedRole === "provider") {
      Alert.alert(
        "Registration Unavailable",
        "Service Provider registration is not yet available. Please wait for provider onboarding.",
      );
      return;
    }

    try {
      await authService.register({
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        password: data.password,
        password_confirmation: data.confirmPassword,
        account_type: selectedRole,
      });

      Alert.alert(
        "Registration Successful!",
        "Your ApusFly account has been created successfully. You can now sign in.",
        [
          {
            text: "Sign In",
            onPress: () => router.replace("/(auth)/login"),
          },
        ],
      );
    } catch (error) {
      Alert.alert("Registration Failed", getRegistrationError(error));
    }
  };

  // ----------------------------------------
  // SOCIAL REGISTRATION
  // ----------------------------------------

  const handleSocialRegister = async (provider: SocialProvider) => {
    if (!selectedRole) {
      Alert.alert(
        "Account Type Required",
        "Please select an account type first.",
      );
      return;
    }

    if (!validateAgreement()) return;

    if (selectedRole !== "customer") {
      Alert.alert(
        "Social Registration Unavailable",
        "Google and Apple registration for pilot and provider accounts is not available yet.",
      );
      return;
    }

    setSocialLoading(provider);

    try {
      // Google account creation is intentionally not
      // enabled here until registration consent and
      // onboarding are integrated with the backend.
      //
      // Apple authentication is also pending.

      Alert.alert(
        provider === "google" ? "Google Registration" : "Apple Registration",
        "Social registration will be available after the account onboarding integration is completed.",
      );
    } finally {
      setSocialLoading(null);
    }
  };

  // ----------------------------------------
  // INVALID ACCOUNT TYPE
  // ----------------------------------------

  if (!account) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 px-6 bg-white">
        <Text className="mb-5 text-lg font-semibold text-center text-charcoal">
          Please select an account type first.
        </Text>

        <AppButton
          title="Choose Account Type"
          onPress={() => router.replace("/role-selection")}
        />
      </SafeAreaView>
    );
  }

  const AccountIcon = account.Icon;

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          paddingBottom: 48,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* BACK BUTTON */}
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="items-center justify-center mt-4 h-11 w-11 rounded-xl bg-surface"
        >
          <ArrowLeft size={22} color="#171717" />
        </Pressable>

        {/* HEADER */}
        <View className="mt-8">
          <Text className="text-3xl font-bold text-charcoal">
            Create your account
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-500">
            Join ApusFly and start your journey with us.
          </Text>
        </View>

        {/* SELECTED ACCOUNT TYPE */}
        <View className="flex-row items-center p-4 border border-green-200 mt-7 rounded-2xl bg-green-50">
          <View className="items-center justify-center w-12 h-12 mr-4 bg-white rounded-xl">
            <AccountIcon size={25} color="#559E1C" />
          </View>

          <View className="flex-1">
            <Text className="text-base font-bold text-charcoal">
              {account.title}
            </Text>

            <Text className="mt-1 text-sm leading-5 text-gray-500">
              {account.description}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/role-selection")}
            accessibilityRole="button"
            accessibilityLabel="Change account type"
            className="ml-2"
          >
            <Text className="text-xs font-semibold text-primary-dark">
              Change
            </Text>
          </Pressable>
        </View>

        {/* REGISTRATION FIELDS */}
        <View className="mt-8">
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="First Name"
                placeholder="Enter your first name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.firstName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Last Name"
                placeholder="Enter your last name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.lastName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Email Address"
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Phone Number"
                placeholder="09XXXXXXXXX"
                keyboardType="phone-pad"
                maxLength={11}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Password"
                placeholder="At least 8 characters"
                isPassword
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                isPassword
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </View>

        {/* TERMS AGREEMENT */}
        <View className="flex-row items-start gap-3 mt-2 mb-7">
          <Pressable
            onPress={() => setAcceptedTerms((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityLabel="Agree to Terms of Service and Privacy Policy"
            accessibilityState={{
              checked: acceptedTerms,
            }}
            className={`mt-1 h-6 w-6 items-center justify-center rounded-md border ${
              acceptedTerms
                ? "border-primary bg-primary"
                : "border-gray-400 bg-white"
            }`}
          >
            {acceptedTerms && (
              <Check size={16} color="#171717" strokeWidth={3} />
            )}
          </Pressable>

          <View className="flex-1">
            <Text className="text-sm leading-6 text-gray-600">
              I have read and agree to the
            </Text>

            <View className="flex-row flex-wrap items-center">
              <Pressable onPress={() => router.push("/terms")}>
                <Text className="text-sm font-semibold text-primary-dark">
                  Terms of Service
                </Text>
              </Pressable>

              <Text className="text-sm text-gray-600"> and </Text>

              <Pressable onPress={() => router.push("/privacy")}>
                <Text className="text-sm font-semibold text-primary-dark">
                  Privacy Policy
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* EMAIL REGISTRATION */}
        <AppButton
          title="Create Account"
          loading={isSubmitting}
          disabled={isBusy}
          onPress={handleSubmit(onSubmit)}
        />

        {/* DIVIDER */}
        <View className="flex-row items-center gap-4 my-8">
          <View className="flex-1 h-px bg-gray-200" />

          <Text className="text-sm font-medium text-gray-400">
            or continue with
          </Text>

          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* SOCIAL REGISTRATION */}
        <View className="gap-3">
          {/* GOOGLE */}
          <Pressable
            onPress={() => handleSocialRegister("google")}
            disabled={isBusy}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            className="flex-row items-center justify-center gap-3 bg-white border border-gray-200 h-14 rounded-xl active:bg-gray-50"
          >
            <GoogleIcon size={22} />

            <Text className="text-base font-semibold text-charcoal">
              Continue with Google
            </Text>
          </Pressable>

          {/* APPLE - IOS ONLY */}
          {Platform.OS === "ios" && (
            <Pressable
              onPress={() => handleSocialRegister("apple")}
              disabled={isBusy}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              className="flex-row items-center justify-center gap-3 h-14 rounded-xl bg-charcoal active:opacity-80"
            >
              <Apple size={22} color="#FFFFFF" />

              <Text className="text-base font-semibold text-white">
                Continue with Apple
              </Text>
            </Pressable>
          )}
        </View>

        {/* SOCIAL REGISTRATION NOTE */}
        <Text className="mt-5 text-xs leading-5 text-center text-gray-400">
          Social registration requires additional onboarding and verification.
        </Text>

        {/* SIGN IN */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500">Already have an account? </Text>

          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text className="font-semibold text-primary-dark">Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
