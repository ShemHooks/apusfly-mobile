import { ArrowRight, MapPin, Navigation } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

type Provider = {
  id: string;
  name: string;
  service: string;
  location: string;
  latitude: number;
  longitude: number;
  available: boolean;
};

type ProviderMapProps = {
  onViewAll?: () => void;
};

const PROVIDERS: Provider[] = [
  {
    id: "1",
    name: "SkyVista Aerial",
    service: "Aerial Photography",
    location: "Bacolod City",
    latitude: 10.6765,
    longitude: 122.9509,
    available: true,
  },
  {
    id: "2",
    name: "AgriWing Drone Solutions",
    service: "Agricultural Services",
    location: "Kabankalan City",
    latitude: 9.9902,
    longitude: 122.8142,
    available: true,
  },
  {
    id: "3",
    name: "AeroMap Technologies",
    service: "Mapping & Surveying",
    location: "Iloilo City",
    latitude: 10.7202,
    longitude: 122.5621,
    available: false,
  },
];

const INITIAL_REGION: Region = {
  latitude: 10.35,
  longitude: 122.85,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5,
};

export default function ProviderMap({ onViewAll }: ProviderMapProps) {
  const mapRef = useRef<MapView>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );

  const selectProvider = (provider: Provider) => {
    setSelectedProvider(provider);

    mapRef.current?.animateToRegion(
      {
        latitude: provider.latitude,
        longitude: provider.longitude,
        latitudeDelta: 0.25,
        longitudeDelta: 0.25,
      },
      350,
    );
  };

  return (
    <View className="overflow-hidden bg-white border border-gray-100 rounded-3xl">
      <View className="h-64">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={INITIAL_REGION}
          showsCompass
          showsScale={false}
          showsUserLocation={false}
          onPress={() => setSelectedProvider(null)}
        >
          {PROVIDERS.map((provider) => (
            <Marker
              key={provider.id}
              coordinate={{
                latitude: provider.latitude,
                longitude: provider.longitude,
              }}
              title={provider.name}
              description={provider.service}
              pinColor={provider.available ? "#75C928" : "#9CA3AF"}
              onPress={() => selectProvider(provider)}
            />
          ))}
        </MapView>

        {/* MAP LABEL */}
        <View
          pointerEvents="none"
          className="absolute px-3 py-2 bg-white rounded-full left-3 top-3"
        >
          <Text className="text-xs font-bold text-[#171717]">
            Sample Provider Locations
          </Text>
        </View>

        {/* RE-CENTER BUTTON */}
        <Pressable
          onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 350)}
          className="absolute items-center justify-center bg-white bottom-3 right-3 h-11 w-11 rounded-xl"
          accessibilityLabel="Reset map view"
        >
          <Navigation size={20} color="#559E1C" />
        </Pressable>
      </View>

      {/* SELECTED PROVIDER */}
      {selectedProvider ? (
        <View className="p-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-base font-bold text-[#171717]">
                {selectedProvider.name}
              </Text>

              <View className="flex-row items-center gap-1 mt-2">
                <MapPin size={14} color="#6B7280" />

                <Text className="text-xs text-gray-500">
                  {selectedProvider.location}
                </Text>
              </View>

              <Text className="mt-2 text-sm text-gray-600">
                {selectedProvider.service}
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-1.5 ${
                selectedProvider.available ? "bg-[#EAF6DF]" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedProvider.available
                    ? "text-[#559E1C]"
                    : "text-gray-500"
                }`}
              >
                {selectedProvider.available ? "Available" : "Unavailable"}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onViewAll}
            className="mt-4 flex-row items-center justify-center rounded-xl bg-[#75C928] py-3"
          >
            <Text className="font-bold text-[#171717]">Explore Providers</Text>

            <ArrowRight size={17} color="#171717" style={{ marginLeft: 8 }} />
          </Pressable>
        </View>
      ) : (
        <View className="flex-row items-center justify-between p-4">
          <View>
            <Text className="text-sm font-bold text-[#171717]">
              Explore by location
            </Text>

            <Text className="mt-1 text-xs text-gray-500">
              Tap a marker to preview a provider
            </Text>
          </View>

          <Pressable
            onPress={onViewAll}
            className="h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6DF]"
          >
            <ArrowRight size={19} color="#559E1C" />
          </Pressable>
        </View>
      )}
    </View>
  );
}
