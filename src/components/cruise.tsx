import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

// Type definitions for ports and cruises
interface Port {
  // port_id: number;
  id?: number;
  port_name: string;
  location: string;
  country: string;
}

interface Cruise {
  id: number;
  cruise_name: string;
  ports: Port[];
}

const CruiseSearch: React.FC = () => {
  const [ports, setPorts] = useState<Port[]>([]); // All available ports
  const [selectedPorts, setSelectedPorts] = useState<Port[]>([]); // Selected ports
  const [loading, setLoading] = useState<boolean>(false); // Loading state for fetching cruises
  const [cruises, setCruises] = useState<Cruise[]>([]); // Fetched cruises

  // Fetch all ports on component mount
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        // const response = await axios.get<Port[]>('/api/ports'); // Replace with your API endpoint
        // setPorts(response.data);

        setPorts([
          { "id": 1, "port_name": "Port of Miami", "location": "Miami", "country": "USA" },
          { "id": 2, "port_name": "Port of Rotterdam", "location": "Rotterdam", "country": "Netherlands" }
        ]
        )
      } catch (error) {
        console.error('Error fetching ports:', error);
      }
    };
    fetchPorts();
  }, []);

  // Handle search button click
  const handleSearch = async () => {
    if (selectedPorts.length === 0) {
      alert('Please select at least one port.');
      return;
    }

    setLoading(true);
    try {
      // const response = await axios.post<Cruise[]>('/api/cruises/search', {
      //   ports: selectedPorts.map((port) => port.port_name), // Send selected port names
      // });
      // setCruises(response.data);

      setCruises([
        {
          "id": 1,
          "cruise_name": "Caribbean Cruise",
          "ports": [
            { "port_name": "Port of Miami", "location": "Miami", "country": "USA" },
            { "port_name": "Port of Nassau", "location": "Nassau", "country": "Bahamas" }
          ]
        }
      ]
      )
    } catch (error) {
      console.error('Error fetching cruises:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Cruise Search by Ports
      </Typography>

      {/* Multi-select Dropdown */}
      <Autocomplete
        multiple
        options={ports}
        getOptionLabel={(option) => option.port_name}
        value={selectedPorts}
        onChange={(_, newValue) => setSelectedPorts(newValue)}
        renderInput={(params) => (
          <TextField {...params} label="Select Ports" placeholder="Start typing..." />
        )}
        sx={{ mb: 3 }}
      />

      {/* Search Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Find Cruises'}
      </Button>

      {/* Cruise List */}
      {cruises.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Found Cruises
          </Typography>
          {cruises.map((cruise) => (
            <Card key={cruise.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{cruise.cruise_name}</Typography>
                <Typography variant="body1">
                  Ports: {cruise.ports
                    .map(
                      (port) =>
                        `${port.port_name} (${port.location}, ${port.country})`
                    )
                    .join(' → ')}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CruiseSearch;
