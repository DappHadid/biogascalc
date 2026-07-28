import React from "react";
import { TeamSection } from "../components/ui/team-section";
import { MessageCircle, Users, Camera, Video, Code, Briefcase } from "lucide-react";

import Footer from "../components/layouts/Footer";

export default function Contact() {
  const teamMembers = [
    {
      name: "Dr. CHOERUDIN S.T., M.T",
      designation: "Team Member",
      imageSrc: "/CHOERUDIN.webp",
      socialLinks: [
        { icon: MessageCircle, href: "#" },
        { icon: Briefcase, href: "#" },
      ],
    },
    {
      name: "Dr. SALAFUDIN S.T, M.Sc",
      designation: "Team Member",
      imageSrc: "/SALAFUDIN.webp",
      socialLinks: [
        { icon: Code, href: "#" },
        { icon: MessageCircle, href: "#" },
      ],
    },
    {
      name: "ASEP RIZAL NURJAMAN S.KOM.,M.KOM",
      designation: "Team Member",
      imageSrc: "/ASEP_RIZAL.webp",
      socialLinks: [
        { icon: Users, href: "#" },
        { icon: Camera, href: "#" },
      ],
    },
    {
      name: "EUNEKE WIDYANINGSIH S.T., M.T",
      designation: "Team Member",
      imageSrc: "/EUNEKE_WIDYANINGSIH.webp",
      socialLinks: [
        { icon: MessageCircle, href: "#" },
        { icon: Users, href: "#" },
      ],
    },
    {
      name: "DAFFA MAULANA IBRAHIM",
      designation: "Team Member",
      imageSrc: "/DAFFA.webp",
      socialLinks: [
        { icon: Code, href: "#" },
        { icon: Briefcase, href: "#" },
      ],
    },
        {
      name: "MUHAMMAD AXEL SYAHWIN",
      designation: "Team Member",
      imageSrc: "/AXEL.webp",
      socialLinks: [
        { icon: Code, href: "#" },
        { icon: Briefcase, href: "#" },
      ],
    },
  ];

  const mainSocialLinks = [
    { icon: MessageCircle, href: "#" },
    { icon: Users, href: "#" },
    { icon: Camera, href: "#" },
    { icon: Video, href: "#" },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-white pt-20">
      <TeamSection
        title="PKM TEAM"
        description="Kami adalah tim inovator di balik BioGasCalc, sebuah proyek Program Kreativitas Mahasiswa (PKM) yang berdedikasi untuk mendorong transisi energi terbarukan di Indonesia. Melalui kolaborasi lintas disiplin, kami mengembangkan solusi teknologi terpadu yang mempermudah peternak dan masyarakat dalam merancang reaktor biogas secara presisi, efisien, dan ramah lingkungan."
        members={teamMembers}
        socialLinksMain={mainSocialLinks}
      />
      <Footer showCTA={false} />
    </div>
  );
}
