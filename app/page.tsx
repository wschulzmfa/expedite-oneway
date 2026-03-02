"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CitiesSection } from "@/components/CitiesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { PrizeSection } from "@/components/PrizeSection";
import { SignupForm } from "@/components/SignupForm";
import { SponsorModal } from "@/components/SponsorModal";
import { AffiliatesModal } from "@/components/AffiliatesModal";
import { O1AQuiz } from "@/components/O1AQuiz";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [showSponsor, setShowSponsor] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAffiliate, setShowAffiliate] = useState(false);
  const [defaultCity, setDefaultCity] = useState<string | undefined>();

  const openSignup = (city?: string) => {
    setDefaultCity(city);
    setShowSignup(true);
    setShowQuiz(false);
  };

  return (
    <main className="min-h-screen bg-[#080C14]">
      <Navbar onApply={() => openSignup()} />
      <div className="pt-14">
        <HeroSection
          onApply={() => openSignup()}
          onSponsor={() => setShowSponsor(true)}
          onQuiz={() => setShowQuiz(true)}
          onAffiliate={() => setShowAffiliate(true)}
        />
        <div id="how-it-works">
          <HowItWorks onQuiz={() => setShowQuiz(true)} />
        </div>
        <CitiesSection onRegister={(city) => openSignup(city)} />
        <PrizeSection />
        <Footer />
      </div>

      {showSignup && (
        <SignupForm defaultCity={defaultCity} onClose={() => setShowSignup(false)} />
      )}
      {showSponsor && (
        <SponsorModal onClose={() => setShowSponsor(false)} />
      )}
      {showAffiliate && (
        <AffiliatesModal onClose={() => setShowAffiliate(false)} />
      )}
      {showQuiz && (
        <O1AQuiz
          onClose={() => setShowQuiz(false)}
          onSignup={() => {
            setShowQuiz(false);
            openSignup();
          }}
        />
      )}
    </main>
  );
}
