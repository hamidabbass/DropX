import { View, Text, ScrollView } from 'react-native';
import tw from 'twrnc';

export default function TermsOfService() {
  return (
    <ScrollView style={tw`flex-1 bg-white px-5 py-6`}>
      <Text style={tw`text-xl font-bold mb-4`}>Terms of Service</Text>

      <Text style={tw`text-base text-gray-700 mb-4`}>
        Welcome to DropX. These Terms of Service govern your use of our peer-to-peer delivery platform. By using our app, you agree to these terms.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>1. Use of the Service</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        - You must be 18+ years old.{"\n"}
        - You agree not to misuse the app or its users.{"\n"}
        - All deliveries must comply with local laws and community guidelines.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>2. Accounts</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        - You are responsible for maintaining the security of your account.{"\n"}
        - Providing false information may result in suspension or termination.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>3. Payments</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        - All payments are processed through secure third-party services.{"\n"}
        - DropX does not store your payment credentials.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>4. Liability</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        - DropX acts as a facilitator between users.{"\n"}
        - We are not liable for lost, stolen, or damaged items unless caused by platform fault.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>5. Termination</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        - We reserve the right to suspend accounts for any misuse, fraud, or violation of these terms.
      </Text>

      <Text style={tw`text-lg font-semibold mt-4`}>6. Dispute Resolution</Text>
      <Text style={tw`text-base text-gray-700 mt-1`}>
        - For disputes, contact support@dropx.app. We aim to resolve issues fairly and quickly.
      </Text>

      <Text style={tw`text-sm text-gray-500 mt-6`}>
        Last updated: June 21, 2025
      </Text>
    </ScrollView>
  );
}
