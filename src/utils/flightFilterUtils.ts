interface FlightLeg {
  departure_info: {
    airport_code: string;
    airport_name: string;
    city_name: string;
  };
  arrival_info: {
    airport_code: string;
    airport_name: string;
    city_name: string;
  };
  time_info: {
    number_of_stops: string;
  };
  airline_info: {
    carrier_code: string;
    carrier_name: string;
  };
}

interface FlightFare {
  fare_info: {
    cabin_types: string[];
    fare_detail: {
      price_info: {
        total_fare: number;
      };
    };
  };
}

interface FlightData {
  legs: FlightLeg[];
  fares: FlightFare[];
}

interface FlightSearchResponse {
  success: boolean;
  data: {
    departure_flights: FlightData[];
    return_flights?: FlightData[];
  };
}

interface AirportInfo {
  code: string;
  name: string;
  count: number;
}

interface FilterData {
  airlines: string[];
  departureAirports: AirportInfo[];
  arrivalAirports: AirportInfo[];
  cabinTypes: string[];
  priceRange: { min: number; max: number };
  stopsCount: { [key: string]: number };
}

/**
 * Extracts filter data from flight search API response
 */
export const extractFilterDataFromFlights = (response: any): FilterData => {
  // Default return value for empty/invalid data
  const defaultData = {
    airlines: [],
    departureAirports: [],
    arrivalAirports: [],
    cabinTypes: [],
    priceRange: { min: 0, max: 5000 },
    stopsCount: { '0': 0, '1': 0, '2+': 0 },
  };

  try {
    // Handle invalid response
    if (!response || !response.data || !response.data.departure_flights) {
      return defaultData;
    }

    const flights = [
      ...response.data.departure_flights,
      ...(response.data.return_flights || []),
    ];

    // If no flights, return default
    if (!flights.length) {
      return defaultData;
    }

    // Extract airlines
    const airlinesSet = new Set<string>();
    const airlinesCount: { [key: string]: number } = {};

    // Extract airports
    const departureAirportsMap = new Map<
      string,
      { name: string; city: string; count: number }
    >();
    const arrivalAirportsMap = new Map<
      string,
      { name: string; city: string; count: number }
    >();

    // Extract cabin types
    const cabinTypesSet = new Set<string>();

    // Extract price range
    let minPrice = Infinity;
    let maxPrice = 0;

    // Extract stops count
    const stopsCount: { [key: string]: number } = {
      '0': 0, // Direct flights
      '1': 0, // One stop
      '2+': 0, // Two or more stops
    };

    // Process each flight
    flights.forEach((flight) => {
      // Handle different API response structures
      const legs = flight.legs || [];

      legs.forEach((leg: any) => {
        try {
          // Airlines - handle different structures
          const airlineName =
            leg.airline_info?.carrier_name ||
            leg.airline_name ||
            leg.segments?.[0]?.airline_name;

          if (airlineName) {
            airlinesSet.add(airlineName);
            airlinesCount[airlineName] = (airlinesCount[airlineName] || 0) + 1;
          }

          // Departure airports - handle different structures
          const depCode = leg.departure_info?.airport_code || leg.from?.code;
          const depName = leg.departure_info?.airport_name || leg.from?.name;
          const depCity = leg.departure_info?.city_name || leg.from?.city;

          if (depCode) {
            if (departureAirportsMap.has(depCode)) {
              departureAirportsMap.get(depCode)!.count++;
            } else {
              departureAirportsMap.set(depCode, {
                name: depName ? `${depName}, ${depCity || ''}` : depCode,
                city: depCity || '',
                count: 1,
              });
            }
          }

          // Arrival airports - handle different structures
          const arrCode = leg.arrival_info?.airport_code || leg.to?.code;
          const arrName = leg.arrival_info?.airport_name || leg.to?.name;
          const arrCity = leg.arrival_info?.city_name || leg.to?.city;

          if (arrCode) {
            if (arrivalAirportsMap.has(arrCode)) {
              arrivalAirportsMap.get(arrCode)!.count++;
            } else {
              arrivalAirportsMap.set(arrCode, {
                name: arrName ? `${arrName}, ${arrCity || ''}` : arrCode,
                city: arrCity || '',
                count: 1,
              });
            }
          }

          // Stops - handle different structures
          const stops = parseInt(
            leg.time_info?.number_of_stops || leg.stops || '0',
          );
          if (stops === 0) {
            stopsCount['0']++;
          } else if (stops === 1) {
            stopsCount['1']++;
          } else {
            stopsCount['2+']++;
          }
        } catch (err) {
          console.error('Error processing leg:', err);
        }
      });

      // Cabin types and prices - handle different structures
      try {
        const fares = flight.fares || [];
        fares.forEach((fare: any) => {
          // Handle cabin types
          const cabinTypes =
            fare.fare_info?.cabin_types || [fare.cabin_type] || [];

          cabinTypes.forEach((cabin: string) => {
            if (cabin) cabinTypesSet.add(cabin.toLowerCase());
          });

          // Handle price
          const price =
            fare.fare_info?.fare_detail?.price_info?.total_fare ||
            fare.price?.total ||
            fare.total_price ||
            0;

          if (price > 0) {
            minPrice = Math.min(minPrice, price);
            maxPrice = Math.max(maxPrice, price);
          }
        });
      } catch (err) {
        console.error('Error processing fares:', err);
      }
    });

    // Convert airlines set to array
    const airlines = Array.from(airlinesSet).sort();

    // Convert airports maps to arrays
    const departureAirports: AirportInfo[] = Array.from(
      departureAirportsMap.entries(),
    ).map(([code, info]) => ({
      code,
      name: info.name,
      count: info.count,
    }));

    const arrivalAirports: AirportInfo[] = Array.from(
      arrivalAirportsMap.entries(),
    ).map(([code, info]) => ({
      code,
      name: info.name,
      count: info.count,
    }));

    // Convert cabin types set to array
    const cabinTypes = Array.from(cabinTypesSet);

    return {
      airlines,
      departureAirports,
      arrivalAirports,
      cabinTypes,
      priceRange: {
        min: minPrice === Infinity ? 0 : Math.floor(minPrice),
        max: maxPrice === 0 ? 5000 : Math.ceil(maxPrice),
      },
      stopsCount,
    };
  } catch (error) {
    console.error('Error extracting filter data:', error);
    return defaultData;
  }
};

