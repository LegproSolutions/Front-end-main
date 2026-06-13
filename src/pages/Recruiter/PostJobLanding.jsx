import React, { useState, useContext } from "react";
import {
    Briefcase,
    CheckCircle,
    Mail,
    ArrowRight,
    ShieldCheck,
    Users,
    Target,
    Zap
} from "lucide-react";
import { AppContext } from "../../context/AppContext";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent } from "@/Components/ui/card";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PostJobLanding = () => {
    const { setShowRecruiterLogin, isCompanyAuthenticated } = useContext(AppContext);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        setIsVerifying(true);
        // Simulate OTP send
        setTimeout(() => {
            setStep(2);
            setIsVerifying(false);
            toast.success("Verification code sent! Use 123456 for testing");
        }, 1500);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp !== "123456") {
            toast.error("Invalid code! Please use 123456");
            return;
        }
        setIsVerifying(true);
        // Simulate Verification
        setTimeout(() => {
            setIsVerifying(false);
            toast.success("Email verified successfully!");
            if (isCompanyAuthenticated) {
                navigate("/dashboard/add-job");
            } else {
                setShowRecruiterLogin(true);
            }
        }, 1500);
    };

    const features = [
        {
            icon: <Users className="w-6 h-6 text-blue-600" />,
            title: "Access to Millions",
            desc: "Reach a massive pool of qualified candidates instantly."
        },
        {
            icon: <Target className="w-6 h-6 text-green-600" />,
            title: "Smart Matching",
            desc: "Our AI helps you find the perfect fit for your role."
        },
        {
            icon: <Zap className="w-6 h-6 text-purple-600" />,
            title: "Fast Hiring",
            desc: "Shorten your hiring cycle with streamlined tools."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-white border-b py-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 transform translate-x-20 z-0" />

                    <div className="container mx-auto px-4 max-w-7xl relative z-10">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                                    <Briefcase className="w-4 h-4" />
                                    <span>For Employers</span>
                                </div>

                                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                    Hire the Best Talent <br />
                                    <span className="text-blue-600">Faster Than Ever</span>
                                </h1>

                                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                                    Post your job openings and connect with millions of job seekers.
                                    Verified recruiters get 3x more relevant applications.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                                    {features.map((f, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="p-2 bg-white rounded-lg shadow-sm border w-fit">
                                                {f.icon}
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-sm">{f.title}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm p-8 max-w-md mx-auto relative z-10">
                                    <CardContent className="p-0 space-y-6">
                                        <div className="text-center space-y-2">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {step === 1 ? "Verify Your Account" : "Enter Verification Code"}
                                            </h2>
                                            <p className="text-gray-500 text-sm">
                                                {step === 1 ? "Start by verifying your work email" : `Enter the 6-digit code sent to ${email} (Use 123456 for testing)`}
                                            </p>
                                        </div>

                                        {step === 1 ? (
                                            <form onSubmit={handleSendOtp} className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                        <Input
                                                            type="email"
                                                            placeholder="Enter your work email"
                                                            className="pl-10 h-12 text-lg"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    type="submit"
                                                    className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                                                    disabled={isVerifying}
                                                >
                                                    {isVerifying ? "Sending..." : "Send Verification Code"}
                                                    {!isVerifying && <ArrowRight className="ml-2 w-5 h-5" />}
                                                </Button>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">6-Digit Code</label>
                                                    <Input
                                                        type="text"
                                                        placeholder="000000"
                                                        className="h-12 text-center text-2xl tracking-[1em] font-mono"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                        required
                                                    />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
                                                    disabled={isVerifying}
                                                >
                                                    {isVerifying ? "Verifying..." : "Verify & Continue"}
                                                    {!isVerifying && <ShieldCheck className="ml-2 w-5 h-5" />}
                                                </Button>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="w-full text-sm text-blue-600 font-medium hover:underline"
                                                >
                                                    Change Email Address
                                                </button>
                                            </form>
                                        )}

                                        <div className="pt-6 border-t">
                                            <div className="flex items-center space-x-2 text-green-600">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-xs font-semibold">Verified Recruiter Badge upon success</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-2">
                                                By clicking continue, you agree to our Terms of Service and Privacy Policy. Standard message rates may apply.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Decorative elements */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl -z-10" />
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 rounded-full blur-3xl -z-10" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: "Job Seekers", value: "2M+" },
                                { label: "Monthly Hires", value: "50k+" },
                                { label: "Verified Companies", value: "10k+" },
                                { label: "Active Jobs", value: "150k+" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center space-y-1">
                                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PostJobLanding;



