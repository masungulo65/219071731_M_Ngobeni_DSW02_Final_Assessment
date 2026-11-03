
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// =====================================================
// ROUTE DATA
// =====================================================

const routes = [
  {
    id: 'R1',
    mode: 'Minibus Taxi',
    from: 'Soweto',
    to: 'Johannesburg CBD',
    fare: 24,
    status: 'Operating'
  },
  {
    id: 'R2',
    mode: 'Rea Vaya',
    from: 'Thokoza Park',
    to: 'Park Station',
    fare: 18,
    status: 'Delayed'
  },
  {
    id: 'R3',
    mode: 'Gautrain',
    from: 'Park Station',
    to: 'Sandton',
    fare: 38,
    status: 'Operating'
  },
  {
    id: 'R4',
    mode: 'Metrobus',
    from: 'Braamfontein',
    to: 'Rosebank',
    fare: 21,
    status: 'Operating'
  }
];

// =====================================================
// 1.1 COMPONENT-DRIVEN COMMUTER DASHBOARD
// =====================================================

// Reusable RouteCard component

function RouteCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.routeCard}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.transportMode}>
          {item.mode}
        </Text>

        <Text
          style={[
            styles.status,
            item.status === 'Delayed'
              ? styles.delayed
              : styles.operating
          ]}
        >
          {item.status}
        </Text>
      </View>

      <Text style={styles.routeText}>
        {item.from} → {item.to}
      </Text>

      <Text style={styles.fare}>
        Fare: R{item.fare}
      </Text>

      <Text style={styles.viewDetails}>
        Tap to view details →
      </Text>
    </TouchableOpacity>
  );
}

// =====================================================
// HOME SCREEN
// =====================================================