/**
 * Maps cabin types from API to display names
 */
export const mapCabinTypeToDisplayName = (cabinType: string): string => {
  const mapping: { [key: string]: string } = {
    economy: 'economy',
    premium_economy: 'premium_economy',
    business: 'business',
    first: 'first_class',
  };

  return mapping[cabinType.toLowerCase()] || cabinType.toLowerCase();
};

/**
 * Extracts alliance information from airline codes
 * Note: This is a simplified mapping. In a real app, you'd want to maintain
 * a more comprehensive database of airline alliances
 */
/**
 * Returns the alliance name for a given airline carrier code
 * @param carrierCode The airline carrier code
 * @returns The alliance name or null if not found
 */
export const getAirlineAlliance = (carrierCode: string): string | null => {
  const allianceMapping: { [key: string]: string } = {
    // Star Alliance
    SV: 'star_alliance', // Saudi Arabian Airlines
    LH: 'star_alliance', // Lufthansa
    UA: 'star_alliance', // United Airlines
    AC: 'star_alliance', // Air Canada
    TG: 'star_alliance', // Thai Airways
    SQ: 'star_alliance', // Singapore Airlines
    NH: 'star_alliance', // ANA

    // OneWorld
    AA: 'oneworld', // American Airlines
    BA: 'oneworld', // British Airways
    QR: 'oneworld', // Qatar Airways
    CX: 'oneworld', // Cathay Pacific
    JL: 'oneworld', // JAL
    QF: 'oneworld', // Qantas

    // SkyTeam
    AF: 'skyteam', // Air France
    KL: 'skyteam', // KLM
    DL: 'skyteam', // Delta
    EK: 'skyteam', // Emirates (not actually in SkyTeam, but for demo)
    SU: 'skyteam', // Aeroflot
  };

  return allianceMapping[carrierCode] || null;
};

/**
 * Extracts available alliances from flight data
 */
export const extractAvailableAlliances = (response: any): string[] => {
  try {
    if (!response || !response.data || !response.data.departure_flights) {
      return [];
    }

    const flights = [
      ...response.data.departure_flights,
      ...(response.data.return_flights || []),
    ];

    const alliancesSet = new Set<string>();

    flights.forEach((flight) => {
      const legs = flight.legs || [];
      legs.forEach((leg: any) => {
        try {
          const carrierCode =
            leg.airline_info?.carrier_code ||
            leg.airline_code ||
            leg.segments?.[0]?.airline_code;

          if (carrierCode) {
            const alliance = getAirlineAlliance(carrierCode);
            if (alliance) {
              alliancesSet.add(alliance);
            }
          }
        } catch (err) {
          console.error('Error extracting alliance:', err);
        }
      });
    });

    return Array.from(alliancesSet);
  } catch (error) {
    console.error('Error extracting alliances:', error);
    return [];
  }
};
