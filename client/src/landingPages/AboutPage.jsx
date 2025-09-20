import React from 'react';
import NavBar2 from './NavBar';
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from './Footer';

const AboutPage = () => {

  AOS.init();
  

  return (
    <>

    <NavBar2 />

    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-black text-white">
        
        
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
        ></div>
        <div className="container mx-auto px-6 relative z-10 " data-aos="fade-up" data-aos-duration="2000">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Capturing Moments, Creating Memories</h1>
            <p className="text-xl text-gray-300">Professional photography studio with over 15 years of excellence in visual storytelling</p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center overflow-hidden">
            <div className="md:w-1/2 mb-10 md:mb-0 max-h-130">
              <img  data-aos="fade-right" data-aos-duration="2000"
                src="https://images.unsplash.com/photo-1650688331261-fd5e6de2e23a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Our studio" 
                className="rounded-lg shadow-lg transform transition-transform duration-700 hover:rotate-1"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2008, Lenscraft Studios began as a small passion project between two photography enthusiasts. 
                What started in a modest garage studio has now evolved into one of the region's most respected photography studios.
              </p>
              <p className="text-gray-600 mb-4">
                Our journey has been guided by a simple philosophy: every moment has a story worth preserving. 
                Through years of dedication to our craft, we've had the privilege of documenting thousands of special moments 
                for families, businesses, and artists.
              </p>
              <p className="text-gray-600">
                Today, we're proud to house state-of-the-art equipment and a team of award-winning photographers 
                who continue to push the boundaries of creative expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our talented photographers and creative professionals bring diverse expertise 
              to ensure every project receives the perfect visual treatment.
            </p>
          </div>
          
          {/* Enhanced Team Members Grid with Rotation Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group" data-aos="zoom-in" data-aos-duration="2000">
                <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg relative">
                  <div className="w-full h-full transform transition-all duration-500 group-hover:rotate-3">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                  {/* Professional overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">{member.name}</h3>
                <p className="text-gray-600 mb-2 transition-colors duration-300 group-hover:text-gray-800">{member.role}</p>
                <p className="text-gray-500 text-sm opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-48 transition-all duration-500 overflow-hidden">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from client interactions to final deliverables.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center transform transition-transform duration-500 hover:rotate-12">
                  <span className="text-2xl text-blue-600">{value.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="transform transition-transform duration-300 hover:scale-105">
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
    </div>

    <Footer />
    </>
  );
};

// Team members data
const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Lead Photographer",
    bio: "Specializing in portrait and commercial photography with 12+ years experience. Sarah's work has been featured in several international publications.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Michael Chen",
    role: "Studio Director",
    bio: "Expert in lighting techniques and studio management with a background in fine arts. Michael ensures every project meets our high standards.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Elena Rodriguez",
    role: "Creative Director",
    bio: "Award-winning photographer with expertise in editorial and fashion photography. Elena brings creative vision to every project.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "James Wilson",
    role: "Post-Production Specialist",
    bio: "Digital artist and retouching expert with a keen eye for detail and color grading. James ensures every image is perfect before delivery.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  }
];

// Values data
const values = [
  {
    icon: "🎯",
    title: "Excellence",
    description: "We pursue perfection in every shot, paying attention to the smallest details to deliver exceptional quality."
  },
  {
    icon: "💡",
    title: "Creativity",
    description: "We approach each project with fresh eyes, developing unique concepts that tell your story in compelling ways."
  },
  {
    icon: "🤝",
    title: "Collaboration",
    description: "We work closely with our clients throughout the process, ensuring their vision is realized and exceeded."
  }
];

// Stats data
const stats = [
  {
    value: "15+",
    label: "Years Experience"
  },
  {
    value: "2500+",
    label: "Projects Completed"
  },
  {
    value: "98%",
    label: "Client Satisfaction"
  },
  {
    value: "12",
    label: "Industry Awards"
  }
];

export default AboutPage;