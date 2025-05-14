import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaCar, 
  FaRoute, 
  FaMoneyBillWave, 
  FaTools, 
  FaBuilding, 
  FaUsers, 
  FaKey,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaStar,
  FaCarAlt,
  FaTrash,
  FaUserPlus,
  FaCheck,
  FaBan,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa';

// Tab Components
const Overview = ({ dashboardData }) => (
  <div className="space-y-8">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      <DashboardCard
        icon={FaCar}
        title="Available Cars"
        value={dashboardData.carStatus.available}
        trend="+2.5%"
        trendUp={true}
      />
      
      <DashboardCard
        icon={FaRoute}
        title="Confirmed Trips"
        value={dashboardData.trips.confirmed}
        trend="+1.2%"
        trendUp={true}
      />
      
      <DashboardCard
        icon={FaMoneyBillWave}
        title="Total Revenue"
        value={`$${dashboardData.payments.revenue}`}
        trend="+4.75%"
        trendUp={true}
      />
      
      <DashboardCard
        icon={FaChartLine}
        title="Completed Revenue"
        value={`$${dashboardData.payments.completedRevenue}`}
        trend="-0.8%"
        trendUp={false}
      />
    </div>

    {/* Secondary Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Maintenance Overview</h3>
          <FaTools className="text-gray-400 text-xl" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Logs</span>
            <span className="text-gray-900 font-medium">{dashboardData.maintenance.logs}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Cost</span>
            <span className="text-gray-900 font-medium">${dashboardData.maintenance.cost}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Company Metrics</h3>
          <FaBuilding className="text-gray-400 text-xl" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Requests</span>
            <span className="text-gray-900 font-medium">{dashboardData.companies.requests}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Companies Requested</span>
            <span className="text-gray-900 font-medium">{dashboardData.companies.requested}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ActiveRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        console.log('Fetching rentals data...');
        const response = await axios.get('http://localhost:5000/api/misc/rentals');
        console.log('Rentals data received:', response.data);
        setRentals(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        setError('Failed to fetch rental data');
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const handleDeleteRental = async (scheduleId) => {
    if (window.confirm('Are you sure you want to cancel this rental?')) {
      // This is a placeholder for the actual API call
      console.log('Canceling rental:', scheduleId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Confirmed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredRentals = rentals.filter(rental => 
    rental.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.location_from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.location_to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaKey className="text-indigo-500 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Active Rentals</h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search rentals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Rentals Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRentals.map((rental) => (
                <tr key={rental.schedule_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{rental.schedule_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCarAlt className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{rental.model}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rental.partner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{rental.driver_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        <span>Start: {formatDate(rental.start_date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="text-gray-400 mr-2" />
                        <span>End: {formatDate(rental.end_date)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-green-500 mr-2" />
                        <span>From: {rental.location_from}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        <span>To: {rental.location_to}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteRental(rental.schedule_id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-150"
                      title="Cancel Rental"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredRentals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No rentals found</div>
          </div>
        )}
      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('All');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'Driver',
    password: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users data...');
        const response = await axios.get('http://localhost:5000/api/users/');
        console.log('Users data received:', response.data[0]);
        setUsers(response.data[0]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users data');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    // This is a placeholder for the actual API call
    console.log('Adding user:', newUser);
    setShowAddModal(false);
    setNewUser({ username: '', email: '', role: 'Driver', password: '' });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // This is a placeholder for the actual API call
      console.log('Deleting user:', userId);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      'CarPartner': 'bg-blue-100 text-blue-800',
      'CompanyUser': 'bg-purple-100 text-purple-800',
      'Driver': 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'Activated' ? 'text-green-500' : 'text-red-500';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaUsers className="text-indigo-500 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Roles</option>
                <option value="CarPartner">Car Partner</option>
                <option value="CompanyUser">Company User</option>
                <option value="Driver">Driver</option>
              </select>
              {/* Add User Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-150"
              >
                <FaUserPlus />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.status === 'Activated' ? (
                        <FaCheck className="text-green-500 mr-2" />
                      ) : (
                        <FaBan className="text-red-500 mr-2" />
                      )}
                      <span className={`text-sm ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteUser(user.user_id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-150"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Add New User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Driver">Driver</option>
                  <option value="CarPartner">Car Partner</option>
                  <option value="CompanyUser">Company User</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching cars and drivers data...');
        const response = await axios.get('http://localhost:5000/api/bookings/drivers');
        console.log('Cars and drivers data received:', response.data);
        const [carsData, driversData] = response.data;
        console.log('Cars data:', carsData);
        console.log('Drivers data:', driversData);
        setCars(carsData);
        setDrivers(driversData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cars and drivers:', err);
        setError('Failed to fetch cars and drivers data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const brands = ['All', ...new Set(cars.map(car => {
    const prefix = car.license_plate.split('-')[0];
    const brandMap = {
      'FE': 'Ferrari',
      'LA': 'Lamborghini',
      'BU': 'Bugatti',
      'PA': 'Pagani',
      'ME': 'Mercedes',
      'BM': 'BMW',
      'AU': 'Audi',
      'TO': 'Toyota',
      'HO': 'Honda',
      'KI': 'Kia',
      'NI': 'Nissan',
      'MA': 'Mazda',
      'FO': 'Ford',
      'SU': 'Suzuki'
    };
    return brandMap[prefix] || prefix;
  }))];

  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = 
      selectedBrand === 'All' || 
      car.license_plate.startsWith(Object.keys(brands).find(key => brands[key] === selectedBrand) || selectedBrand);

    return matchesSearch && matchesBrand;
  });

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      {error}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cars Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaCarAlt className="text-indigo-500 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">Car Inventory</h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCars.map((car) => (
                <tr key={car.car_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.car_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{car.license_plate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {brands.find(brand => car.license_plate.startsWith(Object.keys(brands).find(key => brands[key] === brand)))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCars.length)} of {filteredCars.length} cars
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <FaUsers className="text-indigo-500 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800">Drivers</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map(driver => (
              <div key={driver.driver_id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Driver #{driver.driver_id}</span>
                  <div className="flex items-center text-yellow-400">
                    <FaStar className="mr-1" />
                    <span className="text-gray-700">{driver.rating}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  License: {driver.license_number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ icon: Icon, title, value, trend, trendUp }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="text-gray-500 text-sm">{title}</div>
      <Icon className="text-gray-400 text-xl" />
    </div>
    <div className="flex items-end justify-between">
      <div>
        <div className="text-2xl font-semibold text-gray-800 mb-1">
          {value}
        </div>
        <div className={`text-sm flex items-center ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
          <svg
            className={`w-3 h-3 ml-1 ${!trendUp && 'transform rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaTachometerAlt },
    { id: 'activeRentals', label: 'Active Rentals', icon: FaKey },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'cars', label: 'Cars', icon: FaCar }
  ];

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-72 transform transition-transform duration-200 ease-in-out z-30
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500 text-white p-2 rounded-lg">
              <FaCar className="text-xl" />
            </div>
            <span className="text-xl font-semibold text-gray-800">Car Rental</span>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-gray-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors duration-150
                  ${activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <tab.icon className={`text-xl ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    carStatus: { available: 0 },
    trips: { confirmed: 0 },
    payments: { total: 0, revenue: 0, completedRevenue: 0 },
    maintenance: { logs: 0, cost: 0 },
    companies: { requests: 0, requested: 0 }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Fetching dashboard data...');
        const response = await axios.get('http://localhost:5000/api/users/dashboard');
        console.log('Dashboard data received:', response.data);

        // Validate that response.data is an array with expected length
        if (!Array.isArray(response.data) || response.data.length < 5) {
          throw new Error('Invalid dashboard data format');
        }

        const [carStatus, trips, payments, maintenance, companies] = response.data;
        
        // Validate each section of data and provide defaults if undefined
        const dashboardUpdate = {
          carStatus: { 
            available: carStatus?.[0]?.TotalCars || 0 
          },
          trips: { 
            confirmed: trips?.[0]?.TotalTrips || 0 
          },
          payments: {
            total: payments?.[0]?.TotalPayments || 0,
            revenue: payments?.[0]?.TotalRevenue || 0,
            completedRevenue: payments?.[0]?.CompletedRevenue || 0
          },
          maintenance: {
            logs: maintenance?.[0]?.TotalMaintenanceLogs || 0,
            cost: maintenance?.[0]?.TotalMaintenanceCost || 0
          },
          companies: {
            requests: companies?.[0]?.TotalCompanyRequests || 0,
            requested: companies?.[0]?.CompaniesRequested || 0
          }
        };

        console.log('Processed dashboard data:', dashboardUpdate);
        setDashboardData(dashboardUpdate);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex items-center space-x-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <FaTimes className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview dashboardData={dashboardData} />;
      case 'activeRentals':
        return <ActiveRentals />;
      case 'users':
        return <Users />;
      case 'cars':
        return <Cars />;
      default:
        return <Overview dashboardData={dashboardData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaBars className="text-xl" />
          </button>
          <div className="font-semibold text-gray-800">Dashboard</div>
          <div className="w-8" />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-72 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
          
          {/* Tab Content */}
          <div>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 