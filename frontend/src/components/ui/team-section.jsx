import React from "react";
import { motion } from "framer-motion";
export const TeamSection = React.forwardRef(
  (
    {
      title,
      description,
      members,
      registerLink,
      logo,
      socialLinksMain,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={`relative w-full overflow-hidden bg-white pb-12 md:pb-24 lg:pb-32 pt-8 md:pt-12 lg:pt-16 ${className || ""}`}
        {...props}
      >
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center gap-8 px-4 md:px-0">
          {/* Background Grid - for visual appeal */}
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="h-full w-full" fill="none">
              <defs>
                <pattern
                  id="grid"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M40 0L0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-200"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Header Section */}
          <div className="relative z-10 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-start md:text-left lg:gap-8">
            <div className="grid gap-2 text-left w-full">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-slate-900">
                <span className="text-emerald-600 block text-xl sm:text-2xl md:text-3xl font-medium mb-1">
                  OUR
                </span>
                <span className="text-slate-900">{title}</span>
              </h1>
              <p className="w-full text-slate-600 md:text-base lg:text-lg mt-4 text-justify">
                {description}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 md:items-end">
              {logo && <div className="text-2xl font-bold text-slate-900">{logo}</div>}
              {registerLink && (
                <a
                  href={registerLink}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-300 disabled:pointer-events-none disabled:opacity-50"
                >
                  REGISTER NOW
                </a>
              )}
            </div>
          </div>

          {/* Main Social Links */}
          {socialLinksMain && socialLinksMain.length > 0 && (
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 py-8 md:flex-row">
              <div className="flex gap-4">
                {socialLinksMain.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
              <span className="text-slate-300 text-sm hidden md:inline">|</span>
              <span className="text-slate-500 text-sm">www.owren.tech</span>
            </div>
          )}

          {/* Team Members Grid */}
          <div className="relative z-10 grid w-full grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8">
            {members.map((member, index) => (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                key={index}
                className="group relative flex flex-col items-center justify-end overflow-hidden rounded-xl p-8 text-center transition-all duration-300 ease-in-out hover:scale-[1.02] transform-gpu bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
              >
                {/* Background wave animation */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[65%] origin-bottom scale-y-0 transform rounded-t-[50%] bg-[#1a1a1a] transition-transform duration-500 ease-out group-hover:scale-y-100"
                  style={{ transitionDelay: `${index * 50}ms` }}
                />

                {/* Member Image */}
                <div
                  className="relative z-10 h-40 w-40 overflow-hidden rounded-full bg-gray-100 transition-all duration-500 ease-out group-hover:scale-105 mb-6 border-4 border-transparent group-hover:border-[#1a1a1a]"
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <img
                    src={member.imageSrc}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                </div>

                <h3 className="relative z-10 text-base font-bold text-slate-900 group-hover:text-white transition-colors duration-300 uppercase tracking-wider">
                  {member.name}
                </h3>
                <p className="relative z-10 text-sm text-slate-500 group-hover:text-gray-400 transition-colors duration-300 mt-1">
                  {member.designation}
                </p>

                {/* Social Links for individual members */}
                {member.socialLinks && member.socialLinks.length > 0 && (
                  <div className="relative z-10 mt-6 flex gap-4 opacity-0 translate-y-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                    {member.socialLinks.map((link, linkIndex) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={linkIndex}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

TeamSection.displayName = "TeamSection";
