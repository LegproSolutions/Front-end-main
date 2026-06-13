import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import axios from "../../utils/axiosConfig";

const backendUrl = import.meta.env?.VITE_API_URL;

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    recentJobs: [],
    topCategories: [],
    topLocations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersResponse = await axios.get(`${backendUrl}/api/admin/all-users`, {
          withCredentials: true,
        });
        
        // Fetch companies
        const companiesResponse = await axios.get(`${backendUrl}/api/admin/companies`, {
          withCredentials: true,
        });
        
        // Fetch jobs
        const jobsResponse = await axios.get(`${backendUrl}/api/jobs/`, {
          withCredentials: true,
        });

        const users = usersResponse.data.users || [];
        const companies = companiesResponse.data.companies || [];
        const jobs = jobsResponse.data.jobs || [];

        // Calculate top categories
        const categoryCount = {};
        jobs.forEach(job => {
          categoryCount[job.category] = (categoryCount[job.category] || 0) + 1;
        });
        const topCategories = Object.entries(categoryCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([category, count]) => ({ category, count }));

        // Calculate top locations
        const locationCount = {};
        jobs.forEach(job => {
          const location = job.location.split(',')[0].trim(); // Get city part
          locationCount[location] = (locationCount[location] || 0) + 1;
        });
        const topLocations = Object.entries(locationCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([location, count]) => ({ location, count }));

        // Get recent jobs
        const recentJobs = jobs
          .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
          .slice(0, 5);

        setStats({
          totalUsers: users.length,
          totalCompanies: companies.length,
          totalJobs: jobs.length,
          totalApplications: 0, // You can calculate this if you have application data
          recentJobs,
          topCategories,
          topLocations
        });

      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatSalary = (salary) => {
    if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(1)}L`;
    }
    return `₹${(salary / 1000).toFixed(0)}K`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-legpro-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-legpro-primary" />
          <h1 className="text-2xl font-bold text-legpro-primary">Platform Analytics</h1>
        </div>
        
        <Link 
          to="/admin/crm" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-all shadow-sm active:scale-95"
        >
          <BarChart3 className="h-4 w-4 rotate-90" />
          Jobmela CRM
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-legpro-primary">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-legpro-primary">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-legpro-primary">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              Active job postings
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <p className="text-xs text-muted-foreground">
              Platform growth
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Job Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCategories.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-legpro-primary h-2 rounded-full" 
                        style={{
                          width: `${(item.count / Math.max(...stats.topCategories.map(c => c.count))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Job Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topLocations.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-legpro-primary h-2 rounded-full" 
                        style={{
                          width: `${(item.count / Math.max(...stats.topLocations.map(l => l.count))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Job Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentJobs.map((job) => (
              <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{job.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{job.companyId?.name || 'Unknown Company'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(job.date || job.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

