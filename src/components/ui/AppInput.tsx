import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type AppInputProps = TextInputProps & {
  label: string;
  error?: string;
  isPassword?: boolean;
};

export default function AppInput({
  label,
  error,
  isPassword = false,
  ...props
}: AppInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm font-semibold text-charcoal">{label}</Text>

      <View
        className={`min-h-14 flex-row items-center rounded-2xl border bg-white px-4 ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        <TextInput
          {...props}
          className="flex-1 text-base text-charcoal"
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={props.autoCapitalize ?? "none"}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            accessibilityRole="button"
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
            className="p-2"
          >
            {showPassword ? (
              <EyeOff size={20} color="#64748B" />
            ) : (
              <Eye size={20} color="#64748B" />
            )}
          </Pressable>
        )}
      </View>

      {error && <Text className="mt-2 text-xs text-red-500">{error}</Text>}
    </View>
  );
}
