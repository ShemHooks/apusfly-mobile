import GoogleIcon from "@/components/icons/GoogleIcon";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import { authService } from "@/services/auth.service";

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "expo-router";
import { Apple, ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginForm = z.infer<typeof loginSchema>;

type AuthenticatedUser = Awaited<ReturnType<typeof authService.login>>;

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Cannot connect to the ApusFly server. Check your internet connection and API address.";
    }

    const data = error.response.data as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    const validationMessage = data?.errors
      ? Object.values(data.errors).flat()[0]
      : undefined;

    return (
      validationMessage ||
      data?.message ||
      "Authentication failed. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
}

export default function LoginScreen() {
  const router = useRouter();

  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const navigateAfterLogin = (user: AuthenticatedUser) => {
    if (user.roles.includes("customer")) {
      router.replace("/(customer)");
      return;
    }

    if (user.roles.includes("pilot")) {
      Alert.alert(
        "Login Successful",
        "Your pilot dashboard is not yet configured.",
      );
      return;
    }

    Alert.alert(
      "Login Successful",
      "Your account dashboard is not yet available.",
    );
  };

  // EMAIL / PASSWORD LOGIN
  const onSubmit = async (data: LoginForm) => {
    try {
      const user = await authService.login(
        data.email.trim().toLowerCase(),
        data.password,
      );

      navigateAfterLogin(user);
    } catch (error) {
      Alert.alert("Login Failed", getErrorMessage(error));
    }
  };

  // GOOGLE SIGN-IN
  const handleGoogleLogin = async () => {
    if (googleLoading || isSubmitting) return;

    setGoogleLoading(true);

    try {
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
        return;
      }

      const idToken = response.data.idToken;

      if (!idToken) {
        Alert.alert(
          "Google Sign-In Failed",
          "Google did not return an ID token.",
        );
        return;
      }

      const result = await authService.googleLogin(idToken);

      navigateAfterLogin(result.user);
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          return;
        }

        if (error.code === statusCodes.IN_PROGRESS) {
          return;
        }

        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert(
            "Google Play Services",
            "Google Play Services is unavailable or needs an update.",
          );
          return;
        }
      }

      Alert.alert("Google Sign-In Failed", getErrorMessage(error));
    } finally {
      setGoogleLoading(false);
    }
  };

  // APPLE SIGN-IN (COMING SOON)
  const handleAppleLogin = () => {
    Alert.alert("Apple Sign-In", "Apple authentication is not available yet.");
  };

  const isBusy = isSubmitting || googleLoading;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
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
        <View className="mt-10">
          <View className="items-center justify-center w-full mb-20 h-14 rounded-2xl">
            <Image
              source={require("../../../assets/photos/logo.png")}
              className="w-64 h-64"
              resizeMode="contain"
              accessibilityLabel="ApusFly logo"
            />
          </View>

          <Text className="text-3xl font-bold text-charcoal">
            Welcome Back!
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-500">
            Sign in to continue your journey with ApusFly.
          </Text>
        </View>

        {/* EMAIL LOGIN */}
        <View className="mt-9">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Password"
                placeholder="Enter your password"
                isPassword
                autoComplete="current-password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Pressable
            onPress={() =>
              Alert.alert(
                "Forgot Password",
                "Password recovery will be available soon.",
              )
            }
            className="self-end mb-7"
          >
            <Text className="font-semibold text-primary-dark">
              Forgot Password?
            </Text>
          </Pressable>

          <AppButton
            title="Sign In"
            disabled={isBusy}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        {/* DIVIDER */}
        <View className="flex-row items-center gap-4 my-8">
          <View className="flex-1 h-px bg-gray-200" />

          <Text className="text-sm font-medium text-gray-400">
            or continue with
          </Text>

          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* SOCIAL LOGIN */}
        <View className="gap-3">
          {/* GOOGLE */}
          <Pressable
            onPress={handleGoogleLogin}
            disabled={isBusy}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            accessibilityState={{ disabled: isBusy }}
            className={`flex-row items-center justify-center gap-3 bg-white border border-gray-200 h-14 rounded-xl active:bg-gray-50 ${
              isBusy ? "opacity-50" : ""
            }`}
          >
            <GoogleIcon size={22} />

            <Text className="text-base font-semibold text-charcoal">
              {googleLoading
                ? "Signing in with Google..."
                : "Continue with Google"}
            </Text>
          </Pressable>

          {/* APPLE - IOS ONLY */}
          {Platform.OS === "ios" && (
            <Pressable
              onPress={handleAppleLogin}
              disabled={isBusy}
              accessibilityRole="button"
              className="flex-row items-center justify-center gap-3 h-14 rounded-xl bg-charcoal active:opacity-80"
            >
              <Apple size={22} color="#FFFFFF" />

              <Text className="text-base font-semibold text-white">
                Continue with Apple
              </Text>
            </Pressable>
          )}
        </View>

        {/* SIGN UP */}
        <View className="flex-row justify-center pt-12 mt-auto">
          <Text className="text-gray-500">Don't have an account? </Text>

          <Pressable onPress={() => router.push("/role-selection")}>
            <Text className="font-semibold text-primary-dark">Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
