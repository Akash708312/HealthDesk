
import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Define the hospital type
interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  specialties?: string[];
  lat?: number;
  lng?: number;
  distance?: number;
  rating?: number;
}

// Helper function to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
};

const HospitalFinder = () => {
  // Sample data - in a real app this would come from an API
  const [hospitals, setHospitals] = useState<Hospital[]>([
    { 
      id: '1', 
      name: 'General Hospital', 
      address: '123 Main St', 
      city: 'New York', 
      state: 'NY', 
      zip_code: '10001',
      specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
      lat: 40.7128,
      lng: -74.0060
    },
    { 
      id: '2', 
      name: 'Medical Center', 
      address: '456 Park Ave', 
      city: 'Boston', 
      state: 'MA', 
      zip_code: '02115',
      specialties: ['Oncology', 'Pediatrics'],
      lat: 42.3601,
      lng: -71.0589
    },
    { 
      id: '3', 
      name: 'Community Hospital', 
      address: '789 Oak St', 
      city: 'Chicago', 
      state: 'IL', 
      zip_code: '60601',
      specialties: ['Cardiology', 'Geriatrics'],
      lat: 41.8781,
      lng: -87.6298
    }
  ]);
  
  // State variables
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>(hospitals);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [searchRadius, setSearchRadius] = useState<number>(50);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState<boolean>(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  
  // Map reference
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  // Get unique specialties from hospitals
  const specialties = Array.from(
    new Set(
      hospitals
        .flatMap(hospital => hospital.specialties || [])
        .filter(Boolean)
    )
  );

  // Initialize map on component mount
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],
        zoom: 4
      });
      
      addHospitalMarkers();
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);
  
  // Update user location when toggled
  useEffect(() => {
    if (useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          if (map.current) {
            map.current.setCenter([longitude, latitude]);
            map.current.setZoom(10);
            
            new mapboxgl.Marker({ color: '#FF0000' })
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          }
          
          filterHospitals();
        },
        (error) => {
          toast.error("Couldn't get current location. Please try again.");
          setUseCurrentLocation(false);
        }
      );
    } else {
      setUserLocation(null);
    }
  }, [useCurrentLocation]);
  
  // Filter hospitals based on search criteria
  const filterHospitals = async () => {
    let filtered = [...hospitals];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(hospital => 
        hospital.name.toLowerCase().includes(query) || 
        hospital.city.toLowerCase().includes(query) ||
        (hospital.specialties && hospital.specialties.some(s => s.toLowerCase().includes(query)))
      );
    }
    
    // Filter by specialty
    if (specialtyFilter && specialtyFilter !== "all") {
      filtered = filtered.filter(hospital => 
        hospital.specialties && hospital.specialties.includes(specialtyFilter)
      );
    }
    
    // Calculate distances and filter by radius if user location is available
    if (userLocation) {
      // First, geocode hospital addresses to get coordinates if not already done
      const enhancedHospitals = await Promise.all(filtered.map(async hospital => {
        // Skip if already has lat/lng
        if (typeof hospital.lat === 'number' && typeof hospital.lng === 'number') {
          const distance = calculateDistance(
            userLocation.lat, 
            userLocation.lng, 
            hospital.lat, 
            hospital.lng
          );
          return { ...hospital, distance };
        }
        
        // Generate approximate coordinates based on address
        const address = `${hospital.address}, ${hospital.city}, ${hospital.state} ${hospital.zip_code}`;
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}`
          );
          
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            const distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
            return { ...hospital, lat, lng, distance };
          }
          return hospital;
        } catch (error) {
          console.error(`Error geocoding address for ${hospital.name}:`, error);
          return hospital;
        }
      }));
      
      // Filter by radius and sort by distance
      filtered = enhancedHospitals
        .filter(hospital => typeof hospital.distance === 'number' && hospital.distance <= searchRadius)
        .sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }
    
    setFilteredHospitals(filtered);
    
    // Update map markers if map is initialized
    if (map.current) {
      addHospitalMarkers();
    }
  };
  
  // Add hospital markers to the map
  const addHospitalMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());
    
    // Add user location marker if available
    if (userLocation) {
      new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
    }
    
    // Add hospital markers
    filteredHospitals.forEach(hospital => {
      if (typeof hospital.lat === 'number' && typeof hospital.lng === 'number') {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${hospital.name}</strong>
           <p>${hospital.address}, ${hospital.city}, ${hospital.state} ${hospital.zip_code}</p>
           ${hospital.distance ? `<p>Distance: ${hospital.distance.toFixed(1)} km</p>` : ''}
           ${hospital.specialties ? `<p>Specialties: ${hospital.specialties.join(', ')}</p>` : ''}`
        );
        
        new mapboxgl.Marker({ color: '#0077cc' })
          .setLngLat([hospital.lng, hospital.lat])
          .setPopup(popup)
          .addTo(map.current);
      }
    });
  };
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterHospitals();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">Find Hospitals</h3>
          
          {!mapboxToken && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                Please enter your Mapbox access token to enable map features
              </p>
              <Input
                type="text"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="Enter Mapbox token"
                className="mt-2"
              />
            </div>
          )}
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hospital name, city, or specialty"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Specialty</label>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="location" 
                checked={useCurrentLocation}
                onCheckedChange={setUseCurrentLocation}
                disabled={!mapboxToken}
              />
              <label htmlFor="location" className="text-sm font-medium">
                Use my current location
              </label>
            </div>
            
            {useCurrentLocation && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Search radius: {searchRadius} km
                </label>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[searchRadius]}
                  onValueChange={(values) => setSearchRadius(values[0])}
                  disabled={!userLocation}
                />
              </div>
            )}
            
            <Button type="submit" className="w-full">
              Search Hospitals
            </Button>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow mt-4 p-4">
          <h3 className="text-lg font-medium mb-2">Results ({filteredHospitals.length})</h3>
          {filteredHospitals.length > 0 ? (
            <div className="space-y-3">
              {filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <h4 className="font-medium">{hospital.name}</h4>
                  <p className="text-sm text-gray-500">
                    {hospital.address}, {hospital.city}, {hospital.state} {hospital.zip_code}
                  </p>
                  {hospital.distance && (
                    <p className="text-sm text-blue-600">
                      {hospital.distance.toFixed(1)} km away
                    </p>
                  )}
                  {hospital.specialties && (
                    <p className="text-xs text-gray-500 mt-1">
                      Specialties: {hospital.specialties.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No hospitals found matching your criteria.</p>
          )}
        </div>
      </div>
      
      <div className="md:w-2/3">
        <div className="bg-white rounded-lg shadow p-4 h-full">
          {mapboxToken ? (
            <div ref={mapContainer} className="w-full h-96 rounded border" />
          ) : (
            <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded border">
              <p className="text-gray-500">Please enter your Mapbox token to view the map</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalFinder;
