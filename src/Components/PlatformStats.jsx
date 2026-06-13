import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/axiosConfig";
import { AppContext } from "../context/AppContext";
import { Users, Building2, Briefcase } from "lucide-react";

const AnimatedCounter = ({ value, formatNumber, loading }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (loading || !value) return;

        let startTime = null;
        const duration = 5000; // 5 seconds animation
        const startValue = 1;
        const endValue = value || 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Easing function: easeOutExpo
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const nextValue = Math.floor(easeOutExpo * (endValue - startValue) + startValue);
            setDisplayValue(nextValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, loading]);

    if (loading) return "1";
    return formatNumber(displayValue);
};

const PlatformStats = () => {
    const { platformStats, isStatsLoading } = useContext(AppContext);

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN').format(num);
    };

    const statItems = [
        {
            label: "Registered Jobseekers",
            value: platformStats.jobseekers,
            icon: <Users className="w-8 h-8 text-white" />,
            color: "bg-blue-900"
        },
        {
            label: "Employers With Us",
            value: platformStats.companies,
            icon: <Building2 className="w-8 h-8 text-white" />,
            color: "bg-blue-900"
        },
        {
            label: "Job Opportunities",
            value: platformStats.jobs,
            icon: <Briefcase className="w-8 h-8 text-white" />,
            color: "bg-blue-900"
        }
    ];

    return (
        <section className="pt-8 pb-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statItems.map((item, index) => (
                        <div 
                            key={index}
                            className="flex items-center justify-between p-6 bg-white border border-blue-100 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex flex-col ml-6">
                                <span className="text-3xl font-bold text-gray-900">
                                    <AnimatedCounter 
                                        value={item.value} 
                                        loading={isStatsLoading} 
                                        formatNumber={formatNumber} 
                                    />
                                </span>
                                <span className="text-sm font-medium text-blue-800">
                                    {item.label}
                                </span>
                            </div>
                            <div className={`p-4 rounded-2xl ${item.color} mr-2 shadow-lg`}>
                                {item.icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlatformStats;
