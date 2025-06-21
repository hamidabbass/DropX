import { View, Text, ScrollView } from 'react-native';
import tw from 'twrnc';

export default function PrivacyPolicy() {
  return (
    <ScrollView style={tw`flex-1 bg-white px-5 py-6`}>
      <Text style={tw`text-xl font-bold mb-4`}>Privacy Policy</Text>

      <Text style={tw`text-base text-gray-700 mb-4`}>
        DropX is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our app.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>1. Information We Collect</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        - Location Data: To connect you with nearby drivers or deliveries.{"\n"}
        - Account Info: Email, phone number, and basic profile data.{"\n"}
        - Usage Data: App usage, delivery history, and preferences.{"\n"}
        - Payment Information: Handled securely by third-party providers (we do not store card data).
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>2. How We Use Your Data</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        - Match users for deliveries.{"\n"}
        - Improve app performance and security.{"\n"}
        - Communicate important updates or promotional content.{"\n"}
        - Prevent fraud or misuse of the service.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>3. Sharing and Third-Parties</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        We do not sell your data. We only share data with service providers like payment processors, analytics tools, and map services to deliver core functionality.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>4. Data Security</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        We follow industry-standard encryption and security practices to protect your data.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>5. Your Rights</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        You can request to view, edit, or delete your personal data at any time by contacting us at support@dropx.app.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>6. Updates</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        We may update this policy as our app evolves. We’ll notify you of significant changes within the app.
      </Text>

      <Text style={tw`text-sm text-gray-500 mt-6`}>
        Last updated: June 21, 2025
      </Text>
    </ScrollView>
  );
}
