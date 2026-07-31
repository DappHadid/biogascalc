import React from "react";
import { TeamSection } from "../components/ui/team-section";
import { MessageCircle, Users, Camera, Video, Code, Briefcase, MapPin, Globe } from "lucide-react";

import Footer from "../components/layouts/Footer";

export default function Contact() {
  const teamMembers = [
    {
      name: "Dr. CHOERUDIN S.T., M.T",
      designation: "Ketua PKM",
      imageSrc: "/CHOERUDIN.webp",
      socialLinks: [
        { icon: MessageCircle, href: "#" },
        { icon: Briefcase, href: "#" },
      ],
    },
    {
      name: "Dr. SALAFUDIN S.T, M.Sc",
      designation: "Dosen Pembimbing",
      imageSrc: "/SALAFUDIN.webp",
      socialLinks: [
        { icon: Code, href: "#" },
        { icon: MessageCircle, href: "#" },
      ],
    },
    {
      name: "ASEP RIZAL NURJAMAN S.KOM.,M.KOM",
      designation: "Dosen Pembimbing",
      imageSrc: "/ASEP_RIZAL.webp",
      socialLinks: [
        { icon: Users, href: "#" },
        { icon: Camera, href: "#" },
      ],
    },
    {
      name: "EUNEKE WIDYANINGSIH S.T., M.T",
      designation: "Dosen Pembimbing",
      imageSrc: "/EUNEKE_WIDYANINGSIH.webp",
      socialLinks: [
        { icon: MessageCircle, href: "#" },
        { icon: Users, href: "#" },
      ],
    },
    {
      name: "DAFFA MAULANA IBRAHIM",
      designation: "Anggota Tim",
      imageSrc: "/DAFFA.webp",
      socialLinks: [
        { icon: Code, href: "#" },
        { icon: Briefcase, href: "#" },
      ],
    },
    {
      name: "MUHAMMAD AXEL SYAHWIN",
      designation: "Anggota Tim",
      imageSrc: "/AXEL.webp",
      socialLinks: [
        { icon: Code, href: "#" },
        { icon: Briefcase, href: "#" },
      ],
    },
  ];

  const mainSocialLinks = [
    { icon: MapPin, href: "https://maps.app.goo.gl/w2yze2uSVrv47Hti6" },
    { icon: Video, href: "https://youtu.be/3tIq8IRp3ZU?si=yAe1Z7kVk4vtkwPg" },
    { icon: Globe, href: "https://www.itenas.ac.id/" },
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