function HomeScreen({ navigation }) {

  // 1.2 RESPONSIVE STYLING AND INTERACTIVE FILTERING

  const [activeFilter, setActiveFilter] = useState('All');
  const [maxFare, setMaxFare] = useState('');

  // Filter routes by transport mode and maximum fare

  function getFilteredRoutes() {

    let filtered = routes;

    if (activeFilter === 'Taxi') {
      filtered = filtered.filter(function (item) {
        return item.mode === 'Minibus Taxi';
      });
    }

    if (activeFilter === 'Bus/BRT') {
      filtered = filtered.filter(function (item) {
        return item.mode === 'Rea Vaya' ||
               item.mode === 'Metrobus';
      });
    }

    if (activeFilter === 'Rail') {
      filtered = filtered.filter(function (item) {
        return item.mode === 'Gautrain';
      });
    }

    if (maxFare.trim() !== '') {
      filtered = filtered.filter(function (item) {
        return item.fare <= Number(maxFare);
      });
    }

    return filtered;
  }

  const filteredRoutes = getFilteredRoutes();

  // Filter button component

  function FilterButton({ title }) {
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === title && styles.activeFilter
        ]}
        onPress={function () {
          setActiveFilter(title);
        }}
      >
        <Text
          style={[
            styles.filterText,
            activeFilter === title && styles.activeFilterText
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Gauteng Commuter
      </Text>

      <Text style={styles.subHeading}>
        Find and compare your transport routes.
      </Text>

      <Text style={styles.sectionTitle}>
        Transport Type
      </Text>

      {/* Transport filters */}

      <View style={styles.filterContainer}>
        <FilterButton title="All" />
        <FilterButton title="Taxi" />
        <FilterButton title="Bus/BRT" />
        <FilterButton title="Rail" />
      </View>

      {/* Maximum fare filter */}

      <Text style={styles.sectionTitle}>
        Maximum Fare (R)
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your maximum budget"
        keyboardType="numeric"
        value={maxFare}
        onChangeText={setMaxFare}
      />

      {/* Route list */}

      <Text style={styles.sectionTitle}>
        Available Routes ({filteredRoutes.length})
      </Text>

      <FlatList
        data={filteredRoutes}
        keyExtractor={function (item) {
          return item.id;
        }}
        renderItem={function ({ item }) {
          return (
            <RouteCard
              item={item}
              onPress={function () {
                navigation.navigate('RouteDetails', {
                  selectedRoute: item
                });
              }}
            />
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No routes match your filters.
          </Text>
        }
      />

    </View>
  );
}

// =====================================================
// 1.3 MULTI-SCREEN NAVIGATION AND ROUTE PARAMETERS
// =====================================================

function RouteDetailsScreen({ navigation, route }) {

  // Receive selected route from HomeScreen

  const selectedRoute = route.params.selectedRoute;

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.heading}>
        Route Details
      </Text>

      <View style={styles.detailsCard}>

        <Text style={styles.sectionTitle}>
          {selectedRoute.mode}
        </Text>

        <Text style={styles.detailText}>
          Route ID: {selectedRoute.id}
        </Text>

        <Text style={styles.detailText}>
          Origin: {selectedRoute.from}
        </Text>

        <Text style={styles.detailText}>
          Destination: {selectedRoute.to}
        </Text>

        <Text style={styles.detailText}>
          Fare: R{selectedRoute.fare}
        </Text>

        <Text style={styles.detailText}>
          Status: {selectedRoute.status}
        </Text>

        <Text
          style={[
            styles.status,
            selectedRoute.status === 'Delayed'
              ? styles.delayed
              : styles.operating
          ]}
        >
          {selectedRoute.status}
        </Text>

      </View>

      {/* Navigate to incident report screen */}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={function () {
          navigation.navigate('ReportIssue', {
            selectedRoute: selectedRoute
          });
        }}
      >
        <Text style={styles.buttonText}>
          Report a Problem
        </Text>
      </TouchableOpacity>

      {/* Return to Home without creating duplicate screens */}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={function () {
          navigation.popToTop();
        }}
      >
        <Text style={styles.secondaryButtonText}>
          Back to Home
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// =====================================================
// 1.4 VALIDATED SOUTH AFRICAN INCIDENT REPORT FORM
// =====================================================

function ReportIssueScreen({ navigation, route }) {

  const selectedRoute = route.params.selectedRoute;

  // Controlled form inputs

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Validation messages

  const [errors, setErrors] = useState({});

  // Confirmation report

  const [submittedReport, setSubmittedReport] = useState(null);

  // Issue categories

  const categories = [
    'Delay',
    'Overcrowding',
    'Unsafe Driving',
    'Vehicle Breakdown',
    'Other'
  ];

  // Validate form and submit report

  function handleSubmit() {

    let newErrors = {};

    if (name.trim() === '') {
      newErrors.name = 'Please enter your name.';
    }

    if (!/^0[0-9]{9}$/.test(phone)) {
      newErrors.phone =
        'Enter a valid 10-digit SA number starting with 0.';
    }

    if (category === '') {
      newErrors.category = 'Please select an issue category.';
    }

    if (description.trim().length < 20) {
      newErrors.description =
        'Description must contain at least 20 characters.';
    }

    setErrors(newErrors);

    // Stop submission if validation fails

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Create report object

    const report = {
      selectedRoute: selectedRoute,
      commuterName: name.trim(),
      cellphone: phone,
      issueCategory: category,
      description: description.trim(),
      submissionTime: new Date().toLocaleString()
    };

    // Display confirmation card

    setSubmittedReport(report);

    // Clear form

    setName('');
    setPhone('');
    setCategory('');
    setDescription('');
    setErrors({});
  }

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.heading}>
        Report a Problem
      </Text>

      <Text style={styles.subHeading}>
        Report an issue with your selected transport route.
      </Text>

      {/* Selected route */}

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>
          Selected Route
        </Text>

        <Text style={styles.detailText}>
          {selectedRoute.mode}
        </Text>

        <Text style={styles.detailText}>
          {selectedRoute.from} → {selectedRoute.to}
        </Text>
      </View>

      {/* Commuter name */}

      <Text style={styles.label}>
        Commuter Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
      />

      {errors.name ? (
        <Text style={styles.errorText}>{errors.name}</Text>
      ) : null}

      {/* South African cellphone number */}

      <Text style={styles.label}>
        Cellphone Number
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 0821234567"
        keyboardType="numeric"
        maxLength={10}
        value={phone}
        onChangeText={setPhone}
      />

      {errors.phone ? (
        <Text style={styles.errorText}>{errors.phone}</Text>
      ) : null}

      {/* Issue category */}

      <Text style={styles.label}>
        Issue Category
      </Text>

      <View style={styles.categoryContainer}>
        {categories.map(function (item) {
          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryButton,
                category === item && styles.activeFilter
              ]}
              onPress={function () {
                setCategory(item);
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  category === item && styles.activeFilterText
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {errors.category ? (
        <Text style={styles.errorText}>
          {errors.category}
        </Text>
      ) : null}

      {/* Description */}

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Describe the transport problem (minimum 20 characters)"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {errors.description ? (
        <Text style={styles.errorText}>
          {errors.description}
        </Text>
      ) : null}

      {/* Submit button */}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          Submit Report
        </Text>
      </TouchableOpacity>

      {/* Successful submission confirmation */}

      {submittedReport !== null && (
        <View style={styles.confirmationCard}>

          <Text style={styles.confirmationTitle}>
            Report Submitted Successfully!
          </Text>

          <Text style={styles.detailText}>
            Commuter: {submittedReport.commuterName}
          </Text>

          <Text style={styles.detailText}>
            Cellphone: {submittedReport.cellphone}
          </Text>

          <Text style={styles.detailText}>
            Issue: {submittedReport.issueCategory}
          </Text>

          <Text style={styles.detailText}>
            Description: {submittedReport.description}
          </Text>

          <Text style={styles.detailText}>
            Route: {submittedReport.selectedRoute.id}
          </Text>

          <Text style={styles.detailText}>
            Submitted: {submittedReport.submissionTime}
          </Text>

        </View>
      )}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={function () {
          navigation.popToTop();
        }}
      >
        <Text style={styles.secondaryButtonText}>
          Return to Home
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// =====================================================
// MAIN APP AND NAVIGATION
// =====================================================

export default function App() {

  return (
    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#17365D'
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
      >

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Commuter Dashboard' }}
        />

        <Stack.Screen
          name="RouteDetails"
          component={RouteDetailsScreen}
          options={{ title: 'Route Details' }}
        />

        <Stack.Screen
          name="ReportIssue"
          component={ReportIssueScreen}
          options={{ title: 'Report an Issue' }}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}

// =====================================================
// 1.5 CODE QUALITY AND USABILITY - STYLESHEET
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    padding: 16
  },

  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#17365D',
    marginBottom: 8
  },

  subHeading: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#17365D',
    marginTop: 12,
    marginBottom: 10
  },

  routeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  transportMode: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#17365D'
  },

  routeText: {
    fontSize: 15,
    marginTop: 12,
    color: '#333333'
  },

  fare: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#17365D',
    marginTop: 10
  },

  status: {
    padding: 6,
    borderRadius: 5,
    overflow: 'hidden',
    fontWeight: 'bold',
    fontSize: 12
  },

  operating: {
    backgroundColor: '#D4EDDA',
    color: '#155724'
  },

  delayed: {
    backgroundColor: '#F8D7DA',
    color: '#721C24'
  },

  viewDetails: {
    color: '#2874A6',
    marginTop: 12,
    fontWeight: 'bold'
  },

  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8
  },

  filterButton: {
    backgroundColor: '#E0E5EC',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8
  },

  activeFilter: {
    backgroundColor: '#17365D'
  },

  filterText: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 13
  },

  activeFilterText: {
    color: '#FFFFFF'
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 8
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#17365D',
    marginTop: 12,
    marginBottom: 8
  },

  detailsCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginVertical: 12,
    elevation: 2
  },

  detailText: {
    fontSize: 14,
    color: '#333333',
    marginTop: 8
  },

  primaryButton: {
    backgroundColor: '#17365D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 12
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#17365D',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },

  secondaryButtonText: {
    color: '#17365D',
    fontWeight: 'bold'
  },

  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },

  categoryButton: {
    backgroundColor: '#E0E5EC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5
  },

  descriptionInput: {
    height: 110,
    textAlignVertical: 'top'
  },

  errorText: {
    color: 'red',
    fontSize: 13,
    marginBottom: 8
  },

  confirmationCard: {
    backgroundColor: '#D4EDDA',
    padding: 16,
    borderRadius: 10,
    marginVertical: 15
  },

  confirmationTitle: {
    color: '#155724',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8
  },

  emptyText: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 25,
    fontSize: 15
  }

});
