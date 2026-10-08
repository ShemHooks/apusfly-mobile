import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const variants = {
    primary: {
      background: "#75C928",
      depth: "#4D9119",
      text: "#171717",
      shadow: "#4D9119",
    },
    secondary: {
      background: "#171717",
      depth: "#050505",
      text: "#FFFFFF",
      shadow: "#000000",
    },
    outline: {
      background: "#FFFFFF",
      depth: "#D1E5C5",
      text: "#559E1C",
      shadow: "#559E1C",
    },
  };

  const theme = variants[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{
        disabled: inactive,
        busy: loading,
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.depth,
          opacity: inactive ? 0.5 : 1,
          transform: [{ translateY: pressed ? 4 : 0 }],
          shadowColor: theme.shadow,
          elevation: pressed ? 2 : 9,
          shadowOpacity: pressed ? 0.12 : 0.3,
        },
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.buttonFace,
            {
              backgroundColor: theme.background,
              borderColor: variant === "outline" ? "#75C928" : "transparent",
              borderWidth: variant === "outline" ? 1 : 0,
              marginBottom: pressed ? 0 : 5,
              marginTop: pressed ? 5 : 0,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={theme.text} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.text }]}>
              {title}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 16,

    // iOS shadow
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowRadius: 12,
  },

  buttonFace: {
    minHeight: 56,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
