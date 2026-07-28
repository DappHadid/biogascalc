import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRightIcon,
  BookOpenIcon,
  HomeIcon,
  MailIcon,
  OctagonXIcon,
  TagIcon,
} from "lucide-react";

const pages = [
  {
    icon: HomeIcon,
    title: "Beranda",
    description: "Kembali ke halaman utama",
    href: "/",
  },
  {
    icon: BookOpenIcon,
    title: "Rancang Dome",
    description: "Desain reaktor biogas",
    href: "/rancang-dome",
  },
  {
    icon: TagIcon,
    title: "Kalkulator",
    description: "Hitung potensi limbah",
    href: "/kalkulator-limbah",
  },
  {
    icon: MailIcon,
    title: "Kontak",
    description: "Hubungi tim kami",
    href: "/contact",
  },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-white">
      <div className="flex w-16 h-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
        <OctagonXIcon className="w-8 h-8 text-slate-500" />
      </div>
      <h1 className="mt-6 font-medium text-[2rem] tracking-tight text-slate-900">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-sm text-slate-500">
        Berikut adalah beberapa halaman yang mungkin dapat membantu Anda menemukan apa yang Anda cari.
      </p>
      <div className="mt-10 grid w-full max-w-lg gap-3 sm:grid-cols-2 text-left">
        {pages.map((page) => (
          <Link
            key={page.href}
            to={page.href}
            className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
          >
            <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <page.icon className="w-5 h-5 text-slate-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-slate-900">{page.title}</p>
              <p className="truncate text-slate-500 text-xs">
                {page.description}
              </p>
            </div>
            <ArrowRightIcon className="w-4 h-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
      <Link 
        to="/"
        className="mt-10 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> 
        Kembali ke Beranda
      </Link>
    </div>
  );
}
