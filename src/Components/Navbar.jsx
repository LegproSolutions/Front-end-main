import {
  Bell,
  Briefcase,
  ChevronDown,
  FileText,
  Home,
  LogOut,
  Menu,
  User,
  UserPlus,
} from "lucide-react";
import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { AppContext } from "../context/AppContext";
import { cn } from "../lib/utils";
import UserLogin from "./Auth/UserLogin";
import RecruiterLogin from "./Auth/RecruiterLogin";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [recruiterLoginOpen, setRecruiterLoginOpen] = useState(false);

  const {
    userData,
    isUserAuthenticated,
    userlogout,
    isLoggingOut,
    showUserLogin,
    setShowUserLogin,
    setUserLoginState,
  } = useContext(AppContext);
  const location = useLocation();

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Applied Jobs", href: "/application", icon: FileText },
    ...(isUserAuthenticated ? [{ name: "Profile", href: "/profile", icon: User }] : []),
  ];

  const isActiveRoute = (href) => location.pathname === href;

  return (
    <>
      {/* Spacer to reserve height for fixed header */}
      <div className="h-16 w-full" />
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 group">
            <img
              src={assets.logo}
              alt="Job Mela Logo"
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-legpro-primary text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Auth & User Menu */}
          <div className="flex items-center space-x-3">
            {isUserAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full h-10 w-10 flex items-center justify-center transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </Button>
            )}
            {isUserAuthenticated ? (
              <>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 rounded-full hover:bg-gray-100 p-1"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                          <AvatarImage
                            src={userData?.profilePicture || userData?.image || userData?.profileImg}
                            alt={userData?.name}
                          />
                          <AvatarFallback className="bg-legpro-primary text-white text-sm">
                            {(
                              userData?.firstName?.[0] ||
                              userData?.name?.[0] ||
                              "U"
                            ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:block text-sm font-medium text-gray-700">
                          {userData?.firstName || userData?.name || "User"}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex items-center space-x-3 p-2">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={userData?.profilePicture || userData?.image || userData?.profileImg}
                            alt={userData?.name}
                          />
                          <AvatarFallback className="bg-legpro-primary text-white">
                            {(
                              userData?.firstName?.[0] ||
                              userData?.name?.[0] ||
                              "U"
                            ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="font-semibold text-sm">
                            {userData?.firstName || userData?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="flex items-center cursor-pointer"
                      >
                        <User className="mr-3 h-4 w-4 text-gray-600" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/application"
                        className="flex items-center cursor-pointer"
                      >
                        <FileText className="mr-3 h-4 w-4 text-gray-600" />
                        <span>My Applications</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={userlogout}
                      disabled={isLoggingOut}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    id="login-dropdown-btn"
                    className="group bg-gradient-to-r from-legpro-primary to-blue-600 hover:from-legpro-primary-hover hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 text-sm px-5 py-2.5 font-semibold flex items-center space-x-2 rounded-xl border border-white/10"
                  >
                    <span>Login</span>
                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180 opacity-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-2 rounded-2xl border border-gray-100 shadow-2xl bg-white/95 backdrop-blur-md" align="end">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Sign in to your account
                  </div>
                  <DropdownMenuItem
                    id="candidate-login-btn"
                    onClick={() => setShowUserLogin(true)}
                    className="flex items-start cursor-pointer p-3 rounded-xl hover:bg-blue-50/50 transition-colors duration-200 focus:bg-blue-50/50"
                  >
                    <div className="p-2 bg-blue-50 rounded-lg mr-3 text-legpro-primary mt-0.5">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-sm">Candidate Login</span>
                      <span className="text-xs text-gray-500 mt-0.5">Find jobs, build profile & apply</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1.5 bg-gray-50" />
                  <DropdownMenuItem
                    id="employer-login-btn"
                    onClick={() => setRecruiterLoginOpen(true)}
                    className="flex items-start cursor-pointer p-3 rounded-xl hover:bg-emerald-50/50 transition-colors duration-200 focus:bg-emerald-50/50"
                  >
                    <div className="p-2 bg-emerald-50 rounded-lg mr-3 text-emerald-600 mt-0.5">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 text-sm">Employer Login</span>
                      <span className="text-xs text-gray-500 mt-0.5">Post openings & hire top talent</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!isUserAuthenticated && (
              <Button
                onClick={() => {
                  setUserLoginState("signup");
                  setShowUserLogin(true);
                }}
                className="hidden md:inline-flex bg-transparent hover:bg-legpro-primary/10 text-legpro-primary border border-legpro-primary font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Register as Candidate</span>
              </Button>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col space-y-6 mt-8">
                   {/* Mobile Logo */}
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-1 pb-4 border-b group"
                  >
                    <img
                      src={assets.logo}
                      alt="Job Mela Logo"
                      className="h-11 w-auto object-contain"
                    />
                  </Link>

                  {/* Mobile Navigation Items */}
                  <div className="flex flex-col space-y-1">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                            isActive
                              ? "bg-legpro-primary text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile User Section */}
                  {isUserAuthenticated ? (
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10 ring-2 ring-white">
                          <AvatarImage
                            src={userData?.profilePicture || userData?.image || userData?.profileImg}
                            alt={userData?.name}
                          />
                          <AvatarFallback className="bg-legpro-primary text-white">
                            {(
                              userData?.firstName?.[0] ||
                              userData?.name?.[0] ||
                              "U"
                            ).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-900">
                            {userData?.firstName || userData?.name || "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 text-gray-600"
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            userlogout();
                            setMobileMenuOpen(false);
                          }}
                          disabled={isLoggingOut}
                          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 px-4 py-2.5"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t pt-4 flex flex-col gap-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            id="mobile-login-dropdown-btn"
                            className="group w-full bg-gradient-to-r from-legpro-primary to-blue-600 hover:from-legpro-primary-hover hover:to-blue-700 text-white shadow-md font-semibold flex items-center justify-center space-x-2 py-6 rounded-xl"
                          >
                            <span>Login</span>
                            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180 opacity-90" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[280px] p-2 rounded-2xl border border-gray-100 shadow-xl bg-white" align="center">
                          <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Choose Login Type
                          </div>
                          <DropdownMenuItem
                            id="mobile-candidate-login-btn"
                            onClick={() => {
                              setShowUserLogin(true);
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-start cursor-pointer p-3 rounded-xl hover:bg-blue-50/50 transition-colors focus:bg-blue-50/50"
                          >
                            <div className="p-2 bg-blue-50 rounded-lg mr-3 text-legpro-primary">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800 text-sm">Candidate Login</span>
                              <span className="text-[11px] text-gray-500 mt-0.5">Find jobs & apply</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1.5 bg-gray-50" />
                          <DropdownMenuItem
                            id="mobile-employer-login-btn"
                            onClick={() => {
                              setRecruiterLoginOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-start cursor-pointer p-3 rounded-xl hover:bg-emerald-50/50 transition-colors focus:bg-emerald-50/50"
                          >
                            <div className="p-2 bg-emerald-50 rounded-lg mr-3 text-emerald-600">
                              <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800 text-sm">Employer Login</span>
                              <span className="text-[11px] text-gray-500 mt-0.5">Post jobs & hire</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        onClick={() => {
                          setUserLoginState("signup");
                          setShowUserLogin(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-transparent hover:bg-legpro-primary/10 text-legpro-primary border border-legpro-primary font-semibold py-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Register as Candidate</span>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Candidate Login Modal is now handled globally in App.jsx */}

      {/* Employer Login Modal */}
      {recruiterLoginOpen && (
        <RecruiterLogin isOpen={recruiterLoginOpen} onClose={() => setRecruiterLoginOpen(false)} />
      )}
    </>
  );
};

export default Navbar;

