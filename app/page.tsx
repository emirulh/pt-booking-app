"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft, Calendar as CalendarIcon, MapPin, Dumbbell, Target, CheckCircle, MessageCircle } from "lucide-react";

export default function BookingApp() {
  const [step, setStep] = useState("landing"); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.getDay();
      if (day !== 0 && day !== 6) {
        dates.push(date);
      }
    }
    return dates;
  }, []);

  if (!selectedDate && availableDates.length > 0) {
    setSelectedDate(availableDates[0]);
  }

  const timeSlots = [
    "9:00 AM", "10:30 AM", "12:00 PM", "1:30 PM", 
    "3:00 PM", "4:30 PM", "6:30 PM"
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const calculateBMI = () => {
    if (!height || !weight) return null;
    const h = parseFloat(height) / 100; 
    const w = parseFloat(weight);
    
    if (h > 0 && w > 0) {
      const bmi = w / (h * h);
      let category = "";
      let colorClass = "";
      
      if (bmi < 18.5) {
        category = "Underweight";
        colorClass = "text-blue-600 bg-blue-50";
      } else if (bmi < 25) {
        category = "Normal";
        colorClass = "text-green-600 bg-green-50";
      } else if (bmi < 30) {
        category = "Overweight";
        colorClass = "text-orange-600 bg-orange-50";
      } else {
        category = "Obese";
        colorClass = "text-red-600 bg-red-50";
      }
      
      return { value: bmi.toFixed(1), category, colorClass };
    }
    return null;
  };

  const bmiData = calculateBMI();

  // Reset Function for the Home Button
  const resetApp = () => {
    setStep("landing");
    setSelectedTime(null);
    setHeight("");
    setWeight("");
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-white text-black font-sans max-w-md mx-auto relative overflow-hidden flex flex-col">
      
      {/* Dynamic Header - Hidden on Landing and Payment screens */}
      <AnimatePresence>
        {step !== "landing" && step !== "payment" && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 py-4 flex justify-between items-center border-b border-gray-50 shrink-0"
          >
            <button 
              onClick={() => step === "select-time" ? setStep("intake-form") : setStep("landing")} 
              className="text-black active:scale-90 transition-transform"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg font-semibold tracking-tight">Book Session</h1>
            <div className="w-6" /> 
          </motion.header>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        
        {/* STEP 0: The Main Landing Screen */}
        {step === "landing" && (
          <motion.div 
            key="landing-step"
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-center px-6 pb-20 relative z-10"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="w-35 h-35 bg-[#F5F5F7] rounded-full mx-auto mb-6 flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden"
            >
                <img 
                  src="https://6a55f186d4a818593bc01e79.imgix.net/sandbox/photo_2026-07-16_16-51-35.jpg" 
                  alt="Emirul Hakimi"
                  className="w-full h-full object-cover"
                />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold tracking-tight mb-2">Emirul Hakimi</h1>
              <p className="text-gray-500 text-sm leading-relaxed px-4">
                Helping you build strength and master your nutrition, one session at a time.
              </p>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="col-span-2 bg-[#F5F5F7] p-4 rounded-2xl flex items-center gap-4 border border-gray-100/50">
                <div className="bg-white p-3 rounded-xl text-black shadow-sm">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm">3+ Years Experience</p>
                  <p className="text-xs text-gray-500">Dedicated lifting and training</p>
                </div>
              </div>

              <div className="bg-[#F5F5F7] p-4 rounded-2xl flex flex-col gap-3 border border-gray-100/50">
                <div className="bg-white p-2 rounded-xl text-black shadow-sm self-start">
                  <Target size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">Muscle & Diet</p>
                  <p className="text-[11px] text-gray-500 mt-1">Specialized coaching</p>
                </div>
              </div>

              <div className="bg-[#F5F5F7] p-4 rounded-2xl flex flex-col gap-3 border border-gray-100/50">
                <div className="bg-white p-2 rounded-xl text-black shadow-sm self-start">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">Kuching Area</p>
                  <p className="text-[11px] text-gray-500 mt-1">{"Fee for >10km radius"}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 1: The Intake Form */}
        {step === "intake-form" && (
          <motion.div 
            key="form-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6 py-6 h-full flex flex-col bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-32"
          >
            <div className="shrink-0 mb-6">
              <h2 className="text-3xl font-bold tracking-tight mb-1">Your Details</h2>
              <p className="text-gray-500 text-sm">Let's tailor this session to you.</p>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="bg-[#F5F5F7] rounded-2xl overflow-hidden flex flex-col transition-all">
                <input type="text" placeholder="Full Name" className="w-full bg-transparent p-4 outline-none border-b border-gray-200/60" />
                <input type="text" placeholder="Nickname" className="w-full bg-transparent p-4 outline-none border-b border-gray-200/60" />
                <div className="flex border-b border-gray-200/60">
                  <input type="number" placeholder="Age" className="w-1/3 bg-transparent p-4 outline-none border-r border-gray-200/60" />
                  <input 
                    type="number" 
                    placeholder="Height (cm)" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-1/3 bg-transparent p-4 outline-none border-r border-gray-200/60" 
                  />
                  <input 
                    type="number" 
                    placeholder="Weight (kg)" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-1/3 bg-transparent p-4 outline-none" 
                  />
                </div>
                
                <AnimatePresence>
                  {bmiData && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`flex justify-between items-center px-4 py-3 text-sm font-semibold ${bmiData.colorClass}`}
                    >
                      <span>Estimated BMI</span>
                      <span>{bmiData.value} ({bmiData.category})</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-[#F5F5F7] rounded-2xl overflow-hidden p-4">
                 <p className="text-sm font-semibold text-gray-500 mb-2">Gym Experience</p>
                 <textarea 
                  rows={3} 
                  placeholder="How long have you been training? Familiar with free weights or machines?"
                  className="w-full bg-transparent outline-none resize-none"
                 />
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 2: Time Selection */}
        {step === "select-time" && (
          <motion.div 
            key="time-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col h-full overflow-hidden"
          >
            <div className="px-6 pt-6 pb-4 shrink-0">
              <h2 className="text-3xl font-bold tracking-tight mb-1">Select a Time</h2>
              <p className="text-gray-500 text-sm">1.5 hour 1-on-1 sessions.</p>
            </div>

            <div 
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={() => setIsDragging(false)}
              onMouseUp={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              className={`flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-3 px-6 py-2 shrink-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab snap-x'}`}
            >
              {availableDates.map((date, idx) => {
                const isSelected = selectedDate?.getTime() === date.getTime();
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isDragging) {
                        setSelectedDate(date);
                        setSelectedTime(null); 
                      }
                    }}
                    className={`flex flex-col items-center justify-center min-w-[72px] h-[90px] rounded-2xl transition-colors select-none ${!isDragging && 'snap-start'} ${
                      isSelected 
                        ? "bg-black text-white shadow-md" 
                        : "bg-[#F5F5F7] text-black hover:bg-gray-200"
                    }`}
                  >
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="text-2xl font-bold mt-1 pointer-events-none">
                      {date.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="px-6 mt-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-32">
              <div className="flex items-center gap-2 mb-4 text-gray-500">
                <CalendarIcon size={16} />
                <span className="text-sm font-semibold">
                  {selectedDate?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-4 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                        isSelected
                          ? "bg-black text-white ring-2 ring-black ring-offset-2"
                          : "bg-[#F5F5F7] text-black hover:bg-gray-200"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: The Payment Confirmation Screen */}
        {step === "payment" && (
          <motion.div 
            key="payment-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 h-full flex flex-col justify-center items-center text-center bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-12"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
              className="bg-green-50 text-green-600 p-4 rounded-full mb-6 mt-8"
            >
              <CheckCircle size={48} strokeWidth={2.5} />
            </motion.div>
            
            <h2 className="text-3xl font-bold tracking-tight mb-2">Slot Reserved!</h2>
            <p className="text-gray-500 text-sm mb-8 px-4">
              Your session on <span className="font-semibold text-black">{selectedDate?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {selectedTime}</span> is on hold. Complete your payment to secure it.
            </p>

            {/* Apple-style QR Code Card */}
            <div className="bg-[#F5F5F7] p-6 rounded-3xl w-full flex flex-col items-center border border-gray-100 shadow-sm">
               <img 
                 src="https://6a55f186d4a818593bc01e79.imgix.net/sandbox/photo_2026-07-16_16-31-11.jpg" 
                 alt="Scan to Pay RM35" 
                 className="w-48 h-48 rounded-2xl object-cover mb-4 shadow-sm"
               />
               <p className="text-lg font-bold mb-1">Scan to Pay RM35</p>
               <div className="w-12 h-1 bg-gray-200 rounded-full my-3"></div>
               <p className="text-sm text-gray-500 px-2 font-medium">
                 Please screenshot your payment proof or save the receipt as a PDF.
               </p>
            </div>

            {/* In-Flow Buttons (Moved out of fixed positioning for better spacing) */}
            <div className="w-full mt-3 flex flex-col">
              <a 
                href="https://wa.link/q7ublu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
              >
                <MessageCircle size={22} /> Send Proof via WhatsApp
              </a>

              <button 
                onClick={resetApp}
                className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center shadow-sm active:scale-95 transition-transform mt-8"
              >
                Back to Home Screen
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Global Bottom CTA Buttons (Hidden on Payment Step) */}
      <AnimatePresence>
        {step === "landing" && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-8 left-0 right-0 px-6 z-20"
          >
            <motion.button 
              whileTap={{ scale: 0.96 }}
              onClick={() => setStep("intake-form")}
              className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-2xl shadow-black/20"
            >
              Book a Session
            </motion.button>
          </motion.div>
        )}

        {step === "intake-form" && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-8 left-0 right-0 px-6 bg-gradient-to-t from-white via-white to-transparent pt-4 z-20"
          >
            <motion.button 
              whileTap={{ scale: 0.96 }}
              onClick={() => setStep("select-time")}
              className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-xl shadow-black/10"
            >
              Continue to Schedule <ChevronRight size={20} />
            </motion.button>
          </motion.div>
        )}

        {step === "select-time" && selectedTime && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-8 left-0 right-0 px-6 bg-gradient-to-t from-white via-white to-transparent pt-4 z-20"
          >
            <button 
              onClick={() => setStep("payment")}
              className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-xl shadow-black/10 active:scale-95 transition-transform"
            >
              Confirm RM35 Booking
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}