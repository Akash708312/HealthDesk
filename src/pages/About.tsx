import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: "Akash Kumar",
      role: "CEO & Founder",
      bio: "Specializing in cloud infrastructure and APIs for seamless data integration.",
      image: "/akash.jpg"
    },
    {
      name: "Siddharth Singh",
      role: "COO & Founder",
      bio: "Leading HealthDesk Technologies with a vision to transform the future of smart healthcare.",
      image: "/sid.jpg"
    },
    {
      name: "Arjun Srivastava",
      role: "CTO",
      bio: "Driving the tech team with deep expertise in IoT and real-time systems.",
      image: "/arjun.jpg"
    }
  ];

  return (
    <PageLayout>
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>

            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-6"
            >
              About HealthDesk
            </motion.h1>

            <div className="prose prose-lg max-w-none">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-gray-600 mb-12"
              >
                We're a team of innovators dedicated to revolutionizing health technology for medicos worldwide.
              </motion.p>

              {/* ... MISSION, VALUES, STORY SECTIONS REMAIN UNCHANGED ... */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-6">Our Team</h2>
                <p className="text-gray-600 mb-8">
                  Our diverse team combines expertise in  electronics, software development,
                  artificial intelligence, and industry-specific knowledge to deliver holistic solutions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gray-50 border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                              />
                            </div>
                            <h3 className="font-bold text-lg">{member.name}</h3>
                            <p className="text-gray-500 text-sm mb-2">{member.role}</p>
                            <p className="text-gray-600 text-sm">{member.bio}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <div className="mt-16 pt-8 border-t border-gray-200">
                <Link to="/careers" className="inline-flex items-center px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all group">
                  Join Our Team
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
