import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import tw from "twrnc";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setDriverInfo, setVehicleInfo } from "../redux/driverVehicleSlice";
import { createVehicle } from "../redux/vehicleActions";

const VehicleDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error, result } = useAppSelector((state) => state.vehicle);
  const driverVerification = useAppSelector(
    (state) => state.driverVerification.persisted
  );
  const driverAuth = useAppSelector((state) => state.driverAuth.loginData);
  const driverRegister = useAppSelector(
    (state) => state.driverAuth.registerData
  );
  const driverPhoto = useAppSelector(
    (state) => state.driverVehicle.driver?.photo
  );
  const [form, setForm] = useState({
    vehicle_type_name: "",
    company_name: "",
    description: "",
    make: "",
    model: "",
    year: "",
    number_plate: "",
    color: "",
  });

  // Model dropdown state
  type ModelItem = { label: string; value: string };
  const [modelOpen, setModelOpen] = useState(false);
  const [modelItems, setModelItems] = useState<ModelItem[]>([]);

  // Mapping of company + vehicle type to models
  type VehicleType = 'Car' | 'Van';
  type CompanyModelMap = {
    [company: string]: {
      [type in VehicleType]?: string[];
    };
  };
  const companyModelMap: CompanyModelMap = {
    Toyota: {
      Car: [
        "Corolla", "Yaris", "Camry", "Prius", "Supra", "Aqua", "Passo", "Vitz", "Mark X", "Crown", "Allion", "Axio", "Belta", "Premio", "Fielder", "Probox", "Avanza", "Fortuner", "Land Cruiser", "Hilux"
      ],
      Van: [
        "Hiace", "Sienna", "Noah", "Voxy", "TownAce", "LiteAce", "Alphard", "Estima", "Regiusace"
      ]
    },
    Honda: {
      Car: [
        "Civic", "City", "Accord", "Fit", "Grace", "Insight", "Vezel", "CR-Z", "Freed", "Brio", "HR-V", "Jazz"
      ],
      Van: [
        "Odyssey", "Stepwgn", "Freed Spike", "Acty Van"
      ]
    },
    Suzuki: {
      Car: [
        "Swift", "Cultus", "Alto", "Wagon R", "Mehran", "Baleno", "Ciaz", "Liana", "Ravi", "Kizashi", "Ignis", "Every Wagon"
      ],
      Van: [
        "Every", "APV", "Carry Van", "Bolan"
      ]
    },
    Hyundai: {
      Car: [
        "Elantra", "Sonata", "Accent", "Verna", "i10", "i20", "Tucson", "Santro", "Creta", "Genesis"
      ],
      Van: [
        "Staria", "H-1", "Grand Starex", "Porter"
      ]
    },
    Kia: {
      Car: [
        "Cerato", "Picanto", "Rio", "Sportage", "Sorento", "Optima", "Stonic", "Spectra"
      ],
      Van: [
        "Carnival", "Bongo Van"
      ]
    },
    Nissan: {
      Car: [
        "Sunny", "Sentra", "Tiida", "Bluebird", "Sylphy", "March", "Note", "Juke", "Teana"
      ],
      Van: [
        "NV350", "Caravan", "Vanette", "Serena"
      ]
    },
    MG: {
      Car: [
        "MG5", "MG6", "MG3", "HS", "ZS", "GT"
      ],
      Van: []
    },
    Changan: {
      Car: [
        "Alsvin", "Eado", "Raeton"
      ],
      Van: [
        "Karvaan", "M9", "Star Van"
      ]
    },
    Haval: {
      Car: [
        "Jolion", "H6", "F7", "H2"
      ],
      Van: []
    },
    Mitsubishi: {
      Car: [
        "Lancer", "Mirage", "Galant", "Attrage", "Outlander", "Eclipse Cross"
      ],
      Van: [
        "Delica", "L300", "Pajero Mini Van"
      ]
    }
  };

  // Update model dropdown when company or vehicle type changes
  React.useEffect(() => {
    if (form.company_name && form.vehicle_type_name) {
      const models = (companyModelMap[form.company_name]?.[form.vehicle_type_name as VehicleType] || []) as string[];
      setModelItems(models.map((m: string) => ({ label: m, value: m })));
      // Reset model if not in new list
      if (!models.includes(form.model)) {
        setForm(f => ({ ...f, model: "" }));
      }
    } else {
      setModelItems([]);
      setForm(f => ({ ...f, model: "" }));
    }
  }, [form.company_name, form.vehicle_type_name]);
  // Dropdown state for company name
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyItems, setCompanyItems] = useState([
    { label: 'Toyota', value: 'Toyota' },
    { label: 'Honda', value: 'Honda' },
    { label: 'Suzuki', value: 'Suzuki' },
    { label: 'Hyundai', value: 'Hyundai' },
    { label: 'Kia', value: 'Kia' },
    { label: 'Nissan', value: 'Nissan' },
    { label: 'MG', value: 'MG' },
    { label: 'Changan', value: 'Changan' },
    { label: 'Haval', value: 'Haval' },
    { label: 'Mitsubishi', value: 'Mitsubishi' },
  ]);

  // Dropdown state for vehicle type
  const [open, setOpen] = useState(false);
  const [vehicleTypeItems, setVehicleTypeItems] = useState([
    { label: 'Car', value: 'Car' },
    { label: 'Van', value: 'Van' },
  ]);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };


  // Check if all required fields are filled
  const requiredFieldsFilled =
  !!form.vehicle_type_name &&
  !!form.company_name &&
  !!form.make &&
  !!form.model &&
  !!form.year &&
  !!form.number_plate;

  const handleSubmit = () => {
    dispatch(
      createVehicle({
        ...form,
        year: Number(form.year),
      })
    );
  };

  // On successful vehicle creation, persist driver/vehicle info and navigate
  useEffect(() => {
    if (result) {
      // Compose info
      // Map backend fields to local fields
      // Always merge registration values for phone/license/name
      let license =
        driverAuth?.license_number ||
        driverRegister?.license_number ||
        driverAuth?.license ||
        driverRegister?.license ||
        "";
      let phone =
        driverAuth?.phone_number ||
        driverRegister?.phone_number ||
        driverAuth?.phone ||
        driverRegister?.phone ||
        "";
      // Fallback: check nested fields if still empty
      if (!phone && driverAuth) phone = driverAuth.phone || driverAuth.phone_number || "";
      if (!phone && driverRegister) phone = driverRegister.phone || driverRegister.phone_number || "";
      if (!license && driverAuth) license = driverAuth.license || driverAuth.license_number || "";
      if (!license && driverRegister) license = driverRegister.license || driverRegister.license_number || "";

      let name =
        driverVerification?.full_name ||
        driverAuth?.full_name ||
        driverRegister?.full_name ||
        "";
      if (!name && (driverRegister?.first_name || driverRegister?.last_name)) {
        name = [driverRegister?.first_name, driverRegister?.last_name]
          .filter(Boolean)
          .join(" ");
      }
      const driverInfo = {
        name,
        cnic: driverVerification?.cnic_number || "",
        license,
        phone,
        photo: driverPhoto || null,
      };
      dispatch(setDriverInfo(driverInfo));
      dispatch(setVehicleInfo(result));
      // Navigate to driverinfo page
      router.replace("/driverinfo");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={tw`p-6 pb-28`}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={tw`text-xl font-bold mb-4`}>Vehicle Details</Text>
        <Image
          source={require("../assets/images/dropX.png")}
          style={tw`-mt-7 size-56 mx-auto`}
          resizeMode="contain"
        />
        <Text style={tw`-mt-16 text-xl font-bold text-center text-black mb-6`}>
          Showcase your ride! Enter your vehicle details to get started.
        </Text>
        <DropDownPicker
          open={open}
          value={form.vehicle_type_name}
          items={vehicleTypeItems}
          setOpen={setOpen}
          setValue={callback => {
            const value = typeof callback === 'function' ? callback(form.vehicle_type_name) : callback;
            setForm(f => ({ ...f, vehicle_type_name: value }));
          }}
          setItems={setVehicleTypeItems}
          placeholder="Select Vehicle Type*"
          style={tw`border border-gray-300 mb-2.5`}
          dropDownContainerStyle={tw`border border-gray-300`}
          listMode="SCROLLVIEW"
          zIndex={3000}
          zIndexInverse={1000}
        />

        {/* Company Name Dropdown */}
        <DropDownPicker
          open={companyOpen}
          value={form.company_name}
          items={companyItems}
          setOpen={setCompanyOpen}
          setValue={callback => {
            const value = typeof callback === 'function' ? callback(form.company_name) : callback;
            setForm(f => ({ ...f, company_name: value, make: value }));
          }}
          setItems={setCompanyItems}
          placeholder="Select Company Name*"
          style={tw`border border-gray-300 mb-2.5`}
          dropDownContainerStyle={tw`border border-gray-300`}
          listMode="SCROLLVIEW"
          zIndex={2000}
          zIndexInverse={900}
        />
        <DropDownPicker
          open={modelOpen}
          value={form.model}
          items={modelItems}
          setOpen={setModelOpen}
          setValue={callback => {
            const value = typeof callback === 'function' ? callback(form.model) : callback;
            setForm(f => ({ ...f, model: value }));
          }}
          setItems={setModelItems as any}
          placeholder={form.company_name && form.vehicle_type_name ? "Select Model*" : "Select company and type first"}
          style={tw`border border-gray-300 mb-2.5`}
          dropDownContainerStyle={tw`border border-gray-300`}
          listMode="SCROLLVIEW"
          zIndex={1500}
          zIndexInverse={800}
          disabled={!form.company_name || !form.vehicle_type_name}
        />
        <TextInput
          placeholder="Year*"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          value={form.year}
          onChangeText={v => handleChange("year", v)}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Number Plate*"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          value={form.number_plate}
          onChangeText={v => handleChange("number_plate", v)}
        />
        <TextInput
          placeholder="Color*"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5`}
          value={form.color}
          onChangeText={v => handleChange("color", v)}
        />
        <TextInput
          placeholder="Description"
          style={tw`border border-gray-300 rounded-lg p-3 mb-2.5 min-h-20 text-left text-top`}
          value={form.description}
          onChangeText={v => handleChange("description", v)}
          multiline
          textAlignVertical="top"
        />

        {error && (
          <Text style={tw`text-red-500 mb-2`}>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </Text>
        )}
        {result && (
          <Text style={tw`text-green-600 mb-2`}>
            Vehicle created successfully!
          </Text>
        )}
      </ScrollView>
      <View style={[tw`absolute left-0 right-0 bottom-0 bg-white p-4`]}>
        <TouchableOpacity
          style={tw`${requiredFieldsFilled && !isLoading ? 'bg-black' : 'bg-gray-400'} py-3 rounded-lg`}
          onPress={handleSubmit}
          disabled={!requiredFieldsFilled || isLoading}
        >
          <Text style={tw`text-white text-center text-base`}>
            {isLoading ? "Saving..." : "Save Vehicle"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default VehicleDetails;
