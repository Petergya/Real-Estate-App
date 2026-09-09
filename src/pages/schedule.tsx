// import React, { useState } from 'react';
// import { Calendar, Clock } from 'lucide-react';

// interface ScheduleViewingProps {
//   propertyId: string;
//   onSubmit: (data: { date: string; time: string; message: string }) => void;
// }

// const ScheduleViewing: React.FC<ScheduleViewingProps> = ({ onSubmit }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [message, setMessage] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     try {
//       await onSubmit({ date, time, message });
//       setIsSuccess(true);
//       setDate('');
//       setTime('');
//       setMessage('');
//       setTimeout(() => setIsSuccess(false), 3000);
//     } catch (error) {
//       console.error('Error scheduling viewing:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Generate time slots (every 30 minutes from 8AM to 6PM)
//   const timeSlots = [];
//   for (let hour = 8; hour <= 18; hour++) {
//     for (let minute = 0; minute < 60; minute += 30) {
//       const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
//       timeSlots.push(timeString);
//     }
//   }

//   // Get minimum date (today) and maximum date (3 months from now)
//   const today = new Date();
//   const minDate = today.toISOString().split('T')[0];
//   const maxDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full border border-green-600 text-gold py-3 px-4 rounded-md hover:bg-gold/10 transition-colors font-medium flex items-center justify-center gap-2"
//       >
//         <Calendar size={18} />
//         Schedule Viewing
//       </button>

//       {isOpen && (
//         <div className="absolute z-10 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
//           <h3 className="text-lg font-semibold mb-4">Schedule a Viewing</h3>
          
//           <form onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               {/* Date Picker */}
//               <div>
//                 <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
//                   Date
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="date"
//                     id="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     min={minDate}
//                     max={maxDate}
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
//                     required
//                   />
//                   <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//                 </div>
//               </div>

//               {/* Time Picker */}
//               <div>
//                 <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
//                   Time
//                 </label>
//                 <div className="relative">
//                   <select
//                     id="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     className="w-full border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold appearance-none"
//                     required
//                   >
//                     <option value="">Select a time</option>
//                     {timeSlots.map((slot) => (
//                       <option key={slot} value={slot}>
//                         {slot}
//                       </option>
//                     ))}
//                   </select>
//                   <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//                 </div>
//               </div>

//               {/* Additional Message */}
//               <div>
//                 <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
//                   Additional Notes (Optional)
//                 </label>
//                 <textarea
//                   id="message"
//                   rows={3}
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
//                   placeholder="Any special requests or notes..."
//                 />
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-navy text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors font-medium disabled:bg-green-400"
//               >
//                 {isSubmitting ? 'Scheduling...' : 'Confirm Viewing'}
//               </button>

//               {/* Success Message */}
//               {isSuccess && (
//                 <div className="p-2 bg-gold/15 text-navy rounded-md text-sm">
//                   Viewing scheduled successfully!
//                 </div>
//               )}
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScheduleViewing;


import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Clock, X, User, Mail, Phone } from 'lucide-react';

const ScheduleViewing: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  // Get property data from navigation state
  const property = state?.propertyId ? {
    id: state.propertyId,
    title: state.propertyTitle,
    image: state.propertyImage
  } : null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate time slots (every 30 minutes from 9AM to 5PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  // Get date range (today to 3 months from now)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would typically make an API call
      console.log('Scheduling viewing for property:', property?.id);
      console.log('Form data:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        navigate(-1); // Go back to previous page
      }, 3000);
    } catch (error) {
      console.error('Error scheduling viewing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Property Selected</h2>
          <p className="text-gray-600 mb-6">Please go back and select a property to schedule a viewing.</p>
          <button
            onClick={() => navigate('/properties')}
            className="w-full bg-navy text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-navy p-4 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Schedule Property Viewing</h1>
            <button 
              onClick={() => navigate(-1)}
              className="text-white hover:text-light"
            >
              <X size={24} />
            </button>
          </div>
          {property && (
            <div className="mt-2 flex items-center">
              <img 
                src={property.image} 
                alt={property.title}
                className="w-12 h-12 rounded-md object-cover mr-3"
              />
              <span className="font-medium">{property.title}</span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-ink mb-3">Your Information</h3>
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      required
                    />
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                        required
                      />
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                        required
                      />
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Viewing Details */}
            <div>
              <h3 className="text-lg font-medium text-ink mb-3">Viewing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={minDate}
                      max={maxDate}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                      required
                    />
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time *
                  </label>
                  <div className="relative">
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold appearance-none"
                      required
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold"
                placeholder="Any special requests or questions..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                isSubmitting || isSuccess
                  ? 'bg-green-400 text-white'
                  : 'bg-navy text-white hover:bg-secondary'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isSuccess ? (
                'Viewing Scheduled Successfully!'
              ) : (
                'Confirm Viewing Request'
              )}
            </button>

            {/* Success Message */}
            {isSuccess && (
              <div className="p-3 bg-gold/15 text-navy rounded-md text-center">
                Thank you! We've received your viewing request and will contact you shortly to confirm.
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleViewing;