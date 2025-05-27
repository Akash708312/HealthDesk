// import React from 'react';
// import { Mail, Linkedin } from 'lucide-react';

// const ContactInfo = () => {
//   return (
//     <section className="bg-gradient-to-b from-blue-100 to-blue-300 text-black py-[25px]">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <div className="inline-block mb-3 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
//             Get In Touch
//           </div>
//           <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
//             Contact Us Today
//           </h2>
//           <p className="text-gray-800 text-lg max-w-2xl mx-auto">
//             Have questions about our AI-powered sensor solutions? Reach out to our team and let's discuss how we can help bring your ideas to life.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Akash's Contact Info */}
//           <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-300">
//             <div className="flex flex-col items-center text-center">
//               <img 
//                 src="/akash.jpg"
//                 alt="Akash Kumar"
//                 className="w-32 h-32 rounded-full mb-4 object-cover"
//               />
//               <h3 className="text-xl font-bold text-gray-900">Akash Kumar</h3>
//               <p className="text-gray-600 mb-4">CEO & Founder</p>
//               <div className="flex flex-col space-y-3">
//                 <a href="mailto:akashjmp282@gmail.com" className="flex items-center text-gray-800 hover:text-blue-700">
//                   <Mail className="w-5 h-5 mr-2" />
//                   akashjmp282@gmail.com
//                 </a>
//                 <a 
//                   href="https://www.linkedin.com/in/akash-kumar-b8b96a308/" 
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center text-gray-800 hover:text-blue-700"
//                 >
//                   <Linkedin className="w-5 h-5 mr-2" />
//                   LinkedIn Profile
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* Sweksha's Contact Info */}
//           <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-300">
//             <div className="flex flex-col items-center text-center">
//               <img 
//                 src="/sid.jpg"
//                 alt="Siddharth Singh"
//                 className="w-32 h-32 rounded-full mb-4 object-cover"
//               />
//               <h3 className="text-xl font-bold text-gray-900">Siddharth Singh</h3>
//               <p className="text-gray-600 mb-4">COO & Founder</p>
//               <div className="flex flex-col space-y-3">
//                 <a href="mailto:siddharthsinghh71@gmail.com" className="flex items-center text-gray-800 hover:text-blue-700">
//                   <Mail className="w-5 h-5 mr-2" />
//                   siddharthsinghh71@gmail.com
//                 </a>
//                 <a 
//                   href="https://www.linkedin.com/in/siddharth-singh-6414432b2" 
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center text-gray-800 hover:text-blue-700"
//                 >
//                   <Linkedin className="w-5 h-5 mr-2" />
//                   LinkedIn Profile
//                 </a>
//               </div>
//             </div>
//           </div>
//           {/* Arjun's Contact Info */}
//           <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-300">
//             <div className="flex flex-col items-center text-center">
//               <img 
//                 src="/arjun.jpg"
//                 alt="Arjun Srivastava"
//                 className="w-32 h-32 rounded-full mb-4 object-cover"
//               />
//               <h3 className="text-xl font-bold text-gray-900">Arjun Srivastava</h3>
//               <p className="text-gray-600 mb-4">CHAMAR</p>
//               <div className="flex flex-col space-y-3">
//                 <a href="mailto:iamarjunsrivastava@gmail.com" className="flex items-center text-gray-800 hover:text-blue-700">
//                   <Mail className="w-5 h-5 mr-2" />
//                   iamarjunsrivastava@gmail.com
//                 </a>
//                 <a 
//                   href="https://www.linkedin.com/in/akash-kumar-b8b96a308/" 
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center text-gray-800 hover:text-blue-700"
//                 >
//                   <Linkedin className="w-5 h-5 mr-2" />
//                   LinkedIn Profile
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactInfo;


import React from 'react';
import { Mail, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut'
    }
  })
};

const teamMembers = [
  {
    name: 'Akash Kumar',
    role: 'CEO & Founder',
    image: '/akash.jpg',
    email: 'akashjmp282@gmail.com',
    linkedin: 'https://www.linkedin.com/in/akash-kumar-b8b96a308/',
  },
  {
    name: 'Siddharth Singh',
    role: 'COO & Founder',
    image: '/sid.jpg',
    email: 'siddharthsinghh71@gmail.com',
    linkedin: 'https://www.linkedin.com/in/siddharth-singh-6414432b2',
  },
  {
    name: 'Arjun Srivastava',
    role: 'CTO',
    image: '/arjun.jpg',
    email: 'iamarjunsrivastava@gmail.com',
    linkedin: 'https://www.linkedin.com/in/arjun-srivastava-228021282',
  }
];

const ContactInfo = () => {
  return (
    <section className="bg-gradient-to-b from-blue-100 to-blue-300 text-black py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <div className="inline-block mb-3 px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
            Get In Touch
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Contact Us Today
          </h2>
          <p className="text-gray-800 text-lg max-w-2xl mx-auto">
            Have questions about our AI-powered sensor solutions? Reach out to our team and let's discuss how we can help bring your ideas to life.
          </p>
        </motion.div>

        {/* Right-aligned team member cards */}
        <div className="flex justify-end">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-fit">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                className="group bg-white rounded-2xl shadow-xl p-8 border border-gray-200 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <div className="overflow-hidden rounded-full mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex flex-col items-center space-y-3">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center text-gray-800 hover:text-blue-700"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    {member.email}
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-800 hover:text-blue-700"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn Profile
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;

